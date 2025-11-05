export default function ContactInfoBlockEditor({ value = {}, onChange }) {
    const phone = value.phone || "";
    const line = value.line || "";
    const website = value.website || "";
    const note = value.note || "";
    const set = (patch) => onChange && onChange(patch);
    return (
        <div className="space-y-2">
            <input
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                value={phone}
                onChange={(e) => set({ phone: e.target.value })}
                placeholder="โทรศัพท์"
            />
            <input
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                value={line}
                onChange={(e) => set({ line: e.target.value })}
                placeholder="LINE URL"
            />
            <input
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                value={website}
                onChange={(e) => set({ website: e.target.value })}
                placeholder="เว็บไซต์"
            />
            <input
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                value={note}
                onChange={(e) => set({ note: e.target.value })}
                placeholder="หมายเหตุ"
            />
        </div>
    );
}
