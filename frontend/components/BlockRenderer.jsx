import SocialIcons from "@/components/SocialIcons";
import Link from "next/link";

export default function BlockRenderer({
    blocks = [],
    theme,
    containerClassName,
}) {
    // Helpers
    const readableText = (bg) => {
        const hex = String(bg || "").replace("#", "");
        if (hex.length !== 6) return "#ffffff";
        const r = parseInt(hex.slice(0, 2), 16) / 255;
        const g = parseInt(hex.slice(2, 4), 16) / 255;
        const b = parseInt(hex.slice(4, 6), 16) / 255;
        const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return lum > 0.5 ? "#111827" : "#ffffff";
    };
    const getTxt = (key, fallback) =>
        (theme?.textOverrides && theme.textOverrides[key]) || fallback;

    // Theme tokens
    const radiusMap = { sharp: "0px", modern: "8px", rounded: "16px" };
    const br = radiusMap[theme?.borderRadius] || theme?.borderRadius || "8px";
    const fontMap = {
        prompt: "var(--font-prompt)",
        kanit: "var(--font-kanit)",
        sarabun: "var(--font-sarabun)",
    };
    const fontFamily = fontMap[theme?.fontFamily] || fontMap.prompt;
    const textColor = theme?.textColor || "#f3f4f6";
    const subtleBorder = `${textColor}33`;
    const el = theme?.elementColors || {};
    const blockBg = el.blockBg || "rgba(255, 255, 255, 0.05)";
    const blockBorder = el.blockBorder || subtleBorder;
    const dividerColor = el.divider || `${theme?.textColor || "#94a3b8"}33`;
    const quoteAccent = el.quoteAccent || theme?.accent || "#22d3ee";
    const buttonBg = el.buttonBg || theme?.primary || "#7c3aed";

    // Group consecutive link/button blocks
    const groupedBlocks = [];
    let currentGroup = [];
    blocks.forEach((b, idx) => {
        const t = b.type;
        if (t === "link" || t === "button") {
            currentGroup.push(b);
            const nextType = blocks[idx + 1]?.type;
            if (!nextType || (nextType !== "link" && nextType !== "button")) {
                if (currentGroup.length > 1)
                    groupedBlocks.push({
                        type: "button-group",
                        items: [...currentGroup],
                    });
                else groupedBlocks.push(currentGroup[0]);
                currentGroup = [];
            }
        } else {
            groupedBlocks.push(b);
        }
    });

    return (
        <div className={containerClassName} style={{ fontFamily }}>
            {groupedBlocks.map((b, idx) => {
                // Button groups
                if (b.type === "button-group") {
                    return (
                        <div
                            key={`group-${idx}`}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 mb-3"
                        >
                            {b.items.map((item) => {
                                const size = item.props?.size || "default";
                                const sizeClasses = {
                                    small: "p-2.5 text-sm",
                                    default: "p-3 text-base",
                                    large: "p-3.5 text-base",
                                };
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.props?.url || "#"}
                                        className={`block text-center rounded-lg font-medium transition-colors hover:opacity-90 ${
                                            sizeClasses[size] ||
                                            sizeClasses.default
                                        }`}
                                        style={{
                                            background: buttonBg,
                                            color:
                                                getTxt("buttonLabel") ||
                                                readableText(buttonBg),
                                            borderRadius: br,
                                        }}
                                    >
                                        {item.props?.label || item.props?.url}
                                    </Link>
                                );
                            })}
                        </div>
                    );
                }

                // Header
                if (b.type === "header") {
                    const size = b.props?.size || "default";
                    const sizeClasses = {
                        small: "text-lg font-semibold mb-2",
                        default: "text-2xl font-bold mb-3",
                        large: "text-3xl font-bold mb-4",
                    };
                    const headerColor = getTxt(
                        "header",
                        theme?.accent || theme?.textColor || "#f3f4f6"
                    );
                    return (
                        <h2
                            key={b.id}
                            className={sizeClasses[size] || sizeClasses.default}
                            style={{ color: headerColor }}
                        >
                            {b.props?.title || "หัวข้อ"}
                        </h2>
                    );
                }

                // Text
                if (b.type === "text") {
                    const c = getTxt("body", theme?.textColor || "#f3f4f6");
                    return (
                        <div
                            key={b.id}
                            className="p-4 rounded-xl"
                            style={{
                                borderRadius: br,
                                background: blockBg,
                                border: `1px solid ${blockBorder}`,
                            }}
                        >
                            <p className="leading-relaxed" style={{ color: c }}>
                                {b.props?.text}
                            </p>
                        </div>
                    );
                }

                // Single link/button
                if (b.type === "link" || b.type === "button") {
                    const size = b.props?.size || "default";
                    const sizeClasses = {
                        small: "p-2.5 text-sm",
                        default: "p-3 text-base",
                        large: "p-3.5 text-base",
                    };
                    return (
                        <Link
                            key={b.id}
                            href={b.props?.url || "#"}
                            className={`block text-center rounded-lg font-medium transition-colors hover:opacity-90 ${
                                sizeClasses[size] || sizeClasses.default
                            }`}
                            style={{
                                background: buttonBg,
                                color:
                                    getTxt("buttonLabel") ||
                                    readableText(buttonBg),
                                borderRadius: br,
                            }}
                        >
                            {b.props?.label || b.props?.url}
                        </Link>
                    );
                }

                // Image
                if (b.type === "image") {
                    return (
                        <div
                            key={b.id}
                            className="overflow-hidden rounded-xl2"
                            style={{
                                borderRadius: br,
                                border: `1px solid ${blockBorder}`,
                            }}
                        >
                            {b.props?.url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={b.props.url}
                                    alt=""
                                    className="w-full h-auto"
                                />
                            ) : (
                                <div
                                    className="p-6 text-center text-sm"
                                    style={{ color: textColor, opacity: 0.6 }}
                                >
                                    ยังไม่ได้ใส่รูป
                                </div>
                            )}
                        </div>
                    );
                }

                // Video (YouTube)
                if (b.type === "video") {
                    const url = b.props?.url || "";
                    return (
                        <div
                            key={b.id}
                            className="aspect-video rounded-xl2 overflow-hidden"
                            style={{
                                borderRadius: br,
                                border: `1px solid ${blockBorder}`,
                                background: "rgba(0,0,0,0.4)",
                            }}
                        >
                            {url ? (
                                <iframe
                                    className="w-full h-full"
                                    src={url.replace("watch?v=", "embed/")}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div
                                    className="p-6 text-center text-sm"
                                    style={{ color: textColor, opacity: 0.6 }}
                                >
                                    ยังไม่ได้ใส่วิดีโอ
                                </div>
                            )}
                        </div>
                    );
                }

                // Divider
                if (b.type === "divider") {
                    return (
                        <hr
                            key={b.id}
                            className="my-4"
                            style={{ borderColor: dividerColor }}
                        />
                    );
                }

                // Socials block
                if (b.type === "socials") {
                    return (
                        <div key={b.id}>
                            <SocialIcons
                                items={b.props?.items || []}
                                theme={theme}
                            />
                        </div>
                    );
                }

                // Quote
                if (b.type === "quote") {
                    const c = getTxt("body", theme?.textColor || "#f3f4f6");
                    const muted = getTxt("muted", c);
                    return (
                        <div
                            key={b.id}
                            className="p-5 rounded-xl border-l-4"
                            style={{
                                borderRadius: br,
                                background: blockBg,
                                borderLeftColor: quoteAccent,
                                borderTop: `1px solid ${blockBorder}`,
                                borderRight: `1px solid ${blockBorder}`,
                                borderBottom: `1px solid ${blockBorder}`,
                            }}
                        >
                            <p
                                className="italic text-lg leading-relaxed"
                                style={{ color: c, opacity: 0.9 }}
                            >
                                "{b.props?.text || "คำคมโดน ๆ"}"
                            </p>
                            {b.props?.author && (
                                <div
                                    className="mt-3 text-right text-sm font-medium"
                                    style={{ color: muted, opacity: 0.7 }}
                                >
                                    — {b.props.author}
                                </div>
                            )}
                        </div>
                    );
                }

                // Gallery
                if (b.type === "gallery") {
                    const images = b.props?.images || [];
                    return (
                        <div
                            key={b.id}
                            className="grid grid-cols-2 sm:grid-cols-3 gap-2"
                        >
                            {images.length === 0 && (
                                <div
                                    className="col-span-full text-center text-sm rounded-xl2 p-4"
                                    style={{
                                        border: `1px solid ${blockBorder}`,
                                        color: textColor,
                                        opacity: 0.6,
                                    }}
                                >
                                    ยังไม่มีรูปในแกลเลอรี
                                </div>
                            )}
                            {images.map((url, i) => (
                                <div
                                    key={i}
                                    className="overflow-hidden rounded-xl2"
                                    style={{
                                        borderRadius: br,
                                        border: `1px solid ${blockBorder}`,
                                    }}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={url}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    );
                }

                // Hours
                if (b.type === "hours") {
                    const body = getTxt("body", theme?.textColor || "#f3f4f6");
                    const header = getTxt("header", theme?.accent || body);
                    const muted = getTxt("muted", body);
                    const items = b.props?.items || [
                        { day: "จันทร์-ศุกร์", time: "10:00 - 20:00" },
                        { day: "เสาร์-อาทิตย์", time: "10:00 - 18:00" },
                    ];
                    return (
                        <div
                            key={b.id}
                            className="rounded-xl2 p-4"
                            style={{
                                borderRadius: br,
                                background: blockBg,
                                border: `1px solid ${blockBorder}`,
                            }}
                        >
                            <div
                                className="divide-y"
                                style={{ borderColor: dividerColor }}
                            >
                                {items.map((h, i) => (
                                    <div
                                        key={i}
                                        className="py-2 flex items-center justify-between gap-3"
                                    >
                                        <div
                                            className="font-medium"
                                            style={{ color: header }}
                                        >
                                            {h.day}
                                        </div>
                                        <div
                                            className="text-sm"
                                            style={{
                                                color: muted,
                                                opacity: 0.9,
                                            }}
                                        >
                                            {h.time}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {b.props?.note && (
                                <div
                                    className="mt-3 text-xs"
                                    style={{ color: muted, opacity: 0.8 }}
                                >
                                    {b.props.note}
                                </div>
                            )}
                        </div>
                    );
                }

                // Services
                if (b.type === "services") {
                    const body = getTxt("body", theme?.textColor || "#f3f4f6");
                    const header = getTxt("header", theme?.accent || body);
                    const muted = getTxt("muted", body);
                    const items = b.props?.items || [
                        { name: "นวดแผนไทย", desc: "60 นาที", price: "฿350" },
                        { name: "นวดน้ำมัน", desc: "90 นาที", price: "฿690" },
                        { name: "สปาเท้า", desc: "45 นาที", price: "฿250" },
                    ];
                    return (
                        <div key={b.id} className="space-y-2">
                            {items.map((sv, i) => (
                                <div
                                    key={i}
                                    className="rounded-xl2 p-4"
                                    style={{
                                        borderRadius: br,
                                        background: blockBg,
                                        border: `1px solid ${blockBorder}`,
                                    }}
                                >
                                    <div className="flex items-baseline justify-between gap-3">
                                        <div>
                                            <div
                                                className="font-semibold"
                                                style={{ color: header }}
                                            >
                                                {sv.name}
                                            </div>
                                            {sv.desc && (
                                                <div
                                                    className="text-sm mt-0.5"
                                                    style={{
                                                        color: muted,
                                                        opacity: 0.9,
                                                    }}
                                                >
                                                    {sv.desc}
                                                </div>
                                            )}
                                        </div>
                                        {sv.price && (
                                            <div
                                                className="text-sm font-medium px-2 py-1 rounded-md"
                                                style={{
                                                    color: body,
                                                    border: `1px solid ${blockBorder}`,
                                                }}
                                            >
                                                {sv.price}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                }

                // Pricing
                if (b.type === "pricing") {
                    const body = getTxt("body", theme?.textColor || "#f3f4f6");
                    const header = getTxt("header", theme?.accent || body);
                    const muted = getTxt("muted", body);
                    const plans = b.props?.items || [
                        {
                            title: "Basic",
                            price: "฿399",
                            features: ["บริการพื้นฐาน", "45 นาที"],
                        },
                        {
                            title: "Pro",
                            price: "฿699",
                            features: ["บริการครบ", "90 นาที"],
                        },
                        {
                            title: "VIP",
                            price: "฿999",
                            features: ["สปาพิเศษ", "120 นาที"],
                        },
                    ];
                    return (
                        <div
                            key={b.id}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                        >
                            {plans.map((p, i) => (
                                <div
                                    key={i}
                                    className="rounded-xl2 p-4"
                                    style={{
                                        borderRadius: br,
                                        background: blockBg,
                                        border: `1px solid ${blockBorder}`,
                                    }}
                                >
                                    <div
                                        className="text-lg font-bold"
                                        style={{ color: header }}
                                    >
                                        {p.title}
                                    </div>
                                    <div
                                        className="mt-1 text-2xl font-extrabold"
                                        style={{ color: header }}
                                    >
                                        {p.price}
                                    </div>
                                    {Array.isArray(p.features) &&
                                        p.features.length > 0 && (
                                            <ul className="mt-3 space-y-1">
                                                {p.features.map((f, j) => (
                                                    <li
                                                        key={j}
                                                        className="text-sm flex items-start gap-2"
                                                        style={{
                                                            color: muted,
                                                            opacity: 0.9,
                                                        }}
                                                    >
                                                        <span>•</span>
                                                        <span>{f}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                </div>
                            ))}
                        </div>
                    );
                }

                // Products
                if (b.type === "products") {
                    const body = getTxt("body", theme?.textColor || "#f3f4f6");
                    const header = getTxt("header", theme?.accent || body);
                    const muted = getTxt("muted", body);
                    const items = b.props?.items || [
                        {
                            name: "บาล์มนวดสมุนไพร",
                            price: "฿159",
                            desc: "บรรเทาปวดเมื่อย หอมผ่อนคลาย",
                            image: "https://images.unsplash.com/photo-1505575972945-290c4f58a4a6?w=600&auto=format&fit=crop",
                            url: "#",
                        },
                        {
                            name: "น้ำมันนวดอโรมา",
                            price: "฿299",
                            desc: "กลิ่นลาเวนเดอร์ออร์แกนิก",
                            image: "https://images.unsplash.com/photo-1511824409381-71f860bceeeb?w=600&auto=format&fit=crop",
                            url: "#",
                        },
                    ];

                    const variant = b.props?.variant || b.props?.style;
                    if (variant === "image-grid" || b.props?.imagesOnly) {
                        return (
                            <div
                                key={b.id}
                                className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                            >
                                {items.map((p, i) => {
                                    const Img = (
                                        <div
                                            className="rounded-xl2 overflow-hidden"
                                            style={{
                                                borderRadius: br,
                                                border: `1px solid ${blockBorder}`,
                                            }}
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={p.image}
                                                alt={p.name || ""}
                                                className="w-full h-full object-cover aspect-[16/9]"
                                            />
                                        </div>
                                    );
                                    return p.url ? (
                                        <Link
                                            key={i}
                                            href={p.url}
                                            className="block hover:opacity-90 transition-opacity"
                                            aria-label={p.name || undefined}
                                        >
                                            {Img}
                                        </Link>
                                    ) : (
                                        <div key={i}>{Img}</div>
                                    );
                                })}
                            </div>
                        );
                    }

                    return (
                        <div
                            key={b.id}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                        >
                            {items.map((p, i) => (
                                <div
                                    key={i}
                                    className="rounded-xl2 overflow-hidden"
                                    style={{
                                        borderRadius: br,
                                        background: blockBg,
                                        border: `1px solid ${blockBorder}`,
                                    }}
                                >
                                    {p.image && (
                                        <div
                                            className="aspect-[16/9] w-full overflow-hidden"
                                            style={{
                                                borderBottom: `1px solid ${blockBorder}`,
                                            }}
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={p.image}
                                                alt={p.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div
                                                    className="font-semibold"
                                                    style={{ color: header }}
                                                >
                                                    {p.name}
                                                </div>
                                                {p.desc && (
                                                    <div
                                                        className="text-sm mt-0.5"
                                                        style={{
                                                            color: muted,
                                                            opacity: 0.9,
                                                        }}
                                                    >
                                                        {p.desc}
                                                    </div>
                                                )}
                                            </div>
                                            {p.price && (
                                                <div
                                                    className="text-sm font-medium px-2 py-1 rounded-md whitespace-nowrap"
                                                    style={{
                                                        color: body,
                                                        border: `1px solid ${blockBorder}`,
                                                    }}
                                                >
                                                    {p.price}
                                                </div>
                                            )}
                                        </div>
                                        {p.url && (
                                            <Link
                                                href={p.url}
                                                className="inline-block mt-3 px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                                                style={{
                                                    background: buttonBg,
                                                    color:
                                                        getTxt("buttonLabel") ||
                                                        readableText(buttonBg),
                                                    borderRadius: br,
                                                }}
                                            >
                                                ดูรายละเอียด
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                }

                // Contact info
                if (b.type === "contact-info") {
                    const body = getTxt("body", theme?.textColor || "#f3f4f6");
                    const linkC = getTxt("link", theme?.accent || body);
                    const muted = getTxt("muted", body);
                    const info = b.props || {};
                    return (
                        <div
                            key={b.id}
                            className="rounded-xl2 p-4 my-3 space-y-3"
                            style={{
                                borderRadius: br,
                                background: blockBg,
                                border: `1px solid ${blockBorder}`,
                            }}
                        >
                            {info.phone && (
                                <div
                                    className="text-sm"
                                    style={{ color: body }}
                                >
                                    📞{" "}
                                    <Link
                                        href={`tel:${info.phone}`}
                                        style={{ color: linkC }}
                                    >
                                        {info.phone}
                                    </Link>
                                </div>
                            )}
                            {info.line && (
                                <div
                                    className="text-sm"
                                    style={{ color: body }}
                                >
                                    🟢 LINE:{" "}
                                    <Link
                                        href={info.line}
                                        style={{ color: linkC }}
                                    >
                                        {info.line}
                                    </Link>
                                </div>
                            )}
                            {info.website && (
                                <div
                                    className="text-sm"
                                    style={{ color: body }}
                                >
                                    🌐{" "}
                                    <Link
                                        href={info.website}
                                        style={{ color: linkC }}
                                    >
                                        {info.website}
                                    </Link>
                                </div>
                            )}
                            {info.note && (
                                <div
                                    className="text-xs"
                                    style={{ color: muted, opacity: 0.8 }}
                                >
                                    {info.note}
                                </div>
                            )}
                        </div>
                    );
                }

                // Location
                if (b.type === "location") {
                    const body = getTxt("body", theme?.textColor || "#f3f4f6");
                    const muted = getTxt("muted", body);
                    const addr = b.props?.address || "ยังไม่ได้ใส่ที่อยู่";
                    const mapUrl = b.props?.mapUrl;
                    return (
                        <div
                            key={b.id}
                            className="rounded-xl2 p-4 my-3"
                            style={{
                                borderRadius: br,
                                background: blockBg,
                                border: `1px solid ${blockBorder}`,
                            }}
                        >
                            <div className="space-y-3">
                                <div
                                    className="text-sm whitespace-pre-line"
                                    style={{ color: body, opacity: 0.9 }}
                                >
                                    {addr}
                                </div>
                                {mapUrl && (
                                    <Link
                                        href={mapUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-block px-4 py-2 rounded-lg text-sm font-medium"
                                        style={{
                                            background: buttonBg,
                                            color:
                                                getTxt("buttonLabel") ||
                                                readableText(buttonBg),
                                            borderRadius: br,
                                        }}
                                    >
                                        ดูแผนที่
                                    </Link>
                                )}
                                {b.props?.note && (
                                    <div
                                        className="text-xs"
                                        style={{ color: muted, opacity: 0.8 }}
                                    >
                                        {b.props.note}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                }

                // Contact + Location (Combined)
                if (b.type === "contact-location") {
                    const body = getTxt("body", theme?.textColor || "#f3f4f6");
                    const linkC = getTxt("link", theme?.accent || body);
                    const header = getTxt("header", theme?.accent || body);
                    const muted = getTxt("muted", body);
                    const info = b.props || {};

                    const hasContact =
                        info.phone || info.email || info.line || info.website;
                    const hasLocation = info.address || info.mapUrl;

                    return (
                        <div
                            key={b.id}
                            className="rounded-xl2 p-6 my-3"
                            style={{
                                borderRadius: br,
                                background: blockBg,
                                border: `1px solid ${blockBorder}`,
                            }}
                        >
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Contact Section */}
                                {hasContact && (
                                    <div className="space-y-3">
                                        <div
                                            className="text-base font-semibold mb-4 pb-2 border-b"
                                            style={{
                                                color: header,
                                                borderColor: `${header}30`,
                                            }}
                                        >
                                            📞 ติดต่อเรา
                                        </div>
                                        {info.phone && (
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                                                    style={{
                                                        background: `${header}20`,
                                                        color: header,
                                                    }}
                                                >
                                                    📞
                                                </div>
                                                <div className="flex-1">
                                                    <div
                                                        className="text-xs opacity-70"
                                                        style={{ color: muted }}
                                                    >
                                                        โทรศัพท์
                                                    </div>
                                                    <Link
                                                        href={`tel:${info.phone}`}
                                                        className="text-sm font-medium hover:underline"
                                                        style={{ color: linkC }}
                                                    >
                                                        {info.phone}
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                        {info.email && (
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                                                    style={{
                                                        background: `${header}20`,
                                                        color: header,
                                                    }}
                                                >
                                                    📧
                                                </div>
                                                <div className="flex-1">
                                                    <div
                                                        className="text-xs opacity-70"
                                                        style={{ color: muted }}
                                                    >
                                                        อีเมล
                                                    </div>
                                                    <Link
                                                        href={`mailto:${info.email}`}
                                                        className="text-sm font-medium hover:underline break-all"
                                                        style={{ color: linkC }}
                                                    >
                                                        {info.email}
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                        {info.line && (
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                                                    style={{
                                                        background: `${header}20`,
                                                        color: header,
                                                    }}
                                                >
                                                    💬
                                                </div>
                                                <div className="flex-1">
                                                    <div
                                                        className="text-xs opacity-70"
                                                        style={{ color: muted }}
                                                    >
                                                        LINE
                                                    </div>
                                                    <Link
                                                        href={info.line}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-sm font-medium hover:underline"
                                                        style={{ color: linkC }}
                                                    >
                                                        เพิ่มเพื่อน
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                        {info.website && (
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                                                    style={{
                                                        background: `${header}20`,
                                                        color: header,
                                                    }}
                                                >
                                                    🌐
                                                </div>
                                                <div className="flex-1">
                                                    <div
                                                        className="text-xs opacity-70"
                                                        style={{ color: muted }}
                                                    >
                                                        เว็บไซต์
                                                    </div>
                                                    <Link
                                                        href={info.website}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-sm font-medium hover:underline break-all"
                                                        style={{ color: linkC }}
                                                    >
                                                        {info.website.replace(
                                                            /^https?:\/\//,
                                                            ""
                                                        )}
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Location Section */}
                                {hasLocation && (
                                    <div className="space-y-3">
                                        <div
                                            className="text-base font-semibold mb-4 pb-2 border-b"
                                            style={{
                                                color: header,
                                                borderColor: `${header}30`,
                                            }}
                                        >
                                            📍 ที่ตั้ง
                                        </div>
                                        {info.address && (
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                                                    style={{
                                                        background: `${header}20`,
                                                        color: header,
                                                    }}
                                                >
                                                    📍
                                                </div>
                                                <div className="flex-1">
                                                    <div
                                                        className="text-xs opacity-70 mb-1"
                                                        style={{ color: muted }}
                                                    >
                                                        ที่อยู่
                                                    </div>
                                                    <div
                                                        className="text-sm leading-relaxed whitespace-pre-line"
                                                        style={{
                                                            color: body,
                                                            opacity: 0.9,
                                                        }}
                                                    >
                                                        {info.address}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {info.mapUrl && (
                                            <Link
                                                href={info.mapUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105"
                                                style={{
                                                    background: buttonBg,
                                                    color:
                                                        getTxt("buttonLabel") ||
                                                        readableText(buttonBg),
                                                    borderRadius: br,
                                                    boxShadow:
                                                        "0 2px 8px rgba(0,0,0,0.1)",
                                                }}
                                            >
                                                🗺️ ดูแผนที่
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Note */}
                            {info.note && (
                                <div
                                    className="mt-6 pt-4 border-t text-sm"
                                    style={{
                                        color: muted,
                                        opacity: 0.8,
                                        borderColor: `${muted}20`,
                                    }}
                                >
                                    💡 {info.note}
                                </div>
                            )}
                        </div>
                    );
                }

                // Stats
                if (b.type === "stats") {
                    const body = getTxt("body", theme?.textColor || "#f3f4f6");
                    const header = getTxt("header", theme?.accent || body);
                    const muted = getTxt("muted", body);
                    const items = b.props?.items || [
                        { label: "สถิติ", value: "--", sub: "รายละเอียด" },
                    ];
                    return (
                        <div key={b.id} className="grid gap-2 sm:grid-cols-3">
                            {items.map((s, i) => (
                                <div
                                    key={i}
                                    className="rounded-xl2 p-4"
                                    style={{
                                        borderRadius: br,
                                        background: blockBg,
                                        border: `1px solid ${blockBorder}`,
                                    }}
                                >
                                    <div
                                        className="text-xs uppercase tracking-wide"
                                        style={{ color: muted, opacity: 0.8 }}
                                    >
                                        {s.label}
                                    </div>
                                    <div
                                        className="mt-1 text-2xl font-extrabold"
                                        style={{ color: header }}
                                    >
                                        {s.value}
                                    </div>
                                    {s.sub && (
                                        <div
                                            className="text-xs"
                                            style={{
                                                color: muted,
                                                opacity: 0.8,
                                            }}
                                        >
                                            {s.sub}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    );
                }

                // FAQ
                if (b.type === "faq") {
                    const body = getTxt("body", theme?.textColor || "#f3f4f6");
                    const header = getTxt("header", theme?.accent || body);
                    const muted = getTxt("muted", body);
                    const items = b.props?.items || [
                        { q: "ถามอะไรได้บ้าง?", a: "เพิ่มคำถามคำตอบได้เอง" },
                    ];
                    return (
                        <div key={b.id} className="space-y-2">
                            {items.map((it, i) => (
                                <div
                                    key={i}
                                    className="rounded-xl p-3"
                                    style={{
                                        borderRadius: br,
                                        background: blockBg,
                                        border: `1px solid ${blockBorder}`,
                                    }}
                                >
                                    <div
                                        className="font-semibold"
                                        style={{ color: header }}
                                    >
                                        {it.q}
                                    </div>
                                    <div
                                        className="text-sm mt-1"
                                        style={{ color: muted, opacity: 0.9 }}
                                    >
                                        {it.a}
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                }

                // Profile (details)
                if (b.type === "profile") {
                    const body = getTxt("body", theme?.textColor || "#f3f4f6");
                    const nameC = getTxt("name", body);
                    const roleC = getTxt("role", theme?.accent || "#22d3ee");
                    const linkC = getTxt("link", theme?.accent || body);
                    return (
                        <div
                            key={b.id}
                            className="rounded-2xl p-6"
                            style={{
                                borderRadius: br,
                                background: blockBg,
                                border: `1px solid ${blockBorder}`,
                            }}
                        >
                            <div className="space-y-3">
                                <div
                                    className="text-xl font-bold"
                                    style={{ color: nameC }}
                                >
                                    {b.props?.name || "ชื่อของคุณ"}
                                </div>
                                <div
                                    className="text-sm font-medium"
                                    style={{ color: roleC }}
                                >
                                    {b.props?.role || "ตำแหน่ง/อาชีพ"}
                                </div>
                                {b.props?.location && (
                                    <div
                                        className="flex items-center gap-2 text-sm"
                                        style={{ color: body, opacity: 0.7 }}
                                    >
                                        <span>📍</span>
                                        <span>{b.props.location}</span>
                                    </div>
                                )}
                                {b.props?.email && (
                                    <div
                                        className="flex items-center gap-2 text-sm"
                                        style={{ color: body, opacity: 0.7 }}
                                    >
                                        <span>✉️</span>
                                        <Link
                                            href={`mailto:${b.props.email}`}
                                            className="hover:opacity-100 transition-opacity"
                                            style={{ color: linkC }}
                                        >
                                            {b.props.email}
                                        </Link>
                                    </div>
                                )}
                                {b.props?.bio && (
                                    <p
                                        className="text-sm leading-relaxed pt-2"
                                        style={{
                                            color: body,
                                            opacity: 0.8,
                                            borderTop: `1px solid ${blockBorder}`,
                                            paddingTop: "0.5rem",
                                        }}
                                    >
                                        {b.props.bio}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                }

                // Experience timeline (segmented line between dots)
                if (b.type === "experience") {
                    const body = getTxt("body", theme?.textColor || "#f3f4f6");
                    const header = getTxt("header", theme?.accent || body);
                    const muted = getTxt("muted", body);
                    const items = b.props?.items || [];
                    const accent = theme?.accent || "#22d3ee";

                    // Layout constants
                    const lineWidth = 3;
                    const dotSize = 12;
                    const cardLeft = 64; // left padding to card
                    const lineX = 28; // line center x from container left
                    const gap = 16; // equals space-y-4
                    const halfGap = gap / 2;

                    return (
                        <div key={b.id}>
                            <div className="space-y-4">
                                {items.map((exp, i) => {
                                    const isFirst = i === 0;
                                    const isLast = i === items.length - 1;
                                    const connectorLeft = lineX + dotSize / 2;
                                    const connectorWidth = Math.max(
                                        cardLeft - connectorLeft,
                                        0
                                    );
                                    return (
                                        <div
                                            key={i}
                                            className="relative"
                                            style={{
                                                paddingLeft: `${cardLeft}px`,
                                            }}
                                        >
                                            {/* top segment */}
                                            {!isFirst && (
                                                <div
                                                    className="absolute"
                                                    style={{
                                                        left: `${
                                                            lineX -
                                                            lineWidth / 2
                                                        }px`,
                                                        top: `-${halfGap}px`,
                                                        width: `${lineWidth}px`,
                                                        height: `calc(50% + ${halfGap}px)`,
                                                        background: accent,
                                                    }}
                                                />
                                            )}
                                            {/* dot */}
                                            <div
                                                className="absolute top-1/2 -translate-y-1/2 rounded-full"
                                                style={{
                                                    left: `${
                                                        lineX - dotSize / 2
                                                    }px`,
                                                    width: `${dotSize}px`,
                                                    height: `${dotSize}px`,
                                                    background:
                                                        theme?.background ||
                                                        "#0b1020",
                                                    border: `${Math.max(
                                                        2,
                                                        lineWidth - 1
                                                    )}px solid ${accent}`,
                                                    boxShadow:
                                                        "0 0 0 3px rgba(0,0,0,0.25)",
                                                }}
                                            />
                                            {/* bottom segment */}
                                            {!isLast && (
                                                <div
                                                    className="absolute"
                                                    style={{
                                                        left: `${
                                                            lineX -
                                                            lineWidth / 2
                                                        }px`,
                                                        top: `50%`,
                                                        width: `${lineWidth}px`,
                                                        height: `calc(50% + ${halfGap}px)`,
                                                        background: accent,
                                                    }}
                                                />
                                            )}
                                            {/* horizontal connector */}
                                            <div
                                                className="rounded-xl p-4"
                                                style={{
                                                    borderRadius: br,
                                                    background: blockBg,
                                                    border: `1px solid ${blockBorder}`,
                                                }}
                                            >
                                                <div
                                                    className="font-semibold"
                                                    style={{ color: header }}
                                                >
                                                    {exp.title}
                                                </div>
                                                {exp.period && (
                                                    <div
                                                        className="text-xs mt-1"
                                                        style={{
                                                            color: muted,
                                                            opacity: 0.8,
                                                        }}
                                                    >
                                                        {exp.period}
                                                    </div>
                                                )}
                                                {exp.description && (
                                                    <p
                                                        className="text-sm mt-2"
                                                        style={{
                                                            color: body,
                                                            opacity: 0.85,
                                                        }}
                                                    >
                                                        {exp.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                }

                // Skills
                if (b.type === "skills") {
                    const body = getTxt("body", theme?.textColor || "#f3f4f6");
                    const header = getTxt("header", theme?.accent || body);
                    const items = b.props?.items || [];
                    return (
                        <div key={b.id} className="space-y-4">
                            {items.map((cat, i) => (
                                <div key={i}>
                                    <div
                                        className="text-sm font-semibold mb-2"
                                        style={{ color: header, opacity: 0.95 }}
                                    >
                                        {cat.category}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {cat.skills?.map((skill, j) => (
                                            <span
                                                key={j}
                                                className="px-3 py-1 rounded-lg text-sm transition-colors"
                                                style={{
                                                    color: body,
                                                    opacity: 0.9,
                                                    border: `1px solid ${blockBorder}`,
                                                    background: blockBg,
                                                }}
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                }

                // Support/CTA
                if (b.type === "support") {
                    const c = getTxt("body", theme?.textColor || "#f3f4f6");
                    const header = getTxt("header", c);
                    const btnLabel = getTxt("buttonLabel");
                    return (
                        <div
                            key={b.id}
                            className="rounded-2xl border-2 p-6 text-center"
                            style={{
                                borderColor: theme?.accent || "#22d3ee",
                                background: `linear-gradient(135deg, ${
                                    theme?.primary || "#7c3aed"
                                }15, ${theme?.accent || "#22d3ee"}15)`,
                                borderRadius: br,
                            }}
                        >
                            <div
                                className="text-2xl font-bold mb-2"
                                style={{ color: header }}
                            >
                                {b.props?.title || "☕ สนับสนุนเรา"}
                            </div>
                            <p
                                className="text-sm mb-4 max-w-md mx-auto"
                                style={{ color: c, opacity: 0.8 }}
                            >
                                {b.props?.description ||
                                    "ทุกการสนับสนุนคือกำลังใจในการสร้างสรรค์ผลงาน"}
                            </p>
                            <Link
                                href={b.props?.url || "#"}
                                className="inline-block px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform"
                                style={{
                                    background: theme?.primary || "#7c3aed",
                                    color:
                                        btnLabel ||
                                        readableText(
                                            theme?.primary || "#7c3aed"
                                        ),
                                }}
                            >
                                {b.props?.buttonLabel || "ซื้อกาแฟให้เรา"}
                            </Link>
                        </div>
                    );
                }

                // YouTube/TikTok embed
                if (b.type === "youtube" || b.type === "tiktok") {
                    const url = b.props?.url || "";
                    let embedUrl = "";
                    if (b.type === "youtube" && url) {
                        if (url.includes("youtube.com/watch?v=")) {
                            embedUrl = url.replace("watch?v=", "embed/");
                        } else if (url.includes("youtu.be/")) {
                            embedUrl = url.replace(
                                "youtu.be/",
                                "youtube.com/embed/"
                            );
                        } else if (url.includes("youtube.com/embed/")) {
                            embedUrl = url;
                        }
                    } else if (b.type === "tiktok" && url) {
                        // TikTok embed: extract video ID and use oembed or iframe
                        const match = url.match(
                            /tiktok\.com\/@[\w.-]+\/video\/(\d+)/
                        );
                        if (match) {
                            embedUrl = `https://www.tiktok.com/embed/v2/${match[1]}`;
                        }
                    }
                    return (
                        <div
                            key={b.id}
                            className="aspect-video rounded-xl2 overflow-hidden"
                            style={{
                                borderRadius: br,
                                border: `1px solid ${blockBorder}`,
                                background: "rgba(0,0,0,0.4)",
                            }}
                        >
                            {embedUrl ? (
                                <iframe
                                    className="w-full h-full"
                                    src={embedUrl}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div
                                    className="p-6 text-center text-sm flex items-center justify-center h-full"
                                    style={{ color: textColor, opacity: 0.6 }}
                                >
                                    ยังไม่ได้ใส่ลิงก์วิดีโอ
                                </div>
                            )}
                        </div>
                    );
                }

                // Spotify Playlist
                if (b.type === "spotify") {
                    const url = b.props?.url || "";
                    let embedUrl = "";
                    if (url.includes("spotify.com/")) {
                        // Convert spotify links to embed format
                        const match = url.match(
                            /spotify\.com\/(playlist|track|album)\/([a-zA-Z0-9]+)/
                        );
                        if (match) {
                            embedUrl = `https://open.spotify.com/embed/${match[1]}/${match[2]}`;
                        }
                    }
                    return (
                        <div
                            key={b.id}
                            className="rounded-xl2 overflow-hidden"
                            style={{
                                borderRadius: br,
                                border: `1px solid ${blockBorder}`,
                                height: b.props?.height || "380px",
                            }}
                        >
                            {embedUrl ? (
                                <iframe
                                    className="w-full h-full"
                                    src={embedUrl}
                                    allow="encrypted-media"
                                    allowFullScreen={false}
                                />
                            ) : (
                                <div
                                    className="p-6 text-center text-sm flex items-center justify-center h-full"
                                    style={{ color: textColor, opacity: 0.6 }}
                                >
                                    ยังไม่ได้ใส่ลิงก์ Spotify
                                </div>
                            )}
                        </div>
                    );
                }

                // Countdown timer
                if (b.type === "countdown") {
                    const body = getTxt("body", theme?.textColor || "#f3f4f6");
                    const header = getTxt("header", theme?.accent || body);
                    const targetDate =
                        b.props?.targetDate ||
                        new Date(Date.now() + 86400000).toISOString();
                    const description = b.props?.description || "";

                    // Simple countdown display (client will handle live updates)
                    const now = new Date().getTime();
                    const target = new Date(targetDate).getTime();
                    const diff = Math.max(0, target - now);
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor(
                        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                    );
                    const minutes = Math.floor(
                        (diff % (1000 * 60 * 60)) / (1000 * 60)
                    );
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                    return (
                        <div
                            key={b.id}
                            className="rounded-xl2 p-6"
                            style={{
                                borderRadius: br,
                                background: blockBg,
                                border: `1px solid ${blockBorder}`,
                            }}
                        >
                            <div className="text-center">
                                <div className="grid grid-cols-4 gap-3 mb-4">
                                    {[
                                        { label: "วัน", value: days },
                                        { label: "ชม.", value: hours },
                                        { label: "นาที", value: minutes },
                                        { label: "วินาที", value: seconds },
                                    ].map((item, i) => (
                                        <div key={i}>
                                            <div
                                                className="text-4xl font-bold mb-1"
                                                style={{
                                                    color: header,
                                                    textShadow:
                                                        "0 2px 8px rgba(0,0,0,0.3)",
                                                }}
                                            >
                                                {String(item.value).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </div>
                                            <div
                                                className="text-xs font-medium"
                                                style={{
                                                    color: body,
                                                    opacity: 0.8,
                                                }}
                                            >
                                                {item.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {description && (
                                    <div
                                        className="text-base mt-3 font-medium"
                                        style={{
                                            color: body,
                                            opacity: 0.9,
                                        }}
                                    >
                                        {description}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                }

                // PromptPay QR
                if (b.type === "promptpay") {
                    const body = getTxt("body", theme?.textColor || "#f3f4f6");
                    const header = getTxt("header", theme?.accent || body);
                    const phoneNumber = b.props?.phoneNumber || "";
                    const amount = b.props?.amount || "";
                    const title = b.props?.title || "สนับสนุนผ่าน PromptPay";

                    return (
                        <div
                            key={b.id}
                            className="rounded-xl2 p-6 text-center"
                            style={{
                                borderRadius: br,
                                background: blockBg,
                                border: `1px solid ${blockBorder}`,
                            }}
                        >
                            <div
                                className="text-lg font-semibold mb-3"
                                style={{ color: header }}
                            >
                                {title}
                            </div>
                            {phoneNumber ? (
                                <div className="space-y-3">
                                    <div
                                        className="bg-white p-4 rounded-lg inline-block"
                                        style={{ border: "2px solid #e5e7eb" }}
                                    >
                                        {/* Placeholder for QR - in real implementation, generate QR from phoneNumber+amount */}
                                        <div className="w-48 h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                                            QR Code
                                            <br />
                                            {phoneNumber}
                                        </div>
                                    </div>
                                    <div
                                        className="text-sm"
                                        style={{ color: body, opacity: 0.8 }}
                                    >
                                        เบอร์: {phoneNumber}
                                        {amount && ` | จำนวน: ฿${amount}`}
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="text-sm"
                                    style={{ color: textColor, opacity: 0.6 }}
                                >
                                    ยังไม่ได้กรอกเบอร์ PromptPay
                                </div>
                            )}
                        </div>
                    );
                }

                // Google Maps embed
                if (b.type === "google-maps") {
                    const location = b.props?.location || "";
                    const embedUrl = location
                        ? `https://www.google.com/maps/embed/v1/place?key=${
                              b.props?.apiKey || "YOUR_API_KEY"
                          }&q=${encodeURIComponent(location)}`
                        : "";

                    return (
                        <div
                            key={b.id}
                            className="rounded-xl2 overflow-hidden"
                            style={{
                                borderRadius: br,
                                border: `1px solid ${blockBorder}`,
                                height: b.props?.height || "300px",
                            }}
                        >
                            {embedUrl && b.props?.apiKey ? (
                                <iframe
                                    className="w-full h-full"
                                    src={embedUrl}
                                    allowFullScreen
                                    loading="lazy"
                                />
                            ) : (
                                <div
                                    className="p-6 text-center text-sm flex items-center justify-center h-full"
                                    style={{ color: textColor, opacity: 0.6 }}
                                >
                                    {location
                                        ? "ต้องการ Google Maps API Key"
                                        : "ยังไม่ได้ใส่ตำแหน่ง"}
                                </div>
                            )}
                        </div>
                    );
                }

                // Contact Form
                if (b.type === "contact-form") {
                    const body = getTxt("body", theme?.textColor || "#f3f4f6");
                    const header = getTxt("header", theme?.accent || body);
                    const title = b.props?.title || "ติดต่อเรา";

                    return (
                        <div
                            key={b.id}
                            className="rounded-xl2 p-6"
                            style={{
                                borderRadius: br,
                                background: blockBg,
                                border: `1px solid ${blockBorder}`,
                            }}
                        >
                            <div
                                className="text-lg font-semibold mb-4"
                                style={{ color: header }}
                            >
                                {title}
                            </div>
                            <form
                                className="space-y-3"
                                onSubmit={(e) => e.preventDefault()}
                            >
                                <input
                                    type="text"
                                    placeholder="ชื่อ"
                                    className="w-full px-4 py-2 rounded-lg text-sm"
                                    style={{
                                        background: "rgba(0,0,0,0.2)",
                                        border: `1px solid ${blockBorder}`,
                                        color: body,
                                    }}
                                />
                                <input
                                    type="email"
                                    placeholder="อีเมล"
                                    className="w-full px-4 py-2 rounded-lg text-sm"
                                    style={{
                                        background: "rgba(0,0,0,0.2)",
                                        border: `1px solid ${blockBorder}`,
                                        color: body,
                                    }}
                                />
                                <textarea
                                    placeholder="ข้อความ"
                                    rows={4}
                                    className="w-full px-4 py-2 rounded-lg text-sm"
                                    style={{
                                        background: "rgba(0,0,0,0.2)",
                                        border: `1px solid ${blockBorder}`,
                                        color: body,
                                    }}
                                />
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                                    style={{
                                        background: buttonBg,
                                        color:
                                            getTxt("buttonLabel") ||
                                            readableText(buttonBg),
                                        borderRadius: br,
                                    }}
                                >
                                    ส่งข้อความ
                                </button>
                            </form>
                        </div>
                    );
                }

                // === Premium Block: Testimonials ===
                if (b.type === "testimonials") {
                    const items = b.props?.items || [];
                    const header = getTxt("header", textColor);
                    const body = getTxt("body", textColor);

                    return (
                        <div key={b.id} className="mt-3 mb-3">
                            {b.header?.title && (
                                <div
                                    className="text-xl font-bold mb-4"
                                    style={{ color: header }}
                                >
                                    {b.header.title}
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {items.map((item, i) => (
                                    <div
                                        key={i}
                                        className="p-6 rounded-xl"
                                        style={{
                                            background: blockBg,
                                            border: `1px solid ${blockBorder}`,
                                            borderRadius: br,
                                        }}
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            {item.avatar ? (
                                                <img
                                                    src={item.avatar}
                                                    alt={item.name}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div
                                                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                                                    style={{
                                                        background:
                                                            "rgba(255,255,255,0.1)",
                                                        color: header,
                                                    }}
                                                >
                                                    {item.name?.charAt(0) ||
                                                        "?"}
                                                </div>
                                            )}
                                            <div>
                                                <div
                                                    className="font-semibold"
                                                    style={{ color: header }}
                                                >
                                                    {item.name}
                                                </div>
                                                <div
                                                    className="text-sm opacity-70"
                                                    style={{ color: body }}
                                                >
                                                    {item.role}
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="text-sm leading-relaxed"
                                            style={{ color: body }}
                                        >
                                            "{item.text}"
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                }

                // === Premium Block: Pricing ===
                if (b.type === "pricing") {
                    const items = b.props?.items || [];
                    const header = getTxt("header", textColor);
                    const body = getTxt("body", textColor);

                    return (
                        <div key={b.id} className="mt-3 mb-3">
                            {b.header?.title && (
                                <div
                                    className="text-xl font-bold mb-4 text-center"
                                    style={{ color: header }}
                                >
                                    {b.header.title}
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {items.map((item, i) => (
                                    <div
                                        key={i}
                                        className={`p-6 rounded-xl relative ${
                                            item.highlight ? "ring-2" : ""
                                        }`}
                                        style={{
                                            background: item.highlight
                                                ? `linear-gradient(135deg, ${buttonBg}22, ${quoteAccent}22)`
                                                : blockBg,
                                            border: `1px solid ${
                                                item.highlight
                                                    ? buttonBg
                                                    : blockBorder
                                            }`,
                                            borderRadius: br,
                                        }}
                                    >
                                        {item.highlight && (
                                            <div
                                                className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                                                style={{
                                                    background: buttonBg,
                                                    color: readableText(
                                                        buttonBg
                                                    ),
                                                }}
                                            >
                                                แนะนำ
                                            </div>
                                        )}
                                        <div
                                            className="text-xl font-bold mb-2"
                                            style={{ color: header }}
                                        >
                                            {item.name}
                                        </div>
                                        <div
                                            className="text-2xl font-bold mb-4"
                                            style={{ color: buttonBg }}
                                        >
                                            {item.price}
                                        </div>
                                        <ul className="space-y-2 mb-4">
                                            {(item.features || []).map(
                                                (f, idx) => (
                                                    <li
                                                        key={idx}
                                                        className="flex items-start gap-2 text-sm"
                                                        style={{ color: body }}
                                                    >
                                                        <span
                                                            style={{
                                                                color: quoteAccent,
                                                            }}
                                                        >
                                                            ✓
                                                        </span>
                                                        {f}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                }

                // === Premium Block: Team ===
                if (b.type === "team") {
                    const items = b.props?.items || [];
                    const header = getTxt("header", textColor);
                    const body = getTxt("body", textColor);

                    return (
                        <div key={b.id} className="mt-3 mb-3">
                            {b.header?.title && (
                                <div
                                    className="text-xl font-bold mb-4 text-center"
                                    style={{ color: header }}
                                >
                                    {b.header.title}
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {items.map((item, i) => (
                                    <div
                                        key={i}
                                        className="text-center p-6 rounded-xl"
                                        style={{
                                            background: blockBg,
                                            border: `1px solid ${blockBorder}`,
                                            borderRadius: br,
                                        }}
                                    >
                                        {item.avatar ? (
                                            <img
                                                src={item.avatar}
                                                alt={item.name}
                                                className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                                            />
                                        ) : (
                                            <div
                                                className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4"
                                                style={{
                                                    background:
                                                        "rgba(255,255,255,0.1)",
                                                    color: header,
                                                }}
                                            >
                                                {item.name?.charAt(0) || "?"}
                                            </div>
                                        )}
                                        <div
                                            className="text-lg font-bold mb-1"
                                            style={{ color: header }}
                                        >
                                            {item.name}
                                        </div>
                                        <div
                                            className="text-sm font-medium mb-3"
                                            style={{ color: quoteAccent }}
                                        >
                                            {item.role}
                                        </div>
                                        <div
                                            className="text-sm leading-relaxed mb-3"
                                            style={{ color: body }}
                                        >
                                            {item.bio}
                                        </div>
                                        {item.social && (
                                            <div className="flex gap-2 justify-center">
                                                {item.social.linkedin && (
                                                    <a
                                                        href={
                                                            item.social.linkedin
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:opacity-70"
                                                        style={{ color: body }}
                                                    >
                                                        <span className="text-xl">
                                                            💼
                                                        </span>
                                                    </a>
                                                )}
                                                {item.social.twitter && (
                                                    <a
                                                        href={
                                                            item.social.twitter
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:opacity-70"
                                                        style={{ color: body }}
                                                    >
                                                        <span className="text-xl">
                                                            🐦
                                                        </span>
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                }

                // === Premium Block: Stats ===
                if (b.type === "stats") {
                    const items = b.props?.items || [];
                    const header = getTxt("header", textColor);
                    const body = getTxt("body", textColor);

                    return (
                        <div key={b.id} className="mt-3 mb-3">
                            {b.header?.title && (
                                <div
                                    className="text-xl font-bold mb-4 text-center"
                                    style={{ color: header }}
                                >
                                    {b.header.title}
                                </div>
                            )}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {items.map((item, i) => (
                                    <div
                                        key={i}
                                        className="text-center p-6 rounded-xl"
                                        style={{
                                            background: blockBg,
                                            border: `1px solid ${blockBorder}`,
                                            borderRadius: br,
                                        }}
                                    >
                                        <div className="text-4xl mb-2">
                                            {item.icon}
                                        </div>
                                        <div
                                            className="text-3xl font-bold mb-1"
                                            style={{ color: buttonBg }}
                                        >
                                            {item.value}
                                        </div>
                                        <div
                                            className="text-sm"
                                            style={{ color: body }}
                                        >
                                            {item.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                }

                // === Premium Block: Timeline ===
                if (b.type === "timeline") {
                    const items = b.props?.items || [];
                    const header = getTxt("header", textColor);
                    const body = getTxt("body", textColor);

                    return (
                        <div key={b.id} className="mt-3 mb-3">
                            {b.header?.title && (
                                <div
                                    className="text-xl font-bold mb-4"
                                    style={{ color: header }}
                                >
                                    {b.header.title}
                                </div>
                            )}
                            <div className="space-y-6">
                                {items.map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div
                                            className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center font-bold text-sm"
                                            style={{
                                                background: `linear-gradient(135deg, ${buttonBg}, ${quoteAccent})`,
                                                color: readableText(buttonBg),
                                            }}
                                        >
                                            {item.year}
                                        </div>
                                        <div
                                            className="flex-1 p-4 rounded-xl"
                                            style={{
                                                background: blockBg,
                                                border: `1px solid ${blockBorder}`,
                                                borderRadius: br,
                                            }}
                                        >
                                            <div
                                                className="font-bold mb-2"
                                                style={{ color: header }}
                                            >
                                                {item.title}
                                            </div>
                                            <div
                                                className="text-sm"
                                                style={{ color: body }}
                                            >
                                                {item.description}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                }

                // Unknown block fallback
                return (
                    <div
                        key={b.id}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400"
                    >
                        บล็อกชนิด {b.type} ยังไม่รองรับในพรีวิว
                    </div>
                );
            })}
        </div>
    );
}
