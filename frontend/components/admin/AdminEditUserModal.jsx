import { MdClose, MdSave } from "react-icons/md";

export default function AdminEditUserModal({
    editData,
    onClose,
    onSave,
    onChange,
}) {
    if (!editData) return null;

    const handleInputChange = (field, value) => {
        onChange({ ...editData, [field]: value });
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl max-w-lg w-full border border-gray-700">
                {/* Header */}
                <div className="border-b border-gray-700 p-6 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">
                        แก้ไขผู้ใช้
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <MdClose className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Admin Toggle */}
                    <div className="flex items-center justify-between p-4 bg-red-600/10 border border-red-500/30 rounded-lg">
                        <div>
                            <label className="font-medium text-white">
                                Admin
                            </label>
                            <p className="text-xs text-gray-400 mt-1">
                                Admin จะมีสิทธิ์เต็ม ไม่มีวันหมดอายุ
                            </p>
                        </div>
                        <input
                            type="checkbox"
                            checked={editData.isAdmin}
                            onChange={(e) =>
                                handleInputChange("isAdmin", e.target.checked)
                            }
                            className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-red-600 focus:ring-red-500"
                        />
                    </div>

                    {/* Pro Toggle */}
                    <div className="flex items-center justify-between p-4 bg-purple-600/10 border border-purple-500/30 rounded-lg">
                        <div>
                            <label className="font-medium text-white">
                                Pro
                            </label>
                            <p className="text-xs text-gray-400 mt-1">
                                เปิดใช้งานฟีเจอร์ Pro
                            </p>
                        </div>
                        <input
                            type="checkbox"
                            checked={editData.isPro}
                            onChange={(e) =>
                                handleInputChange("isPro", e.target.checked)
                            }
                            className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500"
                            disabled={editData.isAdmin}
                        />
                    </div>

                    {/* Pro Tier */}
                    {!editData.isAdmin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Pro Tier
                            </label>
                            <select
                                value={editData.proTier}
                                onChange={(e) =>
                                    handleInputChange("proTier", e.target.value)
                                }
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            >
                                <option value="free">Free</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                    )}

                    {/* Pro Expiry */}
                    {!editData.isAdmin && editData.proTier !== "free" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                วันหมดอายุ Pro
                            </label>
                            <input
                                type="date"
                                value={editData.proExpiry}
                                onChange={(e) =>
                                    handleInputChange(
                                        "proExpiry",
                                        e.target.value
                                    )
                                }
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                ถ้าเป็น Admin จะไม่มีวันหมดอายุ
                            </p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="border-t border-gray-700 p-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={onSave}
                        className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <MdSave className="w-5 h-5" />
                        <span>บันทึก</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
