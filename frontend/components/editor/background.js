// Shared background style helpers for full-page (outer) and card (inner)
// Pass proActive = true when Pro/paid features are enabled for the user

export const buildBgStyle = (theme, useFull, proActive = false) => {
    if (useFull) {
        const canUseOuterImage = proActive && theme?.outerBackgroundImage;
        if (canUseOuterImage) {
            return {
                backgroundColor: theme?.outerBackground || theme?.background,
                backgroundImage: `url(${theme.outerBackgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            };
        }
        return { background: theme?.outerBackground || theme?.background };
    }
    return {};
};

export const buildInnerBgStyle = (theme, proActive = false) => {
    const canUseInnerImage = proActive && theme?.backgroundImage;
    if (canUseInnerImage) {
        return {
            backgroundImage: `url(${theme.backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
        };
    }
    return { background: theme?.background };
};
