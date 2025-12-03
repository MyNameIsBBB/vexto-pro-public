import {
    themePresets,
    borderRadiusOptions,
    fontOptions,
} from "@/components/editor/profileOptions";

export default function ThemeEditor({
    theme,
    onChange,
    showAdvanced = false,
    onToggleAdvanced,
}) {
    const handlePresetSelect = (preset) => {
        onChange({
            ...theme,
            ...preset,
            textOverrides: theme.textOverrides || {},
        });
    };

    const handleColorChange = (key, value) => {
        onChange({
            ...theme,
            [key]: value,
        });
    };

    const handleTextOverride = (key, value) => {
        onChange({
            ...theme,
            textOverrides: {
                ...theme.textOverrides,
                [key]: value,
            },
        });
    };

    return (
        <div className="space-y-6">
            {/* Theme Presets */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                    ชุดธีมสำเร็จรูป
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {themePresets.map((preset) => (
                        <button
                            key={preset.name}
                            onClick={() => handlePresetSelect(preset)}
                            className="p-4 rounded-lg border-2 border-gray-700 hover:border-purple-500 transition-all text-left group"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div
                                    className="w-8 h-8 rounded-full"
                                    style={{ backgroundColor: preset.primary }}
                                />
                                <span className="font-medium text-white group-hover:text-purple-400 transition-colors">
                                    {preset.name}
                                </span>
                            </div>
                            <div className="flex gap-1">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{
                                        backgroundColor: preset.background,
                                    }}
                                />
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: preset.accent }}
                                />
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{
                                        backgroundColor: preset.textColor,
                                    }}
                                />
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Basic Colors */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        สีหลัก
                    </label>
                    <input
                        type="color"
                        value={theme.primary}
                        onChange={(e) =>
                            handleColorChange("primary", e.target.value)
                        }
                        className="w-full h-10 rounded cursor-pointer"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        สีเน้น
                    </label>
                    <input
                        type="color"
                        value={theme.accent}
                        onChange={(e) =>
                            handleColorChange("accent", e.target.value)
                        }
                        className="w-full h-10 rounded cursor-pointer"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        สีพื้นหลังการ์ด
                    </label>
                    <input
                        type="color"
                        value={theme.background}
                        onChange={(e) =>
                            handleColorChange("background", e.target.value)
                        }
                        className="w-full h-10 rounded cursor-pointer"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        สีพื้นหลังนอก
                    </label>
                    <input
                        type="color"
                        value={theme.outerBackground}
                        onChange={(e) =>
                            handleColorChange("outerBackground", e.target.value)
                        }
                        className="w-full h-10 rounded cursor-pointer"
                    />
                </div>
            </div>

            {/* Border Radius */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    มุมโค้ง
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {borderRadiusOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() =>
                                handleColorChange("borderRadius", option.value)
                            }
                            className={`p-3 rounded-lg border-2 transition-all ${
                                theme.borderRadius === option.value
                                    ? "border-purple-500 bg-purple-500/20"
                                    : "border-gray-700 hover:border-gray-600"
                            }`}
                        >
                            <div className="text-center">
                                <div className="text-sm font-medium text-white mb-1">
                                    {option.label}
                                </div>
                                <div className="text-xs text-gray-400">
                                    {option.value}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Font Family */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    ฟอนต์
                </label>
                <select
                    value={theme.fontFamily}
                    onChange={(e) =>
                        handleColorChange("fontFamily", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                    {fontOptions.map((font) => (
                        <option key={font.value} value={font.value}>
                            {font.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Advanced Settings Toggle */}
            <button
                onClick={onToggleAdvanced}
                className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
                {showAdvanced
                    ? "ซ่อนการตั้งค่าขั้นสูง"
                    : "แสดงการตั้งค่าขั้นสูง"}
            </button>

            {/* Advanced Settings */}
            {showAdvanced && (
                <div className="space-y-4 p-4 bg-gray-700/50 rounded-lg">
                    <h4 className="font-medium text-white mb-3">
                        ปรับแต่งสีข้อความแต่ละส่วน
                    </h4>
                    <div className="space-y-3">
                        {[
                            { key: "name", label: "ชื่อ" },
                            { key: "header", label: "หัวข้อ" },
                            { key: "body", label: "เนื้อหา" },
                            { key: "muted", label: "ข้อความรอง" },
                        ].map(({ key, label }) => (
                            <div key={key}>
                                <label className="block text-xs text-gray-400 mb-1">
                                    {label}
                                </label>
                                <input
                                    type="color"
                                    value={
                                        theme.textOverrides?.[key] ||
                                        theme.textColor
                                    }
                                    onChange={(e) =>
                                        handleTextOverride(key, e.target.value)
                                    }
                                    className="w-full h-8 rounded cursor-pointer"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
