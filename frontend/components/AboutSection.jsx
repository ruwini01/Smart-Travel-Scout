export default function AboutSection() {
    return (
        <div style={{ background: "#fff", padding: "72px 24px", borderTop: "1px solid #eaeaea" }}>
            <div style={{ maxWidth: 960, margin: "0 auto" }}>

                {/* Top label */}
                <div style={{
                    fontSize: 12, fontWeight: 700, color: "#E8192C",
                    textTransform: "uppercase", letterSpacing: ".14em", marginBottom: 16,
                }}>
                    About Smart Scout
                </div>

                {/* Headline */}
                <h2 style={{
                    fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900,
                    color: "#1a1a1a", lineHeight: 1.15, maxWidth: 520, marginBottom: 40,
                }}>
                    We built something we'd actually want to use.
                </h2>

                {/* Two column layout */}
                <div style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr",
                    gap: 64, alignItems: "start",
                }}>

                    {/* Left — story text */}
                    <div>
                        <p style={{ fontSize: 17, color: "#444", lineHeight: 1.8, marginBottom: 20 }}>
                            Most travel search tools give you a list and leave you guessing.
                            Smart Scout is different — you describe your trip in plain language
                            and the AI figures out what you actually mean.
                        </p>
                        <p style={{ fontSize: 17, color: "#444", lineHeight: 1.8, marginBottom: 32 }}>
                            Every result is pulled from our verified Sri Lanka inventory.
                            The AI cannot invent destinations. Zod schema validation
                            rejects any response that references an ID outside our dataset —
                            so what you see is always real.
                        </p>

                        {/* Feature list — clean, no boxes */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                            {[
                                {
                                    title: "Natural language search",
                                    body: "Type exactly how you'd describe it to a friend. The AI maps your words to tags, price, and location.",
                                },
                                {
                                    title: "Zero hallucinations",
                                    body: "Zod validates every AI response. If an ID isn't in our inventory, it never reaches you.",
                                },
                                {
                                    title: "Fast and cheap to run",
                                    body: "Temperature 0.1, max 500 tokens, server-side API key. Designed to be production-ready from day one.",
                                },
                            ].map((f, i) => (
                                <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                                    {/* Red dot accent */}
                                    <div style={{
                                        width: 8, height: 8, borderRadius: "50%",
                                        background: "#E8192C", flexShrink: 0, marginTop: 8,
                                    }} />
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a", marginBottom: 4 }}>
                                            {f.title}
                                        </div>
                                        <div style={{ fontSize: 15, color: "#666", lineHeight: 1.6 }}>
                                            {f.body}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — stats, more editorial style */}
                    <div>
                        {/* Large pull quote */}
                        <div style={{
                            borderLeft: "3px solid #E8192C",
                            paddingLeft: 24, marginBottom: 40,
                        }}>
                            <p style={{
                                fontSize: 20, fontWeight: 700, color: "#1a1a1a",
                                lineHeight: 1.5, fontStyle: "italic",
                            }}>
                                "The AI only sees what it needs to see — and can only return what we know is real."
                            </p>
                        </div>

                        {/* Stats — two rows, editorial not boxed */}
                        <div style={{
                            display: "grid", gridTemplateColumns: "1fr 1fr",
                            gap: "28px 32px",
                        }}>
                            {[
                                { num: "5", label: "Curated experiences", sub: "Hand-picked for Sri Lanka" },
                                { num: "100%", label: "Inventory-grounded", sub: "No outside suggestions" },
                                { num: "0", label: "Hallucinated results", sub: "Zod-validated always" },
                                { num: "< 2s", label: "Match time", sub: "OpenAI gpt-4o-mini" },
                            ].map((s, i) => (
                                <div key={i} style={{ borderTop: "2px solid #eaeaea", paddingTop: 16 }}>
                                    <div style={{
                                        fontSize: 36, fontWeight: 900,
                                        color: "#E8192C", lineHeight: 1, marginBottom: 6,
                                    }}>
                                        {s.num}
                                    </div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 2 }}>
                                        {s.label}
                                    </div>
                                    <div style={{ fontSize: 12, color: "#999" }}>
                                        {s.sub}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}