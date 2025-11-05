export default function YouTubeTikTokBlockEditor({ value, onChange }) {
    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
                URL วิดีโอ (YouTube หรือ TikTok)
            </label>
            <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=... หรือ https://www.tiktok.com/@.../video/..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                value={value?.url || ""}
                onChange={(e) => onChange({ ...value, url: e.target.value })}
            />
            <p className="text-xs text-gray-400">รองรับ YouTube และ TikTok</p>
        </div>
    );
}
