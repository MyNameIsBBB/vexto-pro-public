export default function TimelineBlockEditor({ value, onChange }) {
    const items = value?.items || [];

    function updateItem(idx, field, val) {
        const updated = [...items];
        updated[idx] = { ...updated[idx], [field]: val };
        onChange({ ...value, items: updated });
    }

    function addItem() {
        const newItems = [...items, { year: "", title: "", description: "" }];
        onChange({ ...value, items: newItems });
    }

    function removeItem(idx) {
        const filtered = items.filter((_, i) => i !== idx);
        onChange({ ...value, items: filtered });
    }

    return (
        <div className="space-y-4">
            {items.map((item, idx) => (
                <div
                    key={idx}
                    className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-3"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white/70">
                            เหตุการณ์ #{idx + 1}
                        </span>
                        <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="text-red-400 hover:text-red-300 text-sm"
                        >
                            ลบ
                        </button>
                    </div>
                    <input
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm outline-none focus:border-cyan-500"
                        placeholder="ปี (เช่น 2020)"
                        value={item.year || ""}
                        onChange={(e) =>
                            updateItem(idx, "year", e.target.value)
                        }
                    />
                    <input
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm outline-none focus:border-cyan-500"
                        placeholder="หัวข้อ"
                        value={item.title || ""}
                        onChange={(e) =>
                            updateItem(idx, "title", e.target.value)
                        }
                    />
                    <textarea
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm outline-none focus:border-cyan-500"
                        placeholder="คำอธิบาย"
                        rows={2}
                        value={item.description || ""}
                        onChange={(e) =>
                            updateItem(idx, "description", e.target.value)
                        }
                    />
                </div>
            ))}
            <button
                type="button"
                onClick={addItem}
                className="w-full py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg text-sm font-medium transition-colors"
            >
                + เพิ่มเหตุการณ์
            </button>
        </div>
    );
}
