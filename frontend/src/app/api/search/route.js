import OpenAI from "openai";
import { z } from "zod";
import { NextResponse } from "next/server";

// INVENTORY
// This is what gets sent to OpenAI in the system prompt
const INVENTORY = [
    { id: 1, title: "High-Altitude Tea Trails", location: "Nuwara Eliya", price: 120, tags: ["cold", "nature", "hiking"] },
    { id: 2, title: "Coastal Heritage Wander", location: "Galle Fort", price: 45, tags: ["history", "culture", "walking"] },
    { id: 3, title: "Wild Safari Expedition", location: "Yala", price: 250, tags: ["animals", "adventure", "photography"] },
    { id: 4, title: "Surf & Chill Retreat", location: "Arugam Bay", price: 80, tags: ["beach", "surfing", "young-vibe"] },
    { id: 5, title: "Ancient City Exploration", location: "Sigiriya", price: 110, tags: ["history", "climbing", "view"] },
];

const VALID_IDS = new Set(INVENTORY.map((i) => i.id));

// ZOD SCHEMA
// Enforces AI can ONLY return IDs that exist in our inventory
// Any hallucinated ID is rejected here before reaching the UI
const ResponseSchema = z.object({
    matches: z.array(
        z.object({
            id: z.number().int().refine((id) => VALID_IDS.has(id), {
                message: "ID not in inventory — hallucination blocked",
            }),
            reason: z.string().min(1).max(300),
            matchStrength: z.enum(["Top Pick", "Great Match", "Possible Match"]),
        })
    ).max(5),
});

// RATE LIMITER
// Max 10 requests per IP per minute
const rateLimitMap = new Map();
function isRateLimited(ip) {
    const now = Date.now();
    const timestamps = (rateLimitMap.get(ip) || []).filter(
        (t) => now - t < 60_000
    );
    if (timestamps.length >= 10) return true;
    rateLimitMap.set(ip, [...timestamps, now]);
    return false;
}

// QUERY CACHE
// Identical queries skip OpenAI entirely — saves tokens + latency
// In production this would be Redis with distributed TTL
// For this demo, in-memory Map with 1 hour TTL is sufficient
const queryCache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function getCached(query) {
    const key = query.toLowerCase().trim();
    const entry = queryCache.get(key);
    if (!entry) return null;
    // Expire stale entries
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
        queryCache.delete(key);
        return null;
    }
    return entry.results;
}

function setCache(query, results) {
    queryCache.set(query.toLowerCase().trim(), {
        results,
        timestamp: Date.now(),
    });
}

// EARLY RETURN KEYWORD FILTER
// Scalability feature: if a simple keyword match is strong enough,
// skip the LLM entirely — returns in <50ms and costs $0
// Only falls through to OpenAI for nuanced/ambiguous queries
function earlyKeywordMatch(query) {
    const q = query.toLowerCase().trim();

    // Extract price ceiling from common patterns
    const pricePatterns = [
        /under\s*\$?(\d+)/,
        /below\s*\$?(\d+)/,
        /less\s+than\s*\$?(\d+)/,
        /max\s*\$?(\d+)/,
        /\$(\d+)\s*(?:budget|max|limit)/,
        /budget\s*(?:of|is|:)?\s*\$?(\d+)/,
    ];

    let maxPrice = null;
    for (const pattern of pricePatterns) {
        const m = q.match(pattern);
        if (m) { maxPrice = parseInt(m[1]); break; }
    }

    // Only intercept pure budget-only queries
    // e.g. "budget under $1000", "anything under $50"
    // Strip all price/budget words — if almost nothing left, it's budget-only
    const stripped = q
        .replace(/under|below|budget|less|than|above|max|min|anything|something|show|me|options|experiences|trips?|travel|\$|\d+/g, "")
        .trim();

    const isBudgetOnly = maxPrice !== null && stripped.length < 4;

    if (isBudgetOnly) {
        const fitting = INVENTORY
            .filter((item) => item.price <= maxPrice)
            .sort((a, b) => a.price - b.price);

        if (fitting.length > 0) {
            return fitting.map((item) => ({
                id: item.id,
                reason: `Fits your $${maxPrice} budget at $${item.price}pp — includes ${item.tags.join(", ")}`,
                matchStrength: item.price <= maxPrice * 0.5 ? "Top Pick" : "Great Match",
            }));
        }
    }

    // Everything else — let OpenAI handle for proper intent understanding
    return null;
}

