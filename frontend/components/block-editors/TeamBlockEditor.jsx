export default function TeamBlockEditor({ value, onChange }) {
    const items = value?.items || [];

    function updateItem(idx, field, val) {
        const updated = [...items];
        updated[idx] = { ...updated[idx], [field]: val };
        onChange({ ...value, items: updated });
    }

    function updateSocial(idx, platform, val) {
        const updated = [...items];
        const social = { ...(updated[idx].social || {}), [platform]: val };
        updated[idx] = { ...updated[idx], social };
        onChange({ ...value, items: updated });
    }

    function addItem() {
        const newItems = [
            ...items,
            {
                name: "",
                role: "",
                bio: "",
                avatar: "",
                social: { linkedin: "", twitter: "" },
            },
        ];
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
                            สมาชิก #{idx + 1}
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
                        placeholder="ชื่อ"
                        value={item.name || ""}
                        onChange={(e) =>
                            updateItem(idx, "name", e.target.value)
                        }
                    />
                    <input
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm outline-none focus:border-cyan-500"
                        placeholder="ตำแหน่ง/บทบาท"
                        value={item.role || ""}
                        onChange={(e) =>
                            updateItem(idx, "role", e.target.value)
                        }
                    />
                    <textarea
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm outline-none focus:border-cyan-500"
                        placeholder="ประวัติ/คำอธิบาย"
                        rows={2}
                        value={item.bio || ""}
                        onChange={(e) => updateItem(idx, "bio", e.target.value)}
                    />
                    <input
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm outline-none focus:border-cyan-500"
                        placeholder="URL รูปโปรไฟล์ (ถ้ามี)"
                        value={item.avatar || ""}
                        onChange={(e) =>
                            updateItem(idx, "avatar", e.target.value)
                        }
                    />
                    <div className="space-y-2">
                        <div className="text-xs text-white/50">
                            Social Media (ถ้ามี):
                        </div>
                        <input
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm outline-none focus:border-cyan-500"
                            placeholder="LinkedIn URL"
                            value={item.social?.linkedin || ""}
                            onChange={(e) =>
                                updateSocial(idx, "linkedin", e.target.value)
                            }
                        />
                        <input
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm outline-none focus:border-cyan-500"
                            placeholder="Twitter URL"
                            value={item.social?.twitter || ""}
                            onChange={(e) =>
                                updateSocial(idx, "twitter", e.target.value)
                            }
                        />
                    </div>
                </div>
            ))}
            <button
                type="button"
                onClick={addItem}
                className="w-full py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg text-sm font-medium transition-colors"
            >
                + เพิ่มสมาชิก
            </button>
        </div>
    );
}
