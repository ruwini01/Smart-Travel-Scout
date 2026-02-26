"use client";
import { useState } from "react";

export default function ContactModal({ onClose }) {
    const [sent, setSent] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", msg: "" });

    const handleSend = () => {
        if (form.name && form.email && form.msg) setSent(true);
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div
                className="scale-in"
                onClick={e => e.stopPropagation()}
                style={{
                    background: "#fff", borderRadius: 16,
                    width: "100%", maxWidth: 480,
                    overflow: "hidden",
                    boxShadow: "0 24px 64px rgba(0,0,0,.22)",
                }}
            >
                {/* Header */}
                <div style={{ background: "#E8192C", padding: "24px 28px", position: "relative" }}>
                    <button
                        onClick={onClose}
                        style={{ position: "absolute", top: 16, right: 16, color: "#fff", opacity: .8 }}
                    >
                        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                    <div style={{ color: "#fff", fontWeight: 900, fontSize: 22 }}>Contact Us</div>
                    <div style={{ color: "rgba(255,255,255,.8)", fontSize: 14, marginTop: 4 }}>
                        Our team replies within 24 hours
                    </div>
                </div>

                {/* Body */}
                <div style={{ padding: "28px" }}>
                    {sent ? (
                        <div style={{ textAlign: "center", padding: "24px 0" }}>
                            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                            <div style={{ fontWeight: 700, fontSize: 20, color: "#1a1a1a", marginBottom: 8 }}>
                                Message Sent!
                            </div>
                            <div style={{ color: "#555", fontSize: 15 }}>
                                We'll get back to you within 24 hours.
                            </div>
                            <button
                                className="btn-red"
                                onClick={onClose}
                                style={{ marginTop: 20, padding: "10px 28px", fontSize: 15 }}
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            {/* Name */}
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 700, color: "#555", display: "block", marginBottom: 5 }}>
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="John Smith"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    style={{
                                        width: "100%", border: "1.5px solid #e0e0e0",
                                        borderRadius: 8, padding: "10px 14px",
                                        fontSize: 15, color: "#1a1a1a", transition: "border-color .15s",
                                    }}
                                    onFocus={e => e.target.style.borderColor = "#E8192C"}
                                    onBlur={e => e.target.style.borderColor = "#e0e0e0"}
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 700, color: "#555", display: "block", marginBottom: 5 }}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="john@email.com"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    style={{
                                        width: "100%", border: "1.5px solid #e0e0e0",
                                        borderRadius: 8, padding: "10px 14px",
                                        fontSize: 15, color: "#1a1a1a", transition: "border-color .15s",
                                    }}
                                    onFocus={e => e.target.style.borderColor = "#E8192C"}
                                    onBlur={e => e.target.style.borderColor = "#e0e0e0"}
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 700, color: "#555", display: "block", marginBottom: 5 }}>
                                    Message
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Tell us about your dream Sri Lanka trip…"
                                    value={form.msg}
                                    onChange={e => setForm({ ...form, msg: e.target.value })}
                                    style={{
                                        width: "100%", border: "1.5px solid #e0e0e0",
                                        borderRadius: 8, padding: "10px 14px",
                                        fontSize: 15, color: "#1a1a1a", resize: "vertical",
                                        fontFamily: "'Source Sans 3', sans-serif",
                                        transition: "border-color .15s",
                                    }}
                                    onFocus={e => e.target.style.borderColor = "#E8192C"}
                                    onBlur={e => e.target.style.borderColor = "#e0e0e0"}
                                />
                            </div>

                            {/* Buttons */}
                            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                                <button
                                    className="btn-outline"
                                    onClick={onClose}
                                    style={{ flex: 1, padding: "11px 0", fontSize: 15 }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn-red"
                                    onClick={handleSend}
                                    style={{ flex: 2, padding: "11px 0", fontSize: 15 }}
                                >
                                    Send Message
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}