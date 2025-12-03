import { MdCheckCircle } from "react-icons/md";

export default function SuccessModal({ open, title, message, onClose }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-700 text-center">
                {/* Success icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                        <MdCheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>

                {/* Message */}
                <p className="text-gray-300 mb-6">{message}</p>

                {/* Close button (optional) */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                    >
                        ปิด
                    </button>
                )}
            </div>
        </div>
    );
}
