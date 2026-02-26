"use client";
import { useState } from "react";

export default function ExperienceCard({ item, onView, wishlist, onWishlist }) {
    const liked = wishlist.includes(item.id);
    const badgeColor =
        item.matchStrength === "Top Pick" ? "#E8192C" :
            item.matchStrength === "Great Match" ? "#16a34a" : "#6b7280";

    return (
        <div className="exp-card slide-up">
            {/* Image */}
            <div style={{ position: "relative", flexShrink: 0 }}>
                <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: "100%", height: 210, objectFit: "cover" }}
                    onError={e => { e.target.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"; }}
                />

                {/* Match strength badge */}
                <span style={{
                    position: "absolute", top: 12, right: 12,
                    background: badgeColor, color: "#fff",
                    borderRadius: 50, padding: "3px 11px",
                    fontSize: 11, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase",
                }}>
                    {item.matchStrength}
                </span>

                {/* Wishlist heart */}
                <button
                    onClick={() => onWishlist(item.id)}
                    style={{
                        position: "absolute", top: 10, left: 10,
                        background: "rgba(255,255,255,.93)", border: "none",
                        borderRadius: "50%", width: 34, height: 34,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "transform .15s", cursor: "pointer",
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                    <svg width={16} height={16} viewBox="0 0 24 24"
                        fill={liked ? "#E8192C" : "none"}
                        stroke={liked ? "#E8192C" : "#555"}
                        strokeWidth="2" strokeLinecap="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </button>

                {/* Stars */}
                <div style={{ position: "absolute", bottom: 10, left: 12, display: "flex", gap: 1 }}>
                    {[...Array(5)].map((_, i) => (
                        <svg key={i} width={12} height={12} viewBox="0 0 24 24" fill="#E8192C" stroke="#E8192C" strokeWidth="1">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                    ))}
                </div>
            </div>

            {/* Card body */}
            <div style={{ padding: "16px 18px 0", flex: 1 }}>
                {/* Location */}
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#E8192C" strokeWidth="2" strokeLinecap="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#E8192C", textTransform: "uppercase", letterSpacing: ".08em" }}>
                        {item.location}, {item.country}
                    </span>
                </div>

                {/* Title */}
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.28, marginBottom: 6 }}>
                    {item.title}
                </h3>

                {/* Description */}
                <p style={{
                    fontSize: 14, color: "#555", lineHeight: 1.55, marginBottom: 12,
                    display: "-webkit-box", WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                    {item.description}
                </p>

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                    {item.tags.map(t => (
                        <span key={t} style={{
                            background: "#f4f4f4", color: "#333", fontSize: 11,
                            fontWeight: 600, padding: "3px 10px", borderRadius: 50,
                            textTransform: "capitalize", letterSpacing: ".04em",
                        }}>
                            {t}
                        </span>
                    ))}
                </div>

                {/* Price + meta */}
                <div style={{
                    borderTop: "1px solid #eaeaea", paddingTop: 14,
                    display: "flex", justifyContent: "space-between", alignItems: "flex-end",
                }}>
                    <div>
                        <div style={{ fontSize: 11, color: "#888" }}>From</div>
                        <div style={{ fontSize: 27, fontWeight: 900, color: "#1a1a1a", lineHeight: 1 }}>${item.price}</div>
                        <div style={{ fontSize: 11, color: "#888" }}>per person</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#555", justifyContent: "flex-end", marginBottom: 3 }}>
                            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span style={{ fontSize: 13 }}>{item.duration}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#555", justifyContent: "flex-end" }}>
                            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            <span style={{ fontSize: 13 }}>{item.groupSize}</span>
                        </div>
                    </div>
                </div>

                {/* CTA button */}
                <button
                    className="btn-red"
                    onClick={() => onView(item)}
                    style={{ width: "100%", padding: "12px 0", fontSize: 15, marginTop: 14 }}
                >
                    View Experience →
                </button>
            </div>

            {/* Why it matches */}
            <div style={{ margin: "14px 18px 18px", background: "#fff8f8", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{
                    fontSize: 11, fontWeight: 700, color: "#E8192C",
                    textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 6,
                }}>
                    Why this matches you:
                </div>
                {item.reasons.map((r, i) => (
                    <div key={i} style={{
                        display: "flex", alignItems: "flex-start", gap: 6,
                        marginBottom: i < item.reasons.length - 1 ? 4 : 0,
                    }}>
                        <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" style={{ marginTop: 1, flexShrink: 0 }}>
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span style={{ fontSize: 12, color: "#333", lineHeight: 1.45 }}>{r}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}