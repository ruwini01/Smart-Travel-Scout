"use client";
import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";

const SLIDES = [
    {
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=85&auto=format&fit=crop",
        caption: "Only the Best Sri Lanka Adventures",
        sub: "Describe what you're craving. We match you to real, verified experiences.",
    },
    {
        url: "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=1600&q=85&auto=format&fit=crop",
        caption: "Ancient Wonders Await",
        sub: "From fortress rock climbs to coastal heritage walks — curated for curious travellers.",
    },
    {
        url: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1600&q=85&auto=format&fit=crop",
        caption: "Ride the World's Best Waves",
        sub: "Surf, safari, summit — tell us your vibe and we'll find your perfect match.",
    },
];

export default function HeroSection({ query, setQuery, onSearch, isLoading, resultsRef }) {
    const [slide, setSlide] = useState(0);

    // Auto-advance carousel
    useEffect(() => {
        const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 5000);
        return () => clearInterval(t);
    }, []);

    const prev = () => setSlide(s => (s - 1 + SLIDES.length) % SLIDES.length);
    const next = () => setSlide(s => (s + 1) % SLIDES.length);
    const cur = SLIDES[slide];

    return (
        <div style={{ position: "relative", overflow: "hidden" }}>
            {/* Hero image */}
            <img
                key={slide}
                src={cur.url}
                alt="Sri Lanka"
                className="hero-img-enter"
                style={{ width: "100%", height: 540, objectFit: "cover", objectPosition: "center 40%" }}
            />

            {/* Dark overlay */}
            <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to bottom, rgba(0,0,0,.25) 0%, rgba(0,0,0,.58) 60%, rgba(0,0,0,.72) 100%)",
            }} />

            {/* Centered content */}
            <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                padding: "0 16px",
            }}>
                {/* Badge */}
                <div style={{
                    background: "rgba(255,255,255,.18)", backdropFilter: "blur(6px)",
                    borderRadius: 50, padding: "4px 18px", marginBottom: 16,
                    color: "#fff", fontSize: 12, fontWeight: 700,
                    letterSpacing: ".12em", textTransform: "uppercase",
                }}>
                    AI-Powered Discovery · Sri Lanka
                </div>

                {/* Headline */}
                <h1 className="hero-title" style={{
                    color: "#fff", fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 900,
                    textAlign: "center", maxWidth: 660, lineHeight: 1.15, marginBottom: 12,
                }}>
                    {cur.caption}
                </h1>

                {/* Subtext */}
                <p style={{
                    color: "rgba(255,255,255,.85)", fontSize: 17, textAlign: "center",
                    marginBottom: 30, maxWidth: 500,
                }}>
                    {cur.sub}
                </p>

                {/* Search bar */}
                <SearchBar
                    query={query} setQuery={setQuery}
                    onSearch={onSearch} isLoading={isLoading}
                    variant="hero"
                />
            </div>

            {/* Carousel arrows */}
            {[
                { fn: prev, icon: "M15 18l-6-6 6-6", side: "left" },
                { fn: next, icon: "M9 18l6-6-6-6", side: "right" },
            ].map(a => (
                <button
                    key={a.side}
                    onClick={a.fn}
                    style={{
                        position: "absolute", [a.side]: 16, top: "50%", transform: "translateY(-50%)",
                        width: 42, height: 42, borderRadius: "50%",
                        background: "rgba(255,255,255,.9)", border: "none",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 2px 12px rgba(0,0,0,.2)", zIndex: 10,
                        cursor: "pointer", transition: "background .15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fff"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.9)"}
                >
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points={a.side === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
                    </svg>
                </button>
            ))}

            {/* Slide dots */}
            <div style={{
                position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
                display: "flex", gap: 8, zIndex: 10,
            }}>
                {SLIDES.map((_, i) => (
                    <button
                        key={i}
                        className={`hero-dot ${i === slide ? "active" : ""}`}
                        onClick={() => setSlide(i)}
                    />
                ))}
            </div>

            {/* Discover button */}
            <div style={{ position: "absolute", bottom: 18, right: 24, zIndex: 10 }}>
                <button
                    className="btn-red"
                    onClick={() => resultsRef.current?.scrollIntoView({ behavior: "smooth" })}
                    style={{ padding: "9px 22px", fontSize: 14 }}
                >
                    Discover experiences ↓
                </button>
            </div>
        </div>
    );
}