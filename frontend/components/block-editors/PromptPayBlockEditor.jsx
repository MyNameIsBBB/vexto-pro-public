export default function PromptPayBlockEditor({ value, onChange }) {
    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
                หัวข้อ
            </label>
            <input
                type="text"
                placeholder="สนับสนุนผ่าน PromptPay"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                value={value?.title || ""}
                onChange={(e) => onChange({ ...value, title: e.target.value })}
            />
            <label className="block text-sm font-medium text-gray-300 mt-3">
                เบอร์โทรศัพท์ PromptPay
            </label>
            <input
                type="tel"
                placeholder="0812345678"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                value={value?.phoneNumber || ""}
                onChange={(e) =>
                    onChange({ ...value, phoneNumber: e.target.value })
                }
            />
            <label className="block text-sm font-medium text-gray-300 mt-3">
                จำนวนเงิน (บาท) - ไม่จำเป็น
            </label>
            <input
                type="number"
                placeholder="100"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                value={value?.amount || ""}
                onChange={(e) => onChange({ ...value, amount: e.target.value })}
            />
            <p className="text-xs text-gray-400">
                QR Code จะถูกสร้างอัตโนมัติจากเบอร์โทรศัพท์
            </p>
        </div>
    );
}
