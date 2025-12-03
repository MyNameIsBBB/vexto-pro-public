export default function AdminUserDetails({ user, onClose, onEdit, onDelete }) {
    if (!user) return null;

    const { user: userData, profile } = user;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
                {/* Header */}
                <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">
                        รายละเอียดผู้ใช้
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* User Info */}
                    <div className="bg-gray-700/50 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-white mb-3">
                            ข้อมูลบัญชี
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">User ID:</span>
                                <span className="text-white font-mono">
                                    {userData._id}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Email:</span>
                                <span className="text-white">
                                    {userData.email}
                                </span>
                            </div>
                            {userData.username && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">
                                        Username:
                                    </span>
                                    <span className="text-white">
                                        @{userData.username}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-400">สถานะ:</span>
                                <div className="flex gap-2">
                                    {userData.isAdmin && (
                                        <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded-full">
                                            Admin
                                        </span>
                                    )}
                                    {userData.isPro && (
                                        <span className="px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full">
                                            Pro
                                        </span>
                                    )}
                                    {!userData.isAdmin && !userData.isPro && (
                                        <span className="px-2 py-0.5 bg-gray-600 text-white text-xs rounded-full">
                                            Free
                                        </span>
                                    )}
                                </div>
                            </div>
                            {userData.proTier && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">
                                        Pro Tier:
                                    </span>
                                    <span className="text-white">
                                        {userData.proTier}
                                    </span>
                                </div>
                            )}
                            {userData.proExpiry && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">
                                        Pro หมดอายุ:
                                    </span>
                                    <span className="text-white">
                                        {new Date(
                                            userData.proExpiry
                                        ).toLocaleDateString("th-TH")}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-400">
                                    ลงทะเบียน:
                                </span>
                                <span className="text-white">
                                    {new Date(
                                        userData.createdAt
                                    ).toLocaleString("th-TH")}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Profile Info */}
                    {profile && (
                        <div className="bg-gray-700/50 rounded-lg p-4">
                            <h3 className="text-lg font-medium text-white mb-3">
                                ข้อมูลโปรไฟล์
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={
                                            profile.avatarUrl ||
                                            "/images/no-profile.png"
                                        }
                                        alt="Avatar"
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-medium text-white">
                                            {profile.displayName}
                                        </p>
                                        {profile.bio && (
                                            <p className="text-sm text-gray-400 mt-1">
                                                {profile.bio}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-sm space-y-1">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">
                                            จำนวนโซเชียล:
                                        </span>
                                        <span className="text-white">
                                            {profile.socials?.length || 0}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">
                                            จำนวนบล็อก:
                                        </span>
                                        <span className="text-white">
                                            {profile.blocks?.length || 0}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">
                                            สถานะโปรไฟล์:
                                        </span>
                                        <span className="text-white">
                                            {profile.isPublic
                                                ? "สาธารณะ"
                                                : "ส่วนตัว"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-6 flex gap-3">
                    <button
                        onClick={() => onEdit(userData)}
                        className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                    >
                        แก้ไขผู้ใช้
                    </button>
                    {onDelete && (
                        <button
                            onClick={() =>
                                onDelete(
                                    userData._id,
                                    userData.username || userData.email
                                )
                            }
                            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                        >
                            ลบ
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                    >
                        ปิด
                    </button>
                </div>
            </div>
        </div>
    );
}
