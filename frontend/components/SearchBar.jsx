"use client";
import { useState } from "react";

const CHIPS = [
    "Beach & surf under $100",
    "Wildlife safari",
    "History & culture",
    "Mountain hiking",
    "Photography tour",
    "Budget under $50",
];

export default function SearchBar({ query, setQuery, onSearch, isLoading, variant = "hero" }) {
    const [err, setErr] = useState("");

    const submit = () => {
        if (!query.trim()) { setErr("Please describe what you're looking for"); return; }
        setErr("");
        onSearch(query);
    };

    return (
        <div style={{ maxWidth: 780, margin: "0 auto", width: "100%", padding: "0 16px" }}>
            {/* Search pill */}
            <div
                className="search-row"
                style={{
                    background: "#fff", borderRadius: 50,
                    boxShadow: "0 4px 28px rgba(0,0,0,.2)",
                    display: "flex", alignItems: "center",
                    padding: "6px 6px 6px 18px",
                    border: err ? "2px solid #E8192C" : "2px solid transparent",
                }}
            >
                {/* Map pin icon */}
                <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="#E8192C" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>

                {/* Input */}
                <input
                    value={query}
                    onChange={e => { setQuery(e.target.value); setErr(""); }}
                    onKeyDown={e => e.key === "Enter" && submit()}
                    placeholder='Search wildlife, beach, history… or "surf under $100"'
                    style={{
                        flex: 1, background: "transparent", border: "none", outline: "none",
                        fontSize: 15, color: "#1a1a1a", padding: "10px 12px",
                    }}
                />

                {/* Divider */}
                <div className="search-divider" style={{ width: 1, height: 30, background: "#e0e0e0", margin: "0 10px" }} />

                {/* Budget label */}
                <div className="search-divider" style={{ display: "flex", alignItems: "center", gap: 5, padding: "0 8px" }}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round">
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    <span style={{ fontSize: 14, color: "#888" }}>Any budget</span>
                </div>

                {/* Divider */}
                <div className="search-divider" style={{ width: 1, height: 30, background: "#e0e0e0", margin: "0 10px" }} />

                {/* Search button */}
                <button
                    onClick={submit}
                    className="btn-red search-btn"
                    style={{ padding: "10px 22px", fontSize: 15, display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}
                >
                    {isLoading ? (
                        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="spin">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                    ) : (
                        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                    )}
                    {isLoading ? "Searching…" : "Search"}
                </button>
            </div>

            {/* Inline error */}
            {err && (
                <p style={{ color: "#E8192C", fontSize: 13, marginTop: 6, paddingLeft: 12 }}>{err}</p>
            )}

            {/* Suggestion chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14, justifyContent: "center" }}>
                {CHIPS.map(chip => (
                    <button
                        key={chip}
                        className="chip"
                        onClick={() => { setQuery(chip); onSearch(chip); }}
                        style={{
                            border: `1.5px solid ${variant === "hero" ? "rgba(255,255,255,.6)" : "#e0e0e0"}`,
                            padding: "5px 14px", fontSize: 13, fontWeight: 600,
                            color: variant === "hero" ? "#fff" : "#555",
                            background: variant === "hero" ? "rgba(255,255,255,.15)" : "#fff",
                            backdropFilter: variant === "hero" ? "blur(4px)" : "none",
                        }}
                    >
                        {chip}
                    </button>
                ))}
            </div>
        </div>
    );
}