import { MdAdd, MdClose } from "react-icons/md";
import { quickSocialPlatforms } from "@/components/editor/profileOptions";

export default function SocialLinksEditor({ socials, onChange }) {
    const addSocial = () => {
        onChange([...socials, { label: "", url: "" }]);
    };

    const removeSocial = (index) => {
        onChange(socials.filter((_, i) => i !== index));
    };

    const updateSocial = (index, field, value) => {
        const updated = [...socials];
        updated[index][field] = value;
        onChange(updated);
    };

    const addQuickPlatform = (platform) => {
        onChange([...socials, { label: platform.label, url: "" }]);
    };

    return (
        <div className="space-y-4">
            {/* Quick Add Platforms */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    เพิ่มลิงก์โซเชียล
                </label>
                <div className="flex flex-wrap gap-2">
                    {quickSocialPlatforms.map((platform) => (
                        <button
                            key={platform.label}
                            onClick={() => addQuickPlatform(platform)}
                            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
                        >
                            <span>{platform.icon}</span>
                            <span>{platform.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Social Links List */}
            <div className="space-y-3">
                {socials.map((social, index) => (
                    <div
                        key={index}
                        className="flex gap-2 p-3 bg-gray-700/50 rounded-lg"
                    >
                        <div className="flex-1 space-y-2">
                            <input
                                type="text"
                                placeholder="ชื่อแพลตฟอร์ม (เช่น Facebook, Instagram)"
                                value={social.label}
                                onChange={(e) =>
                                    updateSocial(index, "label", e.target.value)
                                }
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            />
                            <input
                                type="url"
                                placeholder="URL (https://...)"
                                value={social.url}
                                onChange={(e) =>
                                    updateSocial(index, "url", e.target.value)
                                }
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            />
                        </div>
                        <button
                            onClick={() => removeSocial(index)}
                            className="p-2 h-fit bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                            title="ลบ"
                        >
                            <MdClose className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Add Custom Button */}
            <button
                onClick={addSocial}
                className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                <MdAdd className="w-5 h-5" />
                <span>เพิ่มลิงก์โซเชียลอื่น ๆ</span>
            </button>
        </div>
    );
}
