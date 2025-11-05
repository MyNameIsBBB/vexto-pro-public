export default function HoursBlockEditor({ value = {}, onChange }) {
    const items = Array.isArray(value.items) ? value.items : [];
    const note = value.note || "";
    const setItems = (next) => onChange && onChange({ items: next });
    const set = (patch) => onChange && onChange(patch);
    const updateAt = (i, patch) => {
        const next = [...items];
        next[i] = { ...(next[i] || {}), ...patch };
        setItems(next);
    };
    return (
        <div className="space-y-2">
            {items.map((it, i) => (
                <div key={i} className="grid grid-cols-2 gap-2">
                    <input
                        className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                        value={it.day || ""}
                        onChange={(e) => updateAt(i, { day: e.target.value })}
                        placeholder="วัน"
                    />
                    <div className="flex gap-2">
                        <input
                            className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                            value={it.time || ""}
                            onChange={(e) =>
                                updateAt(i, { time: e.target.value })
                            }
                            placeholder="เวลา"
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
            <input
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                value={note}
                onChange={(e) => set({ note: e.target.value })}
                placeholder="หมายเหตุ (ถ้ามี)"
            />
            <button
                onClick={() =>
                    setItems([...(items || []), { day: "", time: "" }])
                }
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20"
            >
                ➕ เพิ่มวัน/เวลา
            </button>
        </div>
    );
}
