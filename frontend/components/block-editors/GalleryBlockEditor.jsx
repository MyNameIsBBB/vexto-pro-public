export default function GalleryBlockEditor({ value = {}, onChange }) {
    const images = Array.isArray(value.images) ? value.images : [];
    const setImages = (next) => onChange && onChange({ images: next });

    return (
        <div className="space-y-2">
            {images.map((img, i) => (
                <div key={i} className="flex gap-2">
                    <input
                        className="flex-1 min-w-0 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                        value={img}
                        onChange={(e) => {
                            const next = [...images];
                            next[i] = e.target.value;
                            setImages(next);
                        }}
                        placeholder={`รูปที่ ${i + 1} (URL)`}
                    />
                    <button
                        onClick={() => {
                            const next = images.filter((_, idx) => idx !== i);
                            setImages(next);
                        }}
                        className="px-3 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30"
                    >
                        ลบ
                    </button>
                </div>
            ))}
            <button
                onClick={() => setImages([...images, ""])}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20"
            >
                ➕ เพิ่มรูป
            </button>
        </div>
    );
}
