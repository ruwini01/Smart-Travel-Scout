export default function SkeletonCard() {
    return (
        <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #eaeaea" }}>
            <div className="skel" style={{ height: 200 }} />
            <div style={{ padding: 18 }}>
                <div className="skel" style={{ height: 13, width: "45%", marginBottom: 10 }} />
                <div className="skel" style={{ height: 20, width: "75%", marginBottom: 8 }} />
                <div className="skel" style={{ height: 13, width: "100%", marginBottom: 5 }} />
                <div className="skel" style={{ height: 13, width: "65%", marginBottom: 18 }} />
                <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
                    {[60, 50, 70].map((w, i) => (
                        <div key={i} className="skel" style={{ height: 24, width: w, borderRadius: 50 }} />
                    ))}
                </div>
                <div className="skel" style={{ height: 38, borderRadius: 50 }} />
            </div>
        </div>
    );
}