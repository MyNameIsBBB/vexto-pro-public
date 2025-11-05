export default function ContactFormBlockEditor({ value, onChange }) {
    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
                หัวข้อ
            </label>
            <input
                type="text"
                placeholder="ติดต่อเรา"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                value={value?.title || ""}
                onChange={(e) => onChange({ ...value, title: e.target.value })}
            />
            <label className="block text-sm font-medium text-gray-300 mt-3">
                อีเมลรับข้อความ
            </label>
            <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                value={value?.email || ""}
                onChange={(e) => onChange({ ...value, email: e.target.value })}
            />
            <p className="text-xs text-gray-400">
                ข้อความจากฟอร์มจะถูกส่งไปยังอีเมลนี้
            </p>
        </div>
    );
}
