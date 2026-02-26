"use client";

export default function WishlistDrawer({ items, wishlist, onClose, onRemove, onView }) {
    const liked = items.filter(i => wishlist.includes(i.id));

    return (
        <div
            className="modal-backdrop"
            style={{ alignItems: "flex-start", justifyContent: "flex-end" }}
            onClick={onClose}
        >
            <div
                className="fade-in"
                onClick={e => e.stopPropagation()}
                style={{
                    background: "#fff", width: "100%", maxWidth: 400,
                    minHeight: "100vh", boxShadow: "-8px 0 32px rgba(0,0,0,.15)",
                    display: "flex", flexDirection: "column",
                }}
            >
                {/* Header */}
                <div style={{
                    background: "#E8192C", padding: "20px 24px",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                    <div>
                        <div style={{ color: "#fff", fontWeight: 900, fontSize: 20 }}>My Wishlist</div>
                        <div style={{ color: "rgba(255,255,255,.8)", fontSize: 13 }}>
                            {liked.length} saved experience{liked.length !== 1 ? "s" : ""}
                        </div>
                    </div>
                    <button onClick={onClose}>
                        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Items */}
                <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
                    {liked.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "48px 16px", color: "#555" }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>❤️</div>
                            <div style={{ fontWeight: 700, fontSize: 18, color: "#1a1a1a", marginBottom: 8 }}>
                                No saved experiences yet
                            </div>
                            <div style={{ fontSize: 14 }}>
                                Tap the heart on any card to save it here.
                            </div>
                        </div>
                    ) : (
                        liked.map(item => (
                            <div key={item.id} style={{
                                display: "flex", gap: 12, padding: 12,
                                borderBottom: "1px solid #eee", alignItems: "center",
                            }}>
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 8, flexShrink: 0 }}
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a", marginBottom: 2 }}>
                                        {item.title}
                                    </div>
                                    <div style={{ fontSize: 12, color: "#E8192C", fontWeight: 600 }}>
                                        {item.location}
                                    </div>
                                    <div style={{ fontSize: 16, fontWeight: 900, color: "#1a1a1a", marginTop: 4 }}>
                                        ${item.price}
                                        <span style={{ fontSize: 11, fontWeight: 400, color: "#888" }}> /pp</span>
                                    </div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    <button
                                        className="btn-red"
                                        onClick={() => { onView(item); onClose(); }}
                                        style={{ padding: "5px 12px", fontSize: 12 }}
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => onRemove(item.id)}
                                        style={{ fontSize: 11, color: "#888", cursor: "pointer", textAlign: "center", background: "none", border: "none" }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer CTA */}
                {liked.length > 0 && (
                    <div style={{ padding: 16, borderTop: "1px solid #eee" }}>
                        <button
                            className="btn-red"
                            style={{ width: "100%", padding: "12px 0", fontSize: 15 }}
                        >
                            Enquire About All →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}