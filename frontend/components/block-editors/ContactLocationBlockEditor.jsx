export default function ContactLocationBlockEditor({ value, onChange }) {
    // ป้องกัน value เป็น undefined
    const currentValue = value || {};

    return (
        <div className="space-y-4">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-300">
                    💡 คุณสามารถเว้นว่างช่องไหนก็ได้ที่ไม่ต้องการแสดง
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    📞 เบอร์โทรศัพท์
                </label>
                <input
                    type="tel"
                    placeholder="081-234-5678 (ไม่บังคับ)"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    value={currentValue.phone || ""}
                    onChange={(e) =>
                        onChange({ ...currentValue, phone: e.target.value })
                    }
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    📧 อีเมล
                </label>
                <input
                    type="email"
                    placeholder="contact@example.com (ไม่บังคับ)"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    value={currentValue.email || ""}
                    onChange={(e) =>
                        onChange({ ...currentValue, email: e.target.value })
                    }
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    💬 LINE ID หรือ LINE URL
                </label>
                <input
                    type="url"
                    placeholder="https://line.me/ti/p/~yourline (ไม่บังคับ)"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    value={currentValue.line || ""}
                    onChange={(e) =>
                        onChange({ ...currentValue, line: e.target.value })
                    }
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    🌐 เว็บไซต์
                </label>
                <input
                    type="url"
                    placeholder="https://example.com (ไม่บังคับ)"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    value={currentValue.website || ""}
                    onChange={(e) =>
                        onChange({ ...currentValue, website: e.target.value })
                    }
                />
            </div>

            <div className="border-t border-gray-600 pt-4 mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    📍 ที่อยู่
                </label>
                <textarea
                    rows={3}
                    placeholder="123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110 (ไม่บังคับ)"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    value={currentValue.address || ""}
                    onChange={(e) =>
                        onChange({ ...currentValue, address: e.target.value })
                    }
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    🗺️ URL Google Maps
                </label>
                <input
                    type="url"
                    placeholder="https://maps.google.com/?q=... (ไม่บังคับ)"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    value={currentValue.mapUrl || ""}
                    onChange={(e) =>
                        onChange({ ...currentValue, mapUrl: e.target.value })
                    }
                />
                <p className="text-xs text-gray-400 mt-1">
                    เปิด Google Maps → แชร์ → คัดลอกลิงก์
                </p>
            </div>

            <div className="border-t border-gray-600 pt-4 mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    📝 หมายเหตุเพิ่มเติม
                </label>
                <textarea
                    rows={2}
                    placeholder="เวลาติดต่อ, เงื่อนไข, หรือข้อมูลเพิ่มเติม (ไม่บังคับ)"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    value={currentValue.note || ""}
                    onChange={(e) =>
                        onChange({ ...currentValue, note: e.target.value })
                    }
                />
            </div>
        </div>
    );
}
