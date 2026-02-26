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
    const q = query.toLowerCase();

    // Extract price constraint from query e.g. "under $100"
    const priceMatch = q.match(/under\s*\$?(\d+)/);
    const maxPrice = priceMatch ? parseInt(priceMatch[1]) : null;

    const directMatches = INVENTORY.filter((item) => {
        // Price hard filter
        if (maxPrice !== null && item.price > maxPrice) return false;

        const itemText = `${item.title} ${item.location} ${item.tags.join(" ")}`.toLowerCase();

        // Exact tag match is a strong signal
        const tagMatch = item.tags.some(
            (t) => q.includes(t) || q.includes(t.replace("-", " "))
        );

        // Count significant word hits
        const queryWords = q.split(" ").filter((w) => w.length > 3);
        const hits = queryWords.filter((w) => itemText.includes(w)).length;

        return tagMatch || hits >= 2;
    });

    // Only use early return for high-confidence, narrow matches
    // If too many match, OpenAI can rank them better
    if (directMatches.length > 0 && directMatches.length <= 3) {
        return directMatches.map((item) => ({
            id: item.id,
            reason: `Directly matches your search for ${item.tags.join(", ")} in ${item.location}`,
            matchStrength: "Great Match",
        }));
    }

    // Fall through to OpenAI for nuanced understanding
    return null;
}

// SYSTEM PROMPT
// Strict grounding — inventory embedded directly in prompt
// Short and precise to minimise token usage
const SYSTEM_PROMPT = `You are a Sri Lanka travel matching assistant.

Your ONLY job is to match the user's query to experiences from this exact inventory:
${JSON.stringify(INVENTORY, null, 2)}

STRICT RULES:
1. ONLY return IDs that exist in the list above (1, 2, 3, 4, 5)
2. NEVER invent or suggest any destination not in the list
3. Match based on: tag overlap, price constraints, location, vibe
4. If user mentions a budget like "under $100", exclude items above that price
5. Rank best matches first
6. If nothing matches, return empty matches array

Respond ONLY with this exact JSON — no extra text, no markdown:
{
  "matches": [
    {
      "id": <number>,
      "reason": "<one sentence why this matches>",
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
