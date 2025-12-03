import { MdClose } from "react-icons/md";

export default function ConfirmDialog({
    open,
    title,
    message,
    onConfirm,
    onCancel,
    loading = false,
    feedback = "",
    showFeedback = false,
    confirmText = "ยืนยัน",
    cancelText = "ยกเลิก",
    confirmColor = "blue",
}) {
    if (!open) return null;

    const colorClasses = {
        blue: "bg-blue-600 hover:bg-blue-700",
        red: "bg-red-600 hover:bg-red-700",
        purple: "bg-purple-600 hover:bg-purple-700",
        green: "bg-green-600 hover:bg-green-700",
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    {!loading && onCancel && (
                        <button
                            onClick={onCancel}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <MdClose className="w-6 h-6" />
                        </button>
                    )}
                </div>

                {/* Message */}
                <p className="text-gray-300 mb-6">{message}</p>

                {/* Feedback textarea */}
                {showFeedback && feedback !== undefined && (
                    <div className="mb-4">
                        <textarea
                            value={feedback}
                            onChange={(e) => {
                                // Callback to parent to update feedback
                                if (onCancel) onCancel(e.target.value);
                            }}
                            placeholder="ความคิดเห็นเพิ่มเติม (ไม่บังคับ)"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
                            rows={3}
                            disabled={loading}
                        />
                    </div>
                )}

                {/* Loading state */}
                {loading && (
                    <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        <span className="ml-3 text-gray-300">
                            กำลังดำเนินการ...
                        </span>
                    </div>
                )}

                {/* Action buttons */}
                {!loading && (
                    <div className="flex gap-3">
                        {onCancel && (
                            <button
                                onClick={onCancel}
                                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                            >
                                {cancelText}
                            </button>
                        )}
                        <button
                            onClick={onConfirm}
                            className={`flex-1 px-4 py-2 ${
                                colorClasses[confirmColor] || colorClasses.blue
                            } text-white rounded-lg font-medium transition-colors`}
                        >
                            {confirmText}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
