export default function HeaderBlockEditor({ value = {}, onChange }) {
    const v = value || {};
    const set = (key, val) => onChange && onChange({ [key]: val });
    return (
        <div className="space-y-2">
            <input
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                value={v.title || ""}
                onChange={(e) => set("title", e.target.value)}
                placeholder="หัวข้อ"
            />
        </div>
    );
}
