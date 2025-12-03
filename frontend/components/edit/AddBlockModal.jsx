import { MdClose, MdAdd } from "react-icons/md";
import { useState } from "react";

export default function AddBlockModal({
    open,
    onClose,
    onAdd,
    groupedTemplates,
    proActive,
}) {
    const [selectedCategory, setSelectedCategory] = useState(null);

    if (!open) return null;

    const handleAddBlock = (template) => {
        onAdd(template);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-5xl w-full max-h-[85vh] flex flex-col my-8 shadow-2xl border border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex-shrink-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <MdAdd className="w-6 h-6 text-purple-400" />
                        เพิ่มบล็อกใหม่
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <MdClose className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                selectedCategory === null
                                    ? "bg-purple-600 text-white"
                                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                        >
                            ทั้งหมด
                        </button>
                        {groupedTemplates.map((group) => (
                            <button
                                key={group.category}
                                onClick={() =>
                                    setSelectedCategory(group.category)
                                }
                                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                                    selectedCategory === group.category
                                        ? "bg-purple-600 text-white"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                }`}
                            >
                                {group.icon}
                                {group.category}
                            </button>
                        ))}
                    </div>

                    {/* Templates Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {groupedTemplates
                            .filter(
                                (group) =>
                                    selectedCategory === null ||
                                    group.category === selectedCategory
                            )
                            .flatMap((group) =>
                                group.templates.map((template) => {
                                    const isFree = template.badge === "free";
                                    const isPremium =
                                        template.badge === "premium";
                                    const isLocked = isPremium && !proActive;

                                    return (
                                        <button
                                            key={template.type}
                                            onClick={() => {
                                                if (isLocked) {
                                                    alert(
                                                        "🔒 ต้องเป็น Pro จึงจะใช้บล็อกนี้ได้"
                                                    );
                                                } else {
                                                    handleAddBlock(template);
                                                }
                                            }}
                                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                                                isLocked
                                                    ? "border-white/5 bg-white/5 opacity-60 cursor-not-allowed"
                                                    : "border-white/10 bg-gray-700/50 hover:border-purple-500 hover:bg-gray-700"
                                            }`}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="text-2xl">
                                                    {template.icon}
                                                </div>
                                                {isPremium && (
                                                    <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full">
                                                        Pro
                                                    </span>
                                                )}
                                                {isFree && (
                                                    <span className="px-2 py-0.5 bg-green-600 text-white text-xs rounded-full">
                                                        Free
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className="font-semibold text-white mb-1">
                                                {template.label}
                                            </h4>
                                            <p className="text-xs text-gray-400">
                                                {template.description}
                                            </p>
                                        </button>
                                    );
                                })
                            )}
                    </div>

                    {!proActive && (
                        <div className="mt-6 p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg">
                            <p className="text-sm text-gray-300">
                                💎 อัปเกรดเป็น <strong>Pro</strong>{" "}
                                เพื่อปลดล็อกบล็อกพิเศษทั้งหมด!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
