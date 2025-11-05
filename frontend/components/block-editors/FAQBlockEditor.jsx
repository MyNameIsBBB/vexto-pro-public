export default function FAQBlockEditor({ value = {}, onChange }) {
    const items = Array.isArray(value.items) ? value.items : [];
    const setItems = (next) => onChange && onChange({ items: next });
    const updateAt = (i, patch) => {
        const next = [...items];
        next[i] = { ...(next[i] || {}), ...patch };
        setItems(next);
    };
    return (
        <div className="space-y-2">
            {items.map((it, i) => (
                <div
                    key={i}
                    className="space-y-2 p-3 rounded-lg bg-white/5 border border-white/10"
                >
                    <input
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                        value={it.q || ""}
                        onChange={(e) => updateAt(i, { q: e.target.value })}
                        placeholder="คำถาม"
                    />
                    <textarea
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none resize-none"
                        rows={2}
                        value={it.a || ""}
                        onChange={(e) => updateAt(i, { a: e.target.value })}
                        placeholder="คำตอบ"
                    />
                    <div className="text-right">
                        <button
                            onClick={() =>
                                setItems(items.filter((_, idx) => idx !== i))
                            }
                            className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30"
                        >
                            ลบ
                        </button>
                    </div>
                </div>
            ))}
            <button
                onClick={() => setItems([...(items || []), { q: "", a: "" }])}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20"
            >
                ➕ เพิ่มคำถาม
            </button>
        </div>
    );
}
