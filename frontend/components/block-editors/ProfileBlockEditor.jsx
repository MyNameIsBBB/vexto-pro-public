export default function ProfileBlockEditor({ value = {}, onChange }) {
    const v = value || {};
    const set = (key, val) => onChange && onChange({ ...v, [key]: val });

    return (
        <div className="space-y-2">
            <input
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                value={v.name || ""}
                onChange={(e) => set("name", e.target.value)}
                placeholder="ชื่อ"
            />
            <input
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                value={v.role || ""}
                onChange={(e) => set("role", e.target.value)}
                placeholder="อาชีพ/บทบาท"
            />
            <input
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                value={v.location || ""}
                onChange={(e) => set("location", e.target.value)}
                placeholder="ที่อยู่/จังหวัด"
            />
            <input
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                value={v.email || ""}
                onChange={(e) => set("email", e.target.value)}
                placeholder="อีเมล"
                type="email"
            />
            <textarea
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none resize-none"
                rows={3}
                value={v.bio || ""}
                onChange={(e) => set("bio", e.target.value)}
                placeholder="แนะนำตัว"
            />
        </div>
    );
}
