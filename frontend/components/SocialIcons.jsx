import {
    FaInstagram,
    FaTwitter,
    FaYoutube,
    FaTwitch,
    FaDiscord,
    FaFacebook,
    FaLine,
    FaPhone,
    FaTiktok,
    FaLink,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";

export default function SocialIcons({
    items = [],
    theme = {},
    disableLinks = false,
}) {
    const iconFor = (label) => {
        const l = String(label || "").toLowerCase();
        if (l.includes("instagram")) return <FaInstagram className="h-4 w-4" />;
        if (l === "x" || l.includes("x-twitter") || l.includes("twitter-x"))
            return <FaXTwitter className="h-4 w-4" />;
        if (l.includes("twitter")) return <FaTwitter className="h-4 w-4" />;
        if (l.includes("tiktok")) return <FaTiktok className="h-4 w-4" />;
        if (l.includes("youtube")) return <FaYoutube className="h-4 w-4" />;
        if (l.includes("twitch")) return <FaTwitch className="h-4 w-4" />;
        if (l.includes("discord")) return <FaDiscord className="h-4 w-4" />;
        if (l.includes("facebook")) return <FaFacebook className="h-4 w-4" />;
        if (l.includes("line")) return <FaLine className="h-4 w-4" />;
        if (l.includes("phone") || l.includes("tel"))
            return <FaPhone className="h-4 w-4" />;
        // Default to link icon for custom/unknown platforms
        return <FaLink className="h-4 w-4" />;
    };

    const iconColor = theme?.iconColor || theme?.textColor || "#f3f4f6";
    const borderColor = `${iconColor}33`; // 20% opacity

    const isExternal = (u) =>
        /^https?:\/\//i.test(u || "") || /^mailto:|^tel:/i.test(u || "");

    return (
        <div className="flex flex-wrap items-center gap-3">
            {items
                .filter((s) => !!s?.url)
                .map((s, idx) => {
                    const external = isExternal(s.url);
                    const isHash = s.url === "#";

                    if (disableLinks || isHash) {
                        return (
                            <button
                                key={idx}
                                className="inline-flex items-center justify-center h-11 w-11 rounded-full transition-all cursor-default opacity-50"
                                style={{
                                    color: iconColor,
                                    background: "rgba(255, 255, 255, 0.05)",
                                    border: `1px solid ${borderColor}`,
                                }}
                                title={s.label}
                                aria-label={s.label}
                                disabled
                            >
                                {iconFor(s.label)}
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={idx}
                            href={s.url}
                            className="inline-flex items-center justify-center h-11 w-11 rounded-full hover:scale-110 transition-all"
                            style={{
                                color: iconColor,
                                background: "rgba(255, 255, 255, 0.05)",
                                border: `1px solid ${borderColor}`,
                            }}
                            title={s.label}
                            aria-label={s.label}
                            target={external ? "_blank" : undefined}
                            rel={external ? "noopener noreferrer" : undefined}
                        >
                            {iconFor(s.label)}
                        </Link>
                    );
                })}
        </div>
    );
}
