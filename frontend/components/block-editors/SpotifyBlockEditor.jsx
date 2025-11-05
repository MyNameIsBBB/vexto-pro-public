export default function SpotifyBlockEditor({ value, onChange }) {
    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
                URL Spotify (Playlist, Album หรือ Track)
            </label>
            <input
                type="url"
                placeholder="https://open.spotify.com/playlist/..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                value={value?.url || ""}
                onChange={(e) => onChange({ ...value, url: e.target.value })}
            />
            <label className="block text-sm font-medium text-gray-300 mt-3">
                ความสูง (px)
            </label>
            <input
                type="number"
                placeholder="380"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                value={value?.height ? parseInt(value.height) : 380}
                onChange={(e) =>
                    onChange({ ...value, height: `${e.target.value}px` })
                }
            />
        </div>
    );
}
