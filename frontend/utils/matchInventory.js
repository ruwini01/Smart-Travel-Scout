// Client-side fallback scorer
// Used only if the API call fails — keeps the app functional offline
function matchInventory(query, inventory) {
    const q = query.toLowerCase();

    const intentMap = {
        beach: ["beach", "surf", "ocean", "sea", "coast", "wave", "chill", "coastal", "bay"],
        adventure: ["adventure", "wild", "safari", "trek", "expedition", "thrill", "adrenaline"],
        history: ["history", "heritage", "ancient", "culture", "fort", "ruin", "colonial", "old", "medieval"],
        nature: ["nature", "green", "mountain", "tea", "trail", "hike", "forest", "misty", "highland"],
        photography: ["photo", "camera", "photography", "landscape", "view", "scenery", "picture"],
        relaxing: ["chill", "relax", "slow", "peaceful", "retreat", "unwind", "calm"],
        wildlife: ["animal", "wildlife", "leopard", "elephant", "safari", "bird"],
        climbing: ["climb", "hike", "summit", "rock", "fortress", "ascent", "trek"],
    };

    const priceMatch = q.match(/under\s*\$?(\d+)/);
    const maxPrice = priceMatch ? parseInt(priceMatch[1]) : null;

    return inventory
        .map((item) => {
            let score = 0;
            const reasons = [];
            const itemText =
                `${item.title} ${item.location} ${item.tags.join(" ")} ${item.description}`.toLowerCase();

            // Intent matching
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

            // Direct tag matching
            item.tags.forEach((tag) => {
                if (q.includes(tag.replace("-", " ")) || q.includes(tag)) {
                    score += 25;
                    if (!reasons.some((r) => r.includes(tag))) {
                        reasons.push(`Tagged as "${tag}"`);
                    }
                }
            });

            // Location mention
            if (q.includes(item.location.toLowerCase())) {
                score += 40;
                reasons.push(`You mentioned ${item.location}`);
            }

            // Price filter
            if (maxPrice !== null) {
                if (item.price <= maxPrice) {
                    score += 20;
                    reasons.push(`Fits your $${maxPrice} budget — only $${item.price}pp`);
                } else {
                    score -= 60;
                }
            }

            // Partial word matches
            q.split(" ")
                .filter((w) => w.length > 3)
                .forEach((w) => { if (itemText.includes(w)) score += 5; });

            return {
                ...item,
                score,
                reasons:
                    [...new Set(reasons)].slice(0, 3).length > 0
                        ? [...new Set(reasons)].slice(0, 3)
                        : ["Relevant to your search"],
                matchStrength:
                    score >= 55 ? "Top Pick" : score >= 25 ? "Great Match" : "Possible Match",
            };
        })
        .filter((i) => i.score > 0)
        .sort((a, b) => b.score - a.score);
}

export default matchInventory;