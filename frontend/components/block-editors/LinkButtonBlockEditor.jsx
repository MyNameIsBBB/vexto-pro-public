export default function LinkButtonBlockEditor({ value = {}, onChange }) {
    const v = value || {};
    const set = (key, val) => onChange && onChange({ [key]: val });
    return (
        <div className="space-y-2">
            <input
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                value={v.label || ""}
                onChange={(e) => set("label", e.target.value)}
                placeholder="ข้อความ"
            />
            <input
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                value={v.url || ""}
                onChange={(e) => set("url", e.target.value)}
                placeholder="https://..."
            />
        </div>
    );
}
