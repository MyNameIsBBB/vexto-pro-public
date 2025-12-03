import { MdOpenInFull } from "react-icons/md";
import BlockRenderer from "@/components/BlockRenderer";
import SocialIcons from "@/components/SocialIcons";
import Link from "next/link";

export default function ProfileCard({ profile, profileId }) {
    const scope = profile.theme?.backgroundScope || "card";
    const cardBgStyle =
        scope === "card"
            ? {
                  background: profile.theme?.background,
                  backgroundImage: profile.theme?.backgroundImage
                      ? `url(${profile.theme.backgroundImage})`
                      : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
              }
            : undefined;

    const isFormal =
        profile.theme?.variant === "formal" || profileId === "shop";

    // Map font family for header area to match BlockRenderer
    const fontMap = {
        prompt: "var(--font-prompt)",
        kanit: "var(--font-kanit)",
        sarabun: "var(--font-sarabun)",
    };
    const fontFamily = fontMap[profile.theme?.fontFamily] || fontMap.prompt;

    return (
        <div
            className={
                isFormal
                    ? "relative rounded-lg border border-gray-200 p-8 md:p-10 shadow-sm bg-white"
                    : "relative rounded-3xl border border-white/10 p-8 md:p-10 shadow-2xl backdrop-blur-md bg-white/[0.02] hover:border-white/20 transition-all duration-300"
            }
            style={{ ...cardBgStyle, fontFamily }}
        >
            {/* View Fullscreen Button */}
            <div className="absolute top-4 right-4 z-10">
                <Link
                    href={`/examples/preview/${profileId}`}
                    className={
                        isFormal
                            ? "inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-white border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                            : "inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium transition-all hover:scale-105 backdrop-blur-sm"
                    }
                >
                    <MdOpenInFull className="w-4 h-4" />
                    ดูแบบเต็มจอ
                </Link>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-5 mb-8">
                {profile.avatarUrl ? (
                    <img
                        src={profile.avatarUrl}
                        alt="avatar"
                        className={
                            isFormal
                                ? "w-24 h-24 rounded-md object-cover border border-gray-200 shadow-sm"
                                : "w-24 h-24 rounded-2xl object-cover border-2 border-white/20 shadow-xl"
                        }
                    />
                ) : (
                    <div
                        className={
                            isFormal
                                ? "w-24 h-24 rounded-md bg-gray-100 border border-gray-200"
                                : "w-24 h-24 rounded-2xl bg-white/10 border-2 border-white/20"
                        }
                    />
                )}
                <div className="flex-1">
                    <div
                        className="text-3xl font-bold mb-2"
                        style={{
                            color: isFormal
                                ? profile.theme?.textColor || "#111827"
                                : profile.theme?.accent || "#22d3ee",
                        }}
                    >
                        {profile.displayName}
                    </div>
                    <p
                        className={
                            isFormal
                                ? "text-base text-gray-700 leading-relaxed"
                                : "text-base text-white/80 leading-relaxed"
                        }
                    >
                        {profile.bio}
                    </p>
                </div>
            </div>

            {profile.socials && profile.socials.length > 0 && (
                <div className="mb-8">
                    <SocialIcons
                        socials={profile.socials}
                        theme={profile.theme}
                    />
                </div>
            )}

            <div className="space-y-5">
                <BlockRenderer
                    blocks={profile.blocks || []}
                    theme={profile.theme}
                    separated={true}
                />
            </div>
        </div>
    );
}
