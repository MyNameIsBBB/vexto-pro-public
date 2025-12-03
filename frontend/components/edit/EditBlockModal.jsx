import { MdClose, MdEdit, MdSave } from "react-icons/md";
import BlockEditor from "@/components/block-editors/BlockEditor";
import HeaderBlockEditor from "@/components/block-editors/HeaderBlockEditor";

export default function EditBlockModal({
    open,
    blockData,
    headerData,
    onClose,
    onSave,
    onBlockChange,
    onHeaderChange,
}) {
    if (!open || !blockData) return null;

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col my-8 shadow-2xl border border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex-shrink-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <MdEdit className="w-6 h-6 text-purple-400" />
                        แก้ไขบล็อก
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
                    <div className="space-y-6">
                        {/* Header Editor */}
                        {headerData && (
                            <div className="border border-gray-700 rounded-lg p-4 bg-gray-700/30">
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    หัวข้อส่วน (Header)
                                </label>
                                <HeaderBlockEditor
                                    value={headerData.props}
                                    onChange={(newProps) =>
                                        onHeaderChange({
                                            ...headerData,
                                            props: newProps,
                                        })
                                    }
                                />
                            </div>
                        )}

                        {/* Block Content Editor */}
                        <div className="border border-gray-700 rounded-lg p-4">
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                เนื้อหาบล็อก
                            </label>
                            <BlockEditor
                                type={blockData.type}
                                value={blockData.props}
                                onChange={(newProps) =>
                                    onBlockChange({
                                        ...blockData,
                                        props: newProps,
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex-shrink-0 border-t border-gray-700 px-6 py-4 flex justify-end gap-3 bg-gray-800/50 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={onSave}
                        className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                    >
                        <MdSave className="w-5 h-5" />
                        บันทึก
                    </button>
                </div>
            </div>
        </div>
    );
}
