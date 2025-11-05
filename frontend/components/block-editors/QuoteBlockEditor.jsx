export default function QuoteBlockEditor({ value = {}, onChange }) {
    const v = value || {};
    const set = (key, val) => onChange && onChange({ [key]: val });
    return (
        <div className="space-y-2">
            <textarea
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none resize-none"
                rows={2}
                value={v.text || ""}
                onChange={(e) => set("text", e.target.value)}
                placeholder="คำคม"
            />
            <input
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                value={v.author || ""}
                onChange={(e) => set("author", e.target.value)}
                placeholder="ผู้เขียน"
            />
        </div>
    );
}
