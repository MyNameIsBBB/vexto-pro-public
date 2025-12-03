import BlockRenderer from "@/components/BlockRenderer";
import SocialIcons from "@/components/SocialIcons";
import { MdOpenInFull } from "react-icons/md";
import Link from "next/link";

export default function ExampleCard({ example, index }) {
    const { profile, theme, blocks } = example;

    // Build minimal inline style for the card
    const cardStyle = {
        backgroundColor: theme.background || "#1e293b",
        borderRadius: theme.borderRadius || "12px",
    };

    return (
        <div className="relative group">
            {/* Preview Card */}
            <div
                style={cardStyle}
                className="p-6 shadow-xl border border-white/10 transition-all group-hover:scale-[1.02] group-hover:shadow-2xl"
            >
                {/* Avatar & Profile */}
                <div className="flex flex-col items-center mb-4">
                    <img
                        src={profile.avatarUrl}
                        alt={profile.displayName}
                        className="w-24 h-24 rounded-full object-cover mb-3"
                    />
                    <h3
                        className="text-xl font-bold text-center"
                        style={{ color: theme.textColor || "#f3f4f6" }}
                    >
                        {profile.displayName}
                    </h3>
                    {profile.bio && (
                        <p
                            className="text-sm text-center mt-1 line-clamp-2"
                            style={{ color: theme.textColor || "#f3f4f6" }}
                        >
                            {profile.bio}
                        </p>
                    )}
                </div>

                {/* Social Icons */}
                {profile.socials?.length > 0 && (
                    <div className="flex justify-center gap-3 mb-4">
                        <SocialIcons socials={profile.socials} theme={theme} />
                    </div>
                )}

                {/* First 2 Blocks Preview */}
                <div className="space-y-3 opacity-80">
                    {blocks.slice(0, 2).map((block, idx) => (
                        <div key={block.id || idx} className="text-sm">
                            <BlockRenderer
                                type={block.type}
                                props={block.props}
                                theme={theme}
                                header={block.header}
                            />
                        </div>
                    ))}
                </div>

                {/* Show more indicator */}
                {blocks.length > 2 && (
                    <div className="mt-3 text-center">
                        <span className="text-xs text-gray-400">
                            และอีก {blocks.length - 2} บล็อก...
                        </span>
                    </div>
                )}
            </div>

            {/* Hover Overlay with Full Preview Button */}
            <Link
                href={`/examples/preview/${index}`}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
            >
                <div className="text-center text-white">
                    <MdOpenInFull className="w-8 h-8 mx-auto mb-2" />
                    <span className="font-medium">ดูตัวอย่างเต็ม</span>
                </div>
            </Link>
        </div>
    );
}
