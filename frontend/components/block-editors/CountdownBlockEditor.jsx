export default function CountdownBlockEditor({ value, onChange }) {
    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300 mt-3">
                วันที่เป้าหมาย
            </label>
            <input
                type="datetime-local"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                value={
                    value?.targetDate
                        ? new Date(value.targetDate).toISOString().slice(0, 16)
                        : ""
                }
                onChange={(e) =>
                    onChange({
                        ...value,
                        targetDate: new Date(e.target.value).toISOString(),
                    })
                }
            />
            <label className="block text-sm font-medium text-gray-300 mt-3">
                คำอธิบาย (ถึงวันพิเศษ)
            </label>
            <input
                type="text"
                placeholder="ถึงวันเกิด, ถึงงานแต่ง, เปิดตัวสินค้า..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                value={value?.description || ""}
                onChange={(e) =>
                    onChange({ ...value, description: e.target.value })
                }
            />
        </div>
    );
}
