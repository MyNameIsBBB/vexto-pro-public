"use client";
import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

const ToastCtx = createContext({
    notify: (_type, _text) => {},
    position: "top-center",
    setPosition: (_p) => {},
});

export function ToastProvider({ children, defaultPosition = "top-center" }) {
    const [toasts, setToasts] = useState([]);
    const [position, setPosition] = useState(defaultPosition);

    const dismiss = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const notify = useCallback(
        (type, text, opts = {}) => {
            const id = crypto.randomUUID();
            const timeout = opts.timeout ?? 2600;
            setToasts((prev) => [...prev, { id, type, text }]);
            if (timeout > 0) setTimeout(() => dismiss(id), timeout);
            return id;
        },
        [dismiss]
    );

    const value = useMemo(
        () => ({ notify, position, setPosition }),
        [notify, position]
    );

    const isTop = position === "top-center";
    const isBottom = position === "bottom-center";

    return (
        <ToastCtx.Provider value={value}>
            {children}
            {/* Toast viewport */}
            <div
                className={
                    `fixed z-[100] inset-x-0 ${
                        isTop ? "top-4" : isBottom ? "bottom-4" : "top-4"
                    } ` + "flex justify-center pointer-events-none"
                }
            >
                <div className="space-y-2 pointer-events-auto">
                    {toasts.map((t) => {
                        const bgClass =
                            t.type === "success"
                                ? "bg-emerald-600"
                                : t.type === "error"
                                ? "bg-rose-600"
                                : t.type === "warning"
                                ? "bg-amber-600"
                                : "bg-sky-600"; // info/default
                        const barClass =
                            t.type === "success"
                                ? "bg-emerald-700"
                                : t.type === "error"
                                ? "bg-rose-700"
                                : t.type === "warning"
                                ? "bg-amber-700"
                                : "bg-sky-700";
                        const icon =
                            t.type === "success"
                                ? "✅"
                                : t.type === "error"
                                ? "⚠️"
                                : t.type === "warning"
                                ? "⚠️"
                                : "ℹ️";
                        return (
                            <div
                                key={t.id}
                                role="status"
                                aria-live="polite"
                                className={`relative min-w-[240px] max-w-[360px] p-4 rounded-xl shadow-2xl flex items-start gap-3 text-white ${bgClass}`}
                                style={{ animation: "toast-in .2s ease" }}
                            >
                                <div
                                    className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${barClass}`}
                                />
                                <div className="text-lg">{icon}</div>
                                <div className="text-sm leading-snug pr-6">
                                    {t.text}
                                </div>
                                <button
                                    onClick={() => dismiss(t.id)}
                                    className="absolute top-2 right-2 text-white/90 hover:text-white"
                                    aria-label="close"
                                >
                                    ✕
                                </button>
                                <div
                                    className={`absolute left-0 bottom-0 h-1 rounded-b-xl ${barClass}`}
                                    style={{
                                        animation:
                                            "toast-progress 2.6s linear forwards",
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
            <style jsx global>{`
                @keyframes toast-in {
                    from {
                        transform: translateY(${isTop ? "-6px" : "6px"});
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                @keyframes toast-progress {
                    from {
                        width: 100%;
                    }
                    to {
                        width: 0%;
                    }
                }
            `}</style>
        </ToastCtx.Provider>
    );
}

export function useToast() {
    return useContext(ToastCtx);
}
