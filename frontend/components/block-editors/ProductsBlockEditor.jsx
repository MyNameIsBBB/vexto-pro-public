export default function ProductsBlockEditor({ value = {}, onChange }) {
    const items = Array.isArray(value.items) ? value.items : [];
    const variant = value.variant || "cards";
    const set = (patch) => onChange && onChange(patch);
    const setItems = (next) => set({ items: next });
    const updateAt = (i, patch) => {
        const next = [...items];
        next[i] = { ...(next[i] || {}), ...patch };
        setItems(next);
    };
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs">
                รูปแบบ:
                <div className="relative inline-block">
                    <select
                        value={variant}
                        onChange={(e) => set({ variant: e.target.value })}
                        className="px-3 py-2 pr-9 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none appearance-none"
                    >
                        <option value="cards">การ์ด</option>
                        <option value="image-grid">รูปอย่างเดียว</option>
                    </select>
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white/60 text-sm">
                        ▾
                    </span>
                </div>
            </div>
            {items.map((it, i) => (
                <div
                    key={i}
                    className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2"
                >
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                            value={it.image || ""}
                            onChange={(e) =>
                                updateAt(i, { image: e.target.value })
                            }
                            placeholder="รูป (URL)"
                        />
                        <input
                            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                            value={it.url || ""}
                            onChange={(e) =>
                                updateAt(i, { url: e.target.value })
                            }
                            placeholder="ลิงก์"
                        />
                    </div>
                    {variant !== "image-grid" && (
                        <div className="grid grid-cols-3 gap-2">
                            <input
                                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                                value={it.name || ""}
                                onChange={(e) =>
                                    updateAt(i, { name: e.target.value })
                                }
                                placeholder="ชื่อสินค้า"
                            />
                            <input
                                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                                value={it.desc || ""}
                                onChange={(e) =>
                                    updateAt(i, { desc: e.target.value })
                                }
                                placeholder="คำอธิบาย"
                            />
                            <input
                                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                                value={it.price || ""}
                                onChange={(e) =>
                                    updateAt(i, { price: e.target.value })
                                }
                                placeholder="ราคา"
                            />
                        </div>
                    )}
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
                        { image: "", url: "", name: "", desc: "", price: "" },
                    ])
                }
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20"
            >
                ➕ เพิ่มสินค้า
            </button>
        </div>
    );
}
