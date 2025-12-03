import { MdEdit, MdDelete } from "react-icons/md";

export default function AdminSearchResults({
    results,
    onViewDetails,
    onEdit,
    onDelete,
}) {
    if (results.length === 0) {
        return (
            <div className="text-center py-12 text-gray-400">
                <p>ไม่พบผู้ใช้ที่ค้นหา</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-medium text-white mb-3">
                ผลการค้นหา ({results.length})
            </h3>
            {results.map((user) => (
                <div
                    key={user._id}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-purple-500 transition-colors"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-medium text-white">
                                    {user.username || user.email}
                                </h4>
                                {user.isAdmin && (
                                    <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded-full">
                                        Admin
                                    </span>
                                )}
                                {user.isPro && (
                                    <span className="px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full">
                                        Pro
                                    </span>
                                )}
                            </div>
                            <div className="text-sm text-gray-400 space-y-1">
                                <p>Email: {user.email}</p>
                                {user.username && (
                                    <p>Username: @{user.username}</p>
                                )}
                                <p>
                                    ลงทะเบียน:{" "}
                                    {new Date(
                                        user.createdAt
                                    ).toLocaleDateString("th-TH")}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onViewDetails(user._id)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                ดูรายละเอียด
                            </button>
                            <button
                                onClick={() => onEdit(user)}
                                className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                                title="แก้ไข"
                            >
                                <MdEdit className="w-5 h-5" />
                            </button>
                            {onDelete && (
                                <button
                                    onClick={() =>
                                        onDelete(
                                            user._id,
                                            user.username || user.email
                                        )
                                    }
                                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                    title="ลบ"
                                >
                                    <MdDelete className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
