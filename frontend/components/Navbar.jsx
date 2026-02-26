"use client";
import { useState } from "react";

export default function Navbar({ wishlistCount, onWishlist, onContact, scrollTo }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const links = [
        { label: "Experiences", ref: "results" },
        { label: "How It Works", ref: "howItWorks" },
        { label: "About", ref: "about" },
    ];

    return (
        <nav style={{
            background: "#fff",
            borderBottom: "1px solid #eaeaea",
            position: "sticky", top: 0, zIndex: 50,
            padding: "0 24px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            height: 64, gap: 16,
        }}>
            {/* Logo */}
            <div
                style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0 }}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
                <div style={{
                    width: 38, height: 38, borderRadius: "50%", background: "#E8192C",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10" />
                        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                    </svg>
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, lineHeight: 1 }}>
                    <span style={{ color: "#E8192C" }}>Scout</span><span style={{ color: "#1a1a1a" }}>Travel</span>
                </div>
            </div>

            {/* Center nav links — hidden on tablet/mobile */}
            <div className="hide-tablet" style={{ display: "flex", gap: 28, alignItems: "center" }}>
                {links.map(l => (
                    <span key={l.label} className="nav-link" onClick={() => scrollTo(l.ref)}>
                        {l.label}
                    </span>
                ))}
            </div>

            {/* Right icons */}
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                {/* Wishlist heart with badge */}
                <button
                    onClick={onWishlist}
                    style={{ position: "relative", display: "flex", color: "#1a1a1a", transition: "color .15s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#E8192C"}
                    onMouseLeave={e => e.currentTarget.style.color = "#1a1a1a"}
                >
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    {wishlistCount > 0 && (
                        <span style={{
                            position: "absolute", top: -6, right: -6,
                            background: "#E8192C", color: "#fff", borderRadius: "50%",
                            width: 18, height: 18, fontSize: 11, fontWeight: 900,
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            {wishlistCount}
                        </span>
                    )}
                </button>

                {/* Phone / Contact */}
                <button
                    onClick={onContact}
                    style={{ display: "flex", color: "#1a1a1a", transition: "color .15s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#E8192C"}
                    onMouseLeave={e => e.currentTarget.style.color = "#1a1a1a"}
                >
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6 6l.81-.81a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                </button>

                {/* Hamburger */}
                <button
                    style={{ display: "flex", color: "#1a1a1a" }}
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
            </div>

            {/* Mobile dropdown */}
            {mobileOpen && (
                <div style={{
                    position: "absolute", top: 64, left: 0, right: 0,
                    background: "#fff", borderBottom: "1px solid #eaeaea",
                    padding: "16px 24px", zIndex: 60,
                }}>
                    {links.map(l => (
                        <div
                            key={l.label}
                            onClick={() => { scrollTo(l.ref); setMobileOpen(false); }}
                            style={{
                                fontSize: 16, fontWeight: 600, color: "#1a1a1a",
                                padding: "10px 0", borderBottom: "1px solid #f0f0f0", cursor: "pointer",
                            }}
                        >
                            {l.label}
                        </div>
                    ))}
                </div>
            )}
        </nav>
    );
}