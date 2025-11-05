export default function StatsBlockEditor({ value = {}, onChange }) {
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
                <div key={i} className="grid grid-cols-3 gap-2 items-center">
                    <input
                        className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                        value={it.label || ""}
                        onChange={(e) => updateAt(i, { label: e.target.value })}
                        placeholder="Label"
                    />
                    <input
                        className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                        value={it.value || ""}
                        onChange={(e) => updateAt(i, { value: e.target.value })}
                        placeholder="Value"
                    />
                    <div className="flex gap-2">
                        <input
                            className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                            value={it.sub || ""}
                            onChange={(e) =>
                                updateAt(i, { sub: e.target.value })
                            }
                            placeholder="Sub"
                        />
                        <button
                            onClick={() =>
                                setItems(items.filter((_, idx) => idx !== i))
                            }
                            className="px-3 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30"
                        >
                            ลบ
                        </button>
                    </div>
                </div>
            ))}
            <button
                onClick={() =>
                    setItems([
                        ...(items || []),
                        { label: "", value: "", sub: "" },
                    ])
                }
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20"
            >
                ➕ เพิ่มรายการ
            </button>
        </div>
    );
}
