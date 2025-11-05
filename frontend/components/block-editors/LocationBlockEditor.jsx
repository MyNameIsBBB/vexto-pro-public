export default function LocationBlockEditor({ value = {}, onChange }) {
    const address = value.address || "";
    const mapUrl = value.mapUrl || "";
    const note = value.note || "";
    const set = (patch) => onChange && onChange(patch);
    return (
        <div className="space-y-2">
            <textarea
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none resize-none"
                rows={2}
                value={address}
                onChange={(e) => set({ address: e.target.value })}
                placeholder="ที่อยู่"
            />
            <input
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                value={mapUrl}
                onChange={(e) => set({ mapUrl: e.target.value })}
                placeholder="ลิงก์แผนที่"
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
