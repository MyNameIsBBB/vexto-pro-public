export default function GoogleMapsBlockEditor({ value, onChange }) {
    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
                ตำแหน่งที่ตั้ง
            </label>
            <input
                type="text"
                placeholder="ชื่อสถานที่ หรือ ที่อยู่"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                value={value?.location || ""}
                onChange={(e) =>
                    onChange({ ...value, location: e.target.value })
                }
            />
            <label className="block text-sm font-medium text-gray-300 mt-3">
                Google Maps API Key (จำเป็น)
            </label>
            <input
                type="text"
                placeholder="AIza..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                value={value?.apiKey || ""}
                onChange={(e) => onChange({ ...value, apiKey: e.target.value })}
            />
            <label className="block text-sm font-medium text-gray-300 mt-3">
                ความสูง (px)
            </label>
            <input
                type="number"
                placeholder="300"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                value={value?.height ? parseInt(value.height) : 300}
                onChange={(e) =>
                    onChange({ ...value, height: `${e.target.value}px` })
                }
            />
            <p className="text-xs text-gray-400">
                ต้องการ Google Maps Embed API Key -{" "}
                <a
                    href="https://developers.google.com/maps/documentation/embed/get-api-key"
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-400 hover:underline"
                >
                    รับ API Key
                </a>
            </p>
        </div>
    );
}
