export default function ExperienceBlockEditor({ value = {}, onChange }) {
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
                        value={it.title || ""}
                        onChange={(e) => updateAt(i, { title: e.target.value })}
                        placeholder="ชื่อตำแหน่ง/บทบาท"
                    />
                    <input
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                        value={it.period || ""}
                        onChange={(e) =>
                            updateAt(i, { period: e.target.value })
                        }
                        placeholder="ช่วงเวลา (เช่น 2024 - ปัจจุบัน)"
                    />
                    <textarea
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none resize-none"
                        rows={2}
                        value={it.description || ""}
                        onChange={(e) =>
                            updateAt(i, { description: e.target.value })
                        }
                        placeholder="รายละเอียด"
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
                onClick={() =>
                    setItems([
                        ...(items || []),
                        { title: "", period: "", description: "" },
                    ])
                }
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20"
            >
                ➕ เพิ่มประสบการณ์
            </button>
        </div>
    );
}
