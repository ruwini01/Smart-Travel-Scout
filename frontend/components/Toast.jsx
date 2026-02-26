"use client";
import { useEffect } from "react";

export default function Toast({ message, icon, onDone }) {
    useEffect(() => {
        const t = setTimeout(onDone, 3000);
        return () => clearTimeout(t);
    }, [onDone]);

    return (
        <div className="toast">
            <span>{icon}</span>
            <span>{message}</span>
        </div>
    );
}