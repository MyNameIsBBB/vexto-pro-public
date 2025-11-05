const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

const BASES = [
    "https://www.tmweasy.com/apipp.php",
    "https://tmwallet.thaighost.net/apipp.php",
];

async function tmweasyGet(params) {
    const { URL } = require("url");
    let lastErr;
    for (const base of BASES) {
        try {
            const u = new URL(base);
            Object.entries(params).forEach(([k, v]) =>
                u.searchParams.set(k, String(v))
            );
            const res = await fetch(u.toString(), { method: "GET" });
            const text = await res.text();
            // Try JSON first
            try {
                return JSON.parse(text);
            } catch (e) {
                // Some APIs may return query-like pairs; attempt naive parse
                const obj = {};
                text.split(/&|\n/).forEach((pair) => {
                    const [k, v] = pair.split("=");
                    if (k) obj[k.trim()] = decodeURIComponent(v || "");
                });
                if (Object.keys(obj).length > 0) return obj;
                throw new Error("Unexpected response format");
            }
        } catch (err) {
            lastErr = err;
        }
    }
    throw lastErr || new Error("TMWEASY request failed");
}

function requireEnv(name) {
    const v = process.env[name];
    if (!v) throw new Error(`Missing env ${name}`);
    return v;
}

// Create a payment session: Step 1 (create_pay) + Step 2 (detail_pay)
router.post("/session", auth, async (req, res, next) => {
    try {
        const username = requireEnv("TMW_USER");
        const password = requireEnv("TMW_PASSWORD");
        const con_id = requireEnv("TMW_CON_ID");
        const promptpay_id = requireEnv("TMW_PROMPTPAY_ID");
        const type = process.env.TMW_TYPE || "01"; // 01: phone, 03: e-wallet

        const { amount, ref1: ref1Raw, grantType, itemId } = req.body || {};
        const amt = parseInt(amount, 10);
        if (!amt || amt < 1) {
            return res
                .status(400)
                .json({ error: "amount ต้องเป็นจำนวนเต็มบาท" });
        }
        // Build ref1 including user and grant info (short and parseable)
        const safeRaw = (ref1Raw || "").toString().slice(0, 40);
        const t =
            grantType === "pro" ? "pro" : grantType === "item" ? "item" : "raw";
        const i = t === "item" && itemId ? String(itemId).slice(0, 40) : "-";
        const ref1 = `u:${req.userId};t:${t};i:${i};r:${safeRaw}`;

        // Step 1: create id_pay
        const createResp = await tmweasyGet({
            username,
            password,
            con_id,
            amount: amt,
            ref1,
            method: "create_pay",
        });
        if (String(createResp.status) !== "1" || !createResp.id_pay) {
            return res.status(400).json({
                error: createResp.msg || "create_pay ล้มเหลว",
                raw: createResp,
            });
        }
        const id_pay = createResp.id_pay;

        // Step 2: details + QR
        const detailResp = await tmweasyGet({
            username,
            password,
            con_id,
            id_pay,
            type,
            promptpay_id,
            method: "detail_pay",
        });
        if (String(detailResp.status) !== "1") {
            return res.status(400).json({
                error: detailResp.msg || "detail_pay ล้มเหลว",
                raw: detailResp,
            });
        }

        return res.json({
            id_pay,
            ref1,
            amount: amt,
            amount_check: detailResp.amount_check,
            time_out: detailResp.time_out,
            qr_image_base64: detailResp.qr_image_base64,
        });
    } catch (e) {
        next(e);
    }
});

// Confirm payment (Step 3)
router.post("/confirm", auth, async (req, res, next) => {
    try {
        const username = requireEnv("TMW_USER");
        const password = requireEnv("TMW_PASSWORD");
        const con_id = requireEnv("TMW_CON_ID");
        const accode = requireEnv("TMW_ACCODE");
        const account_no = requireEnv("TMW_ACCOUNT_NO");
        const { id_pay } = req.body || {};
        if (!id_pay) return res.status(400).json({ error: "id_pay จำเป็น" });

        const ip = (
            req.headers["x-forwarded-for"] ||
            req.socket.remoteAddress ||
            ""
        ).toString();
        const confirmResp = await tmweasyGet({
            username,
            password,
            con_id,
            id_pay,
            accode,
            account_no,
            ip,
            method: "confirm",
        });
        if (String(confirmResp.status) !== "1") {
            return res.status(400).json({
                error: confirmResp.msg || "ยืนยันการโอนล้มเหลว",
                raw: confirmResp,
            });
        }
        // Parse ref1: u:<userId>;t:<pro|item|raw>;i:<itemId|->;r:<raw>
        const ref1 = String(confirmResp.ref1 || "");
        const parts = Object.fromEntries(
            ref1.split(";").map((seg) => {
                const [k, v] = seg.split(":");
                return [k, v];
            })
        );
        const userId = parts.u;
        const type = parts.t;
        const item = parts.i;

        // Grant entitlements only if matches the current requester
        if (userId && userId === req.userId) {
            const user = await User.findById(userId);
            if (user) {
                if (type === "pro") {
                    user.isPro = true;
                } else if (type === "item" && item && item !== "-") {
                    if (!user.purchasedItems.includes(item)) {
                        user.purchasedItems.push(item);
                    }
                }
                await user.save();
            }
        }

        return res.json({
            ok: true,
            id_pay,
            amount: confirmResp.amount,
            date_pay: confirmResp.date_pay,
            ref1: confirmResp.ref1,
            granted: {
                userId: userId || null,
                type: type || null,
                item: item || null,
            },
        });
    } catch (e) {
        next(e);
    }
});

module.exports = router;
