export default function TextBlockEditor({ value = {}, onChange }) {
    const v = value || {};
    const set = (key, val) => onChange && onChange({ [key]: val });
    return (
        <textarea
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none resize-none"
            rows={3}
            value={v.text || ""}
            onChange={(e) => set("text", e.target.value)}
            placeholder="ข้อความ"
        />
    );
}
