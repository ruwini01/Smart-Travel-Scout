export default function Footer({ onContact, scrollTo }) {
    const explore = [
        { label: "All Experiences", fn: () => scrollTo("results") },
        { label: "By Budget", fn: () => scrollTo("results") },
        { label: "By Activity", fn: () => scrollTo("results") },
        { label: "Sri Lanka Guide", fn: () => { } },
    ];

    const company = [
        { label: "About Scout", fn: () => scrollTo("about") },
        { label: "How It Works", fn: () => scrollTo("howItWorks") },
        { label: "Responsible AI", fn: () => { } },
        { label: "Contact Us", fn: onContact },
    ];

    return (
        <footer style={{ background: "#1a1a1a", color: "#fff", padding: "48px 24px 24px" }}>
            <div style={{
                display: "flex", justifyContent: "space-between",
                flexWrap: "wrap", gap: 32, marginBottom: 36,
                maxWidth: 1000, margin: "0 auto 36px",
            }}>
                {/* Brand */}
                <div style={{ maxWidth: 260 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <div style={{
                            width: 34, height: 34, borderRadius: "50%", background: "#E8192C",
                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        }}>
                            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                                <circle cx="12" cy="12" r="10" />
                                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                            </svg>
                        </div>
                        <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1 }}>
                            <span style={{ color: "#E8192C" }}>Scout</span><span style={{ color: "#fff" }}>Travel</span>
                        </div>
                    </div>
                    <p style={{ color: "#999", fontSize: 13, lineHeight: 1.65, marginBottom: 8 }}>
                        Authentic adventures, guided by real people, powered by smart AI.
                    </p>
                    <p style={{ color: "#666", fontSize: 12, lineHeight: 1.55 }}>
                        Every experience is verified — no fake destinations, just real travel moments.
                    </p>
                </div>

                {/* Link columns */}
                <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
                    {[{ heading: "Explore", links: explore }, { heading: "Company", links: company }].map(col => (
                        <div key={col.heading}>
                            <div style={{
                                fontSize: 12, fontWeight: 700, color: "#fff",
                                textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 14,
                            }}>
                                {col.heading}
                            </div>
                            {col.links.map(link => (
                                <div
                                    key={link.label}
                                    onClick={link.fn}
                                    style={{ fontSize: 14, color: "#999", marginBottom: 10, cursor: "pointer", transition: "color .15s" }}
                                    onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                                    onMouseLeave={e => e.currentTarget.style.color = "#999"}
                                >
                                    {link.label}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom bar */}
            <div style={{
                borderTop: "1px solid #333", paddingTop: 20,
                maxWidth: 1000, margin: "0 auto",
                display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
            }}>
                <span style={{ color: "#666", fontSize: 12 }}>© 2026 Scout Travel</span>
                <span style={{ color: "#666", fontSize: 12 }}>All Rights Reserved — Ruwini Tharanga</span>
            </div>
        </footer>
    );
}