// SYSTEM PROMPT
// Strict grounding — inventory embedded directly in prompt
// Short and precise to minimise token usage
const SYSTEM_PROMPT = `You are a Sri Lanka travel experience matching assistant.

You have exactly 5 experiences in your inventory:
${JSON.stringify(INVENTORY, null, 2)}

YOUR JOB:
The user will describe what they want in natural language. Your job is to find the BEST matching experiences from the inventory above based on similarity of intent, mood, tags, price, and location.

MATCHING LOGIC:
- "beach", "surf", "waves", "ocean", "chill by the water" → id 4 (Arugam Bay)
- "history", "heritage", "ancient", "ruins", "colonial", "culture" → id 2 or 5
- "wildlife", "animals", "safari", "leopard", "elephant", "nature" → id 3
- "hiking", "tea", "mountain", "highlands", "cold", "misty", "nature" → id 1
- "climbing", "rock", "fortress", "views", "ancient city" → id 5
- Budget queries: exclude items above the stated price ceiling
- Vibe mapping: "adventurous" → id 3, "relaxed/chill" → id 4, "cultural" → id 2 or 5, "scenic/nature" → id 1

RULES:
1. ONLY return IDs from the inventory: 1, 2, 3, 4, 5
2. NEVER invent destinations outside this list
3. ALWAYS return at least 1 result — pick the closest match even for vague queries
4. If budget is mentioned, exclude items above that price — but still return the best of what fits
5. Rank by relevance — best match first
6. For vague or unusual queries, use your best judgement to map intent to the closest experience
7. reason must clearly explain WHICH tag, price, location, or vibe matched and WHY

Respond ONLY with this exact JSON — no extra text, no markdown:
{
  "matches": [
    {
      "id": <number>,
      "reason": "<specific: which tag/price/location/vibe matched this query>",
      "matchStrength": "<Top Pick | Great Match | Possible Match>"
    }
  ]
}`;

// POST HANDLER
export async function POST(req) {
    // 1. Rate limit
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (isRateLimited(ip)) {
        return NextResponse.json(
            { error: "Too many requests. Wait a minute and try again." },
            { status: 429 }
        );
    }

    // 2. Parse and validate request body
    let query;
    try {
        const body = await req.json();
        query = body.query;
    } catch {
        return NextResponse.json(
            { error: "Invalid request body" },
            { status: 400 }
        );
    }

    if (!query || !query.trim()) {
        return NextResponse.json(
            { error: "Query is required" },
            { status: 400 }
        );
    }

    if (query.length > 500) {
        return NextResponse.json(
            { error: "Query too long. Keep it under 500 characters." },
            { status: 400 }
        );
    }

    // 3. Cache check — identical query, skip OpenAI entirely
    const cached = getCached(query);
    if (cached) {
        return NextResponse.json({
            results: cached,
            query: query.trim(),
            total: cached.length,
            source: "cache",
        });
    }

    // 4. Early return keyword filter — strong exact match, skip OpenAI
    const earlyMatches = earlyKeywordMatch(query);
    if (earlyMatches) {
        const fullInventory = (await import("../../../../data/inventory.js")).default;
        const results = earlyMatches
            .map((match) => {
                const item = fullInventory.find((i) => i.id === match.id);
                if (!item) return null;
                return {
                    ...item,
                    reason: match.reason,
                    matchStrength: match.matchStrength,
                    reasons: [match.reason],
                };
            })
            .filter(Boolean);

        // Cache before returning
        setCache(query, results);

        return NextResponse.json({
            results,
            query: query.trim(),
            total: results.length,
            source: "keyword",
        });
    }

    // 5. Call OpenAI — only reached for nuanced/ambiguous queries
    let rawText;
    try {
        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.1,       // near-zero = deterministic output
            max_tokens: 500,
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: query.trim() },
            ],
        });

        rawText = completion.choices[0]?.message?.content || "";

    } catch (err) {
        console.error("OpenAI API error:", err);
        return NextResponse.json(
            { error: "AI service unavailable. Please try again." },
            { status: 502 }
        );
    }

    // 6. Parse JSON — strip markdown fences if model wraps response
    let parsed;
    try {
        const cleaned = rawText.replace(/```json|```/g, "").trim();
        parsed = JSON.parse(cleaned);
    } catch {
        console.error("JSON parse failed. Raw response:", rawText);
        return NextResponse.json(
            { error: "AI returned unexpected format. Try again." },
            { status: 500 }
        );
    }

    // 7. Zod validation — rejects any hallucinated IDs
    const validated = ResponseSchema.safeParse(parsed);
    if (!validated.success) {
        console.error("Zod validation failed:", validated.error.flatten());
        return NextResponse.json(
            { error: "Response validation failed", details: validated.error.flatten() },
            { status: 500 }
        );
    }

    // 8. Join validated IDs back to full inventory objects
    // Data comes from our file — not from the AI response
    const fullInventory = (await import("../../../../data/inventory.js")).default;
    const results = validated.data.matches
        .map((match) => {
            const item = fullInventory.find((i) => i.id === match.id);
            if (!item) return null;
            return {
                ...item,
                reason: match.reason,
                matchStrength: match.matchStrength,
                reasons: [match.reason],
            };
        })
        .filter(Boolean);

    // 9. Cache result before returning
    setCache(query, results);

    // 10. Return final response
    return NextResponse.json({
        results,
        query: query.trim(),
        total: results.length,
        source: "openai",
    });
}
