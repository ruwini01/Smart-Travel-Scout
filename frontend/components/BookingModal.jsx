"use client";
import { useState } from "react";

export default function BookingModal({ item, onClose, onBooked }) {
    const [step, setStep] = useState(1);
    const [people, setPeople] = useState(2);
    const [date, setDate] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [galIdx, setGalIdx] = useState(0);

    const total = item.price * people;
    const maxPeople = parseInt(item.groupSize.split(" ")[1]) || 16;
    const canBook = name && email && date;

    return (
        <div
            className="modal-backdrop"
            style={{ alignItems: "flex-start" }}
            onClick={onClose}
        >
            <div
                className="scale-in"
                onClick={e => e.stopPropagation()}
                style={{
                    background: "#fff", borderRadius: 16,
                    width: "100%", maxWidth: 820,
                    maxHeight: "92vh", overflowY: "auto",
                    boxShadow: "0 24px 64px rgba(0,0,0,.25)",
                    margin: "auto",
                }}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    style={{
                        position: "sticky", top: 12,
                        left: "calc(100% - 48px)",
                        zIndex: 10, background: "#1a1a1a",
                        borderRadius: "50%", width: 36, height: 36,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        marginLeft: "auto", marginRight: 12, marginTop: 12, flexShrink: 0,
                    }}
                >
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                <div style={{ padding: "0 28px 28px", marginTop: -8 }}>

                    {/* ── STEP 1: Experience detail ── */}
                    {step === 1 && (
                        <div className="fade-in">
                            {/* Gallery */}
                            <div style={{ position: "relative", marginBottom: 20, borderRadius: 12, overflow: "hidden" }}>
                                <img
                                    key={galIdx}
                                    src={item.gallery?.[galIdx] || item.image}
                                    alt={item.title}
                                    className="hero-img-enter"
                                    style={{ width: "100%", height: 300, objectFit: "cover" }}
                                />
                                {item.gallery?.length > 1 && (
                                    <>
                                        {/* Prev */}
                                        <button
                                            onClick={() => setGalIdx(g => (g - 1 + item.gallery.length) % item.gallery.length)}
                                            style={{
                                                position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                                                background: "rgba(255,255,255,.9)", borderRadius: "50%",
                                                width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
                                                border: "none", cursor: "pointer",
                                            }}
                                        >
                                            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round">
                                                <polyline points="15 18 9 12 15 6" />
                                            </svg>
                                        </button>
                                        {/* Next */}
                                        <button
                                            onClick={() => setGalIdx(g => (g + 1) % item.gallery.length)}
                                            style={{
                                                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                                                background: "rgba(255,255,255,.9)", borderRadius: "50%",
                                                width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
                                                border: "none", cursor: "pointer",
                                            }}
                                        >
                                            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round">
                                                <polyline points="9 18 15 12 9 6" />
                                            </svg>
                                        </button>
                                        {/* Dots */}
                                        <div style={{
                                            position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)",
                                            display: "flex", gap: 6,
                                        }}>
                                            {item.gallery.map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setGalIdx(i)}
                                                    className={`hero-dot ${i === galIdx ? "active" : ""}`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Title row */}
                            <div style={{
                                display: "flex", justifyContent: "space-between",
                                alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16,
                            }}>
                                <div>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: "#E8192C", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>
                                        {item.location}, {item.country}
                                    </div>
                                    <h2 style={{ fontSize: 26, fontWeight: 900, color: "#1a1a1a", lineHeight: 1.2 }}>
                                        {item.title}
                                    </h2>
                                    {/* Stars */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} width={13} height={13} viewBox="0 0 24 24" fill="#E8192C" stroke="#E8192C" strokeWidth="1">
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                            </svg>
                                        ))}
                                        <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginLeft: 4 }}>{item.rating}</span>
                                        <span style={{ fontSize: 13, color: "#888" }}>({item.reviews} reviews)</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontSize: 11, color: "#888" }}>From</div>
                                    <div style={{ fontSize: 36, fontWeight: 900, color: "#1a1a1a", lineHeight: 1 }}>${item.price}</div>
                                    <div style={{ fontSize: 13, color: "#888" }}>per person</div>
                                </div>
                            </div>

                            {/* Meta pills */}
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                                {[
                                    { text: item.duration },
                                    { text: item.groupSize },
                                    { text: "English guide" },
                                ].map((m, i) => (
                                    <span key={i} style={{
                                        background: "#f4f4f4", borderRadius: 50,
                                        padding: "5px 12px", fontSize: 13, color: "#555", fontWeight: 600,
                                    }}>
                                        {m.text}
                                    </span>
                                ))}
                                {item.tags.map(t => (
                                    <span key={t} style={{
                                        background: "#fff0f1", color: "#E8192C",
                                        borderRadius: 50, padding: "5px 12px",
                                        fontSize: 12, fontWeight: 700, textTransform: "capitalize",
                                    }}>
                                        {t}
                                    </span>
                                ))}
                            </div>

                            <p style={{ fontSize: 15, color: "#444", lineHeight: 1.7, marginBottom: 20 }}>
                                {item.longDescription}
                            </p>

                            {/* Highlights + Includes */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                                {[
                                    { heading: "✨ Highlights", items: item.highlights },
                                    { heading: "🎒 What's Included", items: item.includes },
                                ].map(col => (
                                    <div key={col.heading} style={{ background: "#fafafa", borderRadius: 12, padding: 18 }}>
                                        <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a", marginBottom: 12 }}>
                                            {col.heading}
                                        </div>
                                        {col.items?.map((h, i) => (
                                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                                <span style={{ fontSize: 14, color: "#333" }}>{h}</span>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>

                            <button
                                className="btn-red"
                                onClick={() => setStep(2)}
                                style={{ width: "100%", padding: "14px 0", fontSize: 17 }}
                            >
                                Book This Experience →
                            </button>
                        </div>
                    )}

                    {/* ── STEP 2: Booking form ── */}
                    {step === 2 && (
                        <div className="fade-in">
                            <h2 style={{ fontSize: 24, fontWeight: 900, color: "#1a1a1a", marginBottom: 4 }}>
                                Complete Your Booking
                            </h2>
                            <div style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>
                                {item.title} · {item.location}
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                {/* People counter */}
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 700, color: "#555", display: "block", marginBottom: 8 }}>
                                        Number of Travellers
                                    </label>
                                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                        <button
                                            onClick={() => setPeople(p => Math.max(1, p - 1))}
                                            style={{
                                                width: 38, height: 38, borderRadius: "50%",
                                                border: "2px solid #e0e0e0", fontSize: 20, fontWeight: 700,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                cursor: "pointer", background: "#fff",
                                            }}
                                        >−</button>
                                        <span style={{ fontSize: 24, fontWeight: 900, color: "#1a1a1a", minWidth: 30, textAlign: "center" }}>
                                            {people}
                                        </span>
                                        <button
                                            onClick={() => setPeople(p => Math.min(maxPeople, p + 1))}
                                            style={{
                                                width: 38, height: 38, borderRadius: "50%",
                                                border: "2px solid #E8192C", fontSize: 20, fontWeight: 700,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                cursor: "pointer", color: "#E8192C", background: "#fff",
                                            }}
                                        >+</button>
                                        <span style={{ fontSize: 14, color: "#888" }}>{item.groupSize}</span>
                                    </div>
                                </div>

                                {/* Date */}
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 700, color: "#555", display: "block", marginBottom: 6 }}>
                                        Preferred Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={e => setDate(e.target.value)}
                                        min={new Date().toISOString().split("T")[0]}
                                        style={{
                                            border: "1.5px solid #e0e0e0", borderRadius: 8,
                                            padding: "10px 14px", fontSize: 15, width: "100%", color: "#1a1a1a",
                                        }}
                                        onFocus={e => e.target.style.borderColor = "#E8192C"}
                                        onBlur={e => e.target.style.borderColor = "#e0e0e0"}
                                    />
                                </div>

                                {/* Name */}
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 700, color: "#555", display: "block", marginBottom: 6 }}>
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Your full name"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        style={{
                                            border: "1.5px solid #e0e0e0", borderRadius: 8,
                                            padding: "10px 14px", fontSize: 15, width: "100%", color: "#1a1a1a",
                                        }}
                                        onFocus={e => e.target.style.borderColor = "#E8192C"}
                                        onBlur={e => e.target.style.borderColor = "#e0e0e0"}
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 700, color: "#555", display: "block", marginBottom: 6 }}>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        style={{
                                            border: "1.5px solid #e0e0e0", borderRadius: 8,
                                            padding: "10px 14px", fontSize: 15, width: "100%", color: "#1a1a1a",
                                        }}
                                        onFocus={e => e.target.style.borderColor = "#E8192C"}
                                        onBlur={e => e.target.style.borderColor = "#e0e0e0"}
                                    />
                                </div>

                                {/* Price summary */}
                                <div style={{
                                    background: "#fafafa", borderRadius: 12,
                                    padding: 18, border: "1px solid #e8e8e8",
                                }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                        <span style={{ color: "#555" }}>${item.price} × {people} traveller{people > 1 ? "s" : ""}</span>
                                        <span style={{ fontWeight: 700 }}>${total}</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 13, color: "#888" }}>
                                        <span>Booking fee</span><span>Free</span>
                                    </div>
                                    <div style={{
                                        borderTop: "1px solid #e0e0e0", paddingTop: 12,
                                        display: "flex", justifyContent: "space-between",
                                    }}>
                                        <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
                                        <span style={{ fontWeight: 900, fontSize: 22, color: "#E8192C" }}>${total}</span>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div style={{ display: "flex", gap: 10 }}>
                                    <button
                                        className="btn-outline"
                                        onClick={() => setStep(1)}
                                        style={{ flex: 1, padding: "12px 0", fontSize: 15 }}
                                    >
                                        ← Back
                                    </button>
                                    <button
                                        className="btn-red"
                                        onClick={() => { if (canBook) { setStep(3); onBooked(); } }}
                                        style={{ flex: 2, padding: "12px 0", fontSize: 15, opacity: canBook ? 1 : .5 }}
                                    >
                                        Confirm Booking
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 3: Confirmation ── */}
                    {step === 3 && (
                        <div className="fade-in" style={{ textAlign: "center", padding: "40px 16px" }}>
                            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
                            <h2 style={{ fontSize: 28, fontWeight: 900, color: "#1a1a1a", marginBottom: 10 }}>
                                You're Booked!
                            </h2>
                            <p style={{ fontSize: 16, color: "#555", maxWidth: 380, margin: "0 auto 8px" }}>
                                <strong>{item.title}</strong> is confirmed for{" "}
                                <strong>{people} traveller{people > 1 ? "s" : ""}</strong>.
                            </p>
                            <p style={{ fontSize: 14, color: "#888", marginBottom: 28 }}>
                                A confirmation has been sent to <strong>{email}</strong>.
                            </p>

                            {/* Booking reference */}
                            <div style={{
                                background: "#fff0f1", borderRadius: 12, padding: 20,
                                maxWidth: 320, margin: "0 auto 28px",
                                border: "1px solid #fecaca",
                            }}>
                                <div style={{ fontSize: 13, color: "#E8192C", fontWeight: 700, marginBottom: 4 }}>
                                    BOOKING REFERENCE
                                </div>
                                <div style={{ fontSize: 24, fontWeight: 900, color: "#1a1a1a", letterSpacing: ".1em" }}>
                                    SC-{Math.random().toString(36).substring(2, 8).toUpperCase()}
                                </div>
                            </div>

                            <button
                                className="btn-red"
                                onClick={onClose}
                                style={{ padding: "12px 36px", fontSize: 16 }}
                            >
                                Done
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}