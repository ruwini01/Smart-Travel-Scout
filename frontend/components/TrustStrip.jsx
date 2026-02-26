export default function TrustStrip() {
    const cols = [
        { t: "5 curated experiences", b: "Hand-picked Sri Lanka adventures for every type of traveller." },
        { t: "Shared adventures", b: "Travel with like-minded people in small groups of max 16." },
        { t: "100% inventory-grounded", b: "AI only suggests real, verified experiences — zero hallucinations." },
    ];

    return (
        <div style={{ background: "#fff", borderTop: "1px solid #eaeaea", borderBottom: "1px solid #eaeaea", padding: "44px 24px" }}>
            <h2 style={{ textAlign: "center", fontSize: 26, fontWeight: 700, color: "#1a1a1a", marginBottom: 32 }}>
                Real and remarkable small group trips worldwide
            </h2>
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                maxWidth: 860, margin: "0 auto",
                borderTop: "1px solid #eaeaea",
            }}>
                {cols.map((c, i) => (
                    <div key={i} style={{
                        textAlign: "center", padding: "28px 24px",
                        borderRight: i < cols.length - 1 ? "1px solid #eaeaea" : "none",
                    }}>
                        <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a", marginBottom: 6 }}>{c.t}</div>
                        <div style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>{c.b}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}