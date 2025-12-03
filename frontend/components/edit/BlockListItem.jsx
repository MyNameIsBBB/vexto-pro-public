import { FiTrash2 } from "react-icons/fi";
import { MdEdit, MdDragIndicator } from "react-icons/md";
import BlockRenderer from "@/components/BlockRenderer";

export default function BlockListItem({
    block,
    index,
    theme,
    onEdit,
    onDelete,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd,
    isDragging,
}) {
    return (
        <div
            draggable
            onDragStart={() => onDragStart(index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDrop={() => onDrop(index)}
            onDragEnd={onDragEnd}
            className={`relative group border-2 rounded-lg overflow-hidden transition-all ${
                isDragging
                    ? "opacity-50 border-purple-500"
                    : "border-transparent hover:border-purple-500/50"
            }`}
        >
            {/* Drag handle */}
            <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
                <div className="bg-gray-800/90 p-1 rounded">
                    <MdDragIndicator className="w-5 h-5 text-gray-400" />
                </div>
            </div>

            {/* Action buttons */}
            <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onEdit(index)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    title="แก้ไข"
                >
                    <MdEdit className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onDelete(index)}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    title="ลบ"
                >
                    <FiTrash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Block preview */}
            <div className="pointer-events-none">
                <BlockRenderer
                    type={block.type}
                    props={block.props}
                    theme={theme}
                    header={block.header}
                />
            </div>
        </div>
    );
}
