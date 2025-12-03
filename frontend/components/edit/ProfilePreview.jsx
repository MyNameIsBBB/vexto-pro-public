import BlockRenderer from "@/components/BlockRenderer";
import SocialIcons from "@/components/SocialIcons";
import {
    buildBgStyle,
    buildInnerBgStyle,
} from "@/components/editor/background";

export default function ProfilePreview({ profile }) {
    const outerStyle = buildBgStyle(
        profile.theme.outerBackground,
        profile.theme.outerBackgroundImage
    );
    const innerStyle = buildInnerBgStyle(profile.theme);

    return (
        <div
            style={outerStyle}
            className="min-h-screen py-8 px-4 overflow-y-auto"
        >
            <div
                style={innerStyle}
                className="max-w-2xl mx-auto rounded-2xl p-6 shadow-2xl"
            >
                {/* Avatar */}
                <div className="flex flex-col items-center mb-6">
                    <div className={`avatar-frame ${profile.avatarFrame}`}>
                        <img
                            src={profile.avatarUrl || "/images/no-profile.png"}
                            alt={profile.displayName}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h1
                        className="text-3xl font-bold mt-4 text-center"
                        style={{
                            color:
                                profile.theme.textOverrides?.name ||
                                profile.theme.textColor,
                        }}
                    >
                        {profile.displayName}
                    </h1>
                    {profile.bio && (
                        <p
                            className="text-center mt-2 max-w-md"
                            style={{
                                color:
                                    profile.theme.textOverrides?.body ||
                                    profile.theme.textColor,
                            }}
                        >
                            {profile.bio}
                        </p>
                    )}
                </div>

                {/* Social icons */}
                {profile.socials?.length > 0 && (
                    <div className="flex justify-center gap-4 mb-8">
                        <SocialIcons
                            socials={profile.socials}
                            theme={profile.theme}
                        />
                    </div>
                )}

                {/* Blocks */}
                <div className="space-y-4">
                    {profile.blocks?.map((block, idx) => (
                        <BlockRenderer
                            key={block.id || idx}
                            type={block.type}
                            props={block.props}
                            theme={profile.theme}
                            header={block.header}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
