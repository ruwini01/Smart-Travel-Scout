export default function HowItWorks({ scrollToHero }) {
    const steps = [
        {
            num: "1",
            icon: (
                <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#E8192C" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
            ),
            title: "Describe Your Trip",
            body: 'Type naturally — "beach weekend under $100" or "hiking in the mountains".',
        },
        {
            num: "2",
            icon: (
                <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#E8192C" strokeWidth="2" strokeLinecap="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
            ),
            title: "AI Matches Intent",
            body: "OpenAI maps your words to tags, locations, and price across the verified inventory.",
        },
        {
            num: "3",
            icon: (
                <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#E8192C" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
            ),
            title: "Only Real Results",
            body: "Every suggestion is from our verified inventory. Zod validates every ID. Zero hallucinations.",
        },
    ];

    return (
        <div style={{ background: "#f7f7f7", padding: "64px 24px", borderTop: "1px solid #eaeaea" }}>
            <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>
                How Smart Scout Works
            </h2>
            <p style={{ textAlign: "center", color: "#666", fontSize: 15, marginBottom: 40 }}>
                Powered by OpenAI. Grounded in reality.
            </p>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 20, maxWidth: 860, margin: "0 auto 36px",
            }}>
                {steps.map(s => (
                    <div key={s.num} style={{
                        background: "#fff", borderRadius: 12, padding: "28px 22px",
                        textAlign: "center", boxShadow: "0 1px 8px rgba(0,0,0,.06)",
                    }}>
                        {/* Icon circle */}
                        <div style={{
                            width: 54, height: 54, borderRadius: "50%", background: "#fff0f1",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            margin: "0 auto 10px",
                        }}>
                            {s.icon}
                        </div>
                        {/* Step number */}
                        <div style={{
                            width: 26, height: 26, borderRadius: "50%",
                            background: "#E8192C", color: "#fff",
                            fontSize: 13, fontWeight: 900,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            margin: "0 auto 10px",
                        }}>
                            {s.num}
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>{s.title}</h3>
                        <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>{s.body}</p>
                    </div>
                ))}
            </div>

            <div style={{ textAlign: "center" }}>
                <button
                    className="btn-red"
                    onClick={scrollToHero}
                    style={{ padding: "12px 32px", fontSize: 16 }}
                >
                    Start Exploring →
                </button>
            </div>
        </div>
    );
}