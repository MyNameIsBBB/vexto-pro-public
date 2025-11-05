export default function SkillsBlockEditor({ value = {}, onChange }) {
    const items = Array.isArray(value.items) ? value.items : [];
    const setItems = (next) => onChange && onChange({ items: next });

    const updateAt = (i, patch) => {
        const next = [...items];
        next[i] = { ...(next[i] || {}), ...patch };
        setItems(next);
    };

    const updateSkillsFromString = (i, str) => {
        const arr = (str || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        updateAt(i, { skills: arr });
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
                        value={it.category || ""}
                        onChange={(e) =>
                            updateAt(i, { category: e.target.value })
                        }
                        placeholder="หมวดหมู่ (เช่น Frontend, Backend)"
                    />
                    <input
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                        value={(it.skills || []).join(", ")}
                        onChange={(e) =>
                            updateSkillsFromString(i, e.target.value)
                        }
                        placeholder="สกิล (คั่นด้วยเครื่องหมายจุลภาค , )"
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
                    setItems([...(items || []), { category: "", skills: [] }])
                }
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20"
            >
                ➕ เพิ่มหมวดสกิล
            </button>
        </div>
    );
}
