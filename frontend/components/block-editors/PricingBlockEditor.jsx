export default function PricingBlockEditor({ value = {}, onChange }) {
    const items = Array.isArray(value.items) ? value.items : [];
    const setItems = (next) => onChange && onChange({ items: next });
    const updateAt = (i, patch) => {
        const next = [...items];
        next[i] = { ...(next[i] || {}), ...patch };
        setItems(next);
    };
    const setFeaturesText = (i, text) => {
        const features = text
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        updateAt(i, { features });
    };
    return (
        <div className="space-y-3">
            {items.map((plan, i) => (
                <div
                    key={i}
                    className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2"
                >
                    <div className="grid grid-cols-2 gap-2 items-center">
                        <input
                            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                            value={plan.title || ""}
                            onChange={(e) =>
                                updateAt(i, { title: e.target.value })
                            }
                            placeholder="ชื่อแพ็กเกจ"
                        />
                        <div className="flex gap-2 items-center">
                            <input
                                className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                                value={plan.price || ""}
                                onChange={(e) =>
                                    updateAt(i, { price: e.target.value })
                                }
                                placeholder="ราคา"
                            />
                            <button
                                onClick={() =>
                                    setItems(
                                        items.filter((_, idx) => idx !== i)
                                    )
                                }
                                className="px-3 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30"
                            >
                                ลบ
                            </button>
                        </div>
                    </div>
                    <textarea
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none resize-none"
                        rows={2}
                        value={(plan.features || []).join(", ")}
                        onChange={(e) => setFeaturesText(i, e.target.value)}
                        placeholder="ฟีเจอร์ (คั่นด้วย comma)"
                    />
                </div>
            ))}
            <button
                onClick={() =>
                    setItems([
                        ...(items || []),
                        { title: "", price: "", features: [] },
                    ])
                }
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20"
            >
                ➕ เพิ่มแพ็กเกจ
            </button>
        </div>
    );
}
