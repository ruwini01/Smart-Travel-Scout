"use client";

const PRICES = ["Under $50", "Under $100", "Under $200"];
const TAGS = [
    "beach", "surfing", "history", "hiking", "nature",
    "animals", "culture", "view", "climbing", "photography",
    "walking", "adventure", "cold", "young-vibe",
];

export default function FilterBar({ activePrice, setActivePrice, activeTags, setActiveTags, onReset }) {
    return (
        <div style={{
            padding: "12px 24px 14px",
            display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8,
            borderBottom: "1px solid #eaeaea", background: "#fafafa",
        }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#555", flexShrink: 0 }}>Filter:</span>

            {/* Price chips */}
            {PRICES.map(p => {
                const val = p.split("$")[1];
                const active = activePrice === val;
                return (
                    <button
                        key={p}
                        className={`chip ${active ? "active" : ""}`}
                        onClick={() => setActivePrice(active ? null : val)}
                        style={{
                            border: `1.5px solid ${active ? "#E8192C" : "#e0e0e0"}`,
                            padding: "4px 14px", fontSize: 13, fontWeight: 600,
                            color: active ? "#fff" : "#555",
                            background: active ? "#E8192C" : "#fff",
                        }}
                    >
                        {p}
                    </button>
                );
            })}

            {/* Divider */}
            <div style={{ width: 1, height: 20, background: "#e0e0e0", margin: "0 2px" }} />

            {/* Tag chips */}
            {TAGS.map(tag => {
                const active = activeTags.includes(tag);
                return (
                    <button
                        key={tag}
                        className={`chip ${active ? "active" : ""}`}
                        onClick={() => setActiveTags(
                            active
                                ? activeTags.filter(t => t !== tag)
                                : [...activeTags, tag]
                        )}
                        style={{
                            border: `1.5px solid ${active ? "#E8192C" : "#e0e0e0"}`,
                            padding: "4px 12px", fontSize: 12, fontWeight: 600,
                            color: active ? "#fff" : "#555",
                            background: active ? "#E8192C" : "#fff",
                            textTransform: "capitalize",
                        }}
                    >
                        {tag}
                    </button>
                );
            })}

            {/* Clear filters */}
            {(activePrice || activeTags.length > 0) && (
                <button
                    onClick={onReset}
                    style={{
                        color: "#E8192C", fontSize: 13, fontWeight: 700,
                        display: "flex", alignItems: "center", gap: 4,
                        marginLeft: 4, background: "none", border: "none", cursor: "pointer",
                    }}
                >
                    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#E8192C" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    Clear filters
                </button>
            )}
        </div>
    );
}