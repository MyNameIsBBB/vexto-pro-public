import { MdSearch } from "react-icons/md";

export default function AdminSearchBar({
    searchQuery,
    onSearchChange,
    onSearch,
    searching,
}) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(e);
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex gap-3">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="ค้นหาด้วย username, email, หรือ ชื่อ..."
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                <button
                    type="submit"
                    disabled={searching || !searchQuery.trim()}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    <MdSearch className="w-5 h-5" />
                    <span>{searching ? "กำลังค้นหา..." : "ค้นหา"}</span>
                </button>
            </div>
        </form>
    );
}
