// Client-side fallback scorer
// Used only if the API call fails — keeps the app functional offline
// Handles: intent keywords, tags, location, price, vague queries, budget-only queries

function matchInventory(query, inventory) {
    const q = query.toLowerCase().trim();

    // ── Intent map — broad keyword coverage for natural language ──
    const intentMap = {
        beach: ["beach", "surf", "surfing", "ocean", "sea", "coast", "wave", "coastal", "bay", "water", "shore", "swim"],
        adventure: ["adventure", "adventurous", "wild", "safari", "trek", "trekking", "expedition", "thrill", "adrenaline", "action", "exciting", "extreme"],
        history: ["history", "historical", "heritage", "ancient", "ruins", "ruin", "culture", "cultural", "fort", "colonial", "old", "medieval", "archaeolog", "monument", "temple", "fortress"],
        nature: ["nature", "natural", "green", "mountain", "tea", "trail", "hike", "hiking", "forest", "misty", "mist", "highland", "plantation", "scenic", "countryside", "landscape", "trees"],
        photography: ["photo", "photos", "photograph", "photography", "camera", "shoot", "shooting", "capture", "scenery", "scenic", "view", "views", "picture", "pictures", "instagram"],
        relaxing: ["chill", "chilled", "relax", "relaxed", "relaxing", "slow", "peaceful", "peace", "retreat", "unwind", "calm", "easy", "laid back", "lazy", "quiet", "tranquil", "rest"],
        wildlife: ["animal", "animals", "wildlife", "leopard", "elephant", "elephants", "safari", "bird", "birds", "creature", "creatures", "zoo", "jungle", "predator", "mammal"],
        climbing: ["climb", "climbing", "climber", "hike", "summit", "rock", "fortress", "ascent", "altitude", "high", "steep", "up", "viewpoint", "top"],
        cold: ["cold", "cool", "misty", "mist", "highland", "altitude", "chilly", "fresh air", "mountain", "elevation"],
        young: ["young", "youngsters", "party", "vibe", "vibes", "fun", "backpack", "backpacker", "hostel", "social", "crowd", "lively", "energetic"],
        budget: ["budget", "cheap", "affordable", "inexpensive", "low cost", "value", "economical", "save money", "cost effective", "reasonable"],
        luxury: ["luxury", "luxurious", "premium", "high end", "exclusive", "fancy", "special", "splurge"],
    };

    // ── Price extraction — handles many natural language patterns ──
    const pricePatterns = [
        /under\s*\$?(\d+)/,
        /below\s*\$?(\d+)/,
        /less\s+than\s*\$?(\d+)/,
        /cheaper\s+than\s*\$?(\d+)/,
        /max(?:imum)?\s*\$?(\d+)/,
        /\$(\d+)\s*(?:budget|max|limit|cap|or\s+less)/,
        /budget\s*(?:of|is|around|under|below|:)?\s*\$?(\d+)/,
        /(?:spend|spending)\s*\$?(\d+)/,
        /(?:cost|costs|costing)\s*(?:under|below|less than)?\s*\$?(\d+)/,
        /up\s+to\s*\$?(\d+)/,
    ];

    let maxPrice = null;
    for (const pattern of pricePatterns) {
        const match = q.match(pattern);
        if (match) { maxPrice = parseInt(match[1]); break; }
    }

    // ── Detect budget-only query ──────────────────────────────────
    // e.g. "budget under $1000", "anything under $200", "cheap options"
    const stripped = q
        .replace(/under|below|budget|less|than|above|max|min|anything|something|show|me|all|options|experiences?|trips?|travel|find|want|need|looking|for|give|\$|\d+/g, "")
        .trim();
    const isBudgetOnly = (maxPrice !== null && stripped.length < 4) ||
        (q.includes("budget") && stripped.length < 6);

    // ── Score each inventory item ─────────────────────────────────
    const scored = inventory.map((item) => {
        let score = 0;
        const reasons = [];
        const itemText = `${item.title} ${item.location} ${item.tags.join(" ")} ${item.description || ""}`.toLowerCase();

        // 1. Budget-only query — all fitting items get high base score
        if (isBudgetOnly && maxPrice !== null) {
            if (item.price <= maxPrice) {
                score += 60;
                reasons.push(`Fits your $${maxPrice} budget at just $${item.price}pp`);
            } else {
                score -= 100; // hard exclude over budget
            }
        }

        // 2. Price filter for non-budget-only queries
        if (!isBudgetOnly && maxPrice !== null) {
            if (item.price <= maxPrice) {
                score += 20;
                reasons.push(`Within your $${maxPrice} budget — $${item.price}pp`);
            } else {
                score -= 100; // hard exclude over budget
            }
        }

        // 3. Intent matching
        for (const [, keywords] of Object.entries(intentMap)) {
            const userWants = keywords.some((k) => q.includes(k));
            const itemHas = keywords.some((k) => itemText.includes(k));
            if (userWants && itemHas) {
                score += 30;
                const hit = item.tags.find((t) => keywords.includes(t));
                if (hit && !reasons.some((r) => r.includes(hit))) {
                    reasons.push(`Matches your "${hit}" interest`);
                }
            }
        }

        // 4. Direct tag match
        item.tags.forEach((tag) => {
            const tagNorm = tag.replace("-", " ");
            if (q.includes(tagNorm) || q.includes(tag)) {
                score += 25;
                if (!reasons.some((r) => r.includes(tag))) {
                    reasons.push(`Tagged as "${tag}"`);
                }
            }
        });

        // 5. Location mention
        const locationWords = item.location.toLowerCase().split(" ");
        if (locationWords.some((w) => w.length > 3 && q.includes(w))) {
            score += 40;
            reasons.push(`You mentioned ${item.location}`);
        }

        // 6. Partial word hits — catches synonyms and partial matches
        q.split(" ")
            .filter((w) => w.length > 3)
            .forEach((w) => {
                if (itemText.includes(w)) score += 5;
            });

        // 7. Build final reasons
        const finalReasons = [...new Set(reasons)].slice(0, 3);

        return {
            ...item,
            score,
            reasons: finalReasons.length > 0
                ? finalReasons
                : ["Relevant to your search"],
            matchStrength:
                score >= 60 ? "Top Pick" :
                    score >= 30 ? "Great Match" : "Possible Match",
        };
    }).sort((a, b) => b.score - a.score);

    // ── Always return something — never show empty ────────────────
    // If good matches exist, return them
    const goodMatches = scored.filter((i) => i.score > 0);
    if (goodMatches.length > 0) return goodMatches;

    // Fallback: return top 3 as "Possible Match" for vague queries
    // Better to show closest options than an empty state
    return scored.slice(0, 3).map((i) => ({
        ...i,
        matchStrength: "Possible Match",
        reasons: ["May be relevant — explore to find out more"],
    }));
}

export default matchInventory;