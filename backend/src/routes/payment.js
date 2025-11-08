const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

function requireEnv(name) {
    const v = process.env[name];
    if (!v) throw new Error(`Missing env ${name}`);
    return v;
}

// Discord webhook helper
async function sendDiscordWebhook(webhookUrl, embed) {
    if (!webhookUrl) return;
    try {
        await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ embeds: [embed] }),
        });
    } catch (error) {
        console.error("Discord webhook error:", error);
    }
}

// Helper function to create PromptPay QR with reference data
function createPromptPayQR(phoneNumber, amount, ref) {
    const generatePayload = require("promptpay-qr");
    const QRCode = require("qrcode");

    // Generate PromptPay payload with reference
    const payload = generatePayload(phoneNumber, {
        amount: amount,
        additionalData: ref.slice(0, 25), // PromptPay supports up to 25 chars
    });

    return QRCode.toDataURL(payload);
}

// Create Stripe Payment Intent with PromptPay
router.post("/create", auth, async (req, res, next) => {
    try {
        const { amount, grantType, itemId, proPlan } = req.body || {};

        const amt = parseFloat(amount);
        if (!amt || amt < 1) {
            return res
                .status(400)
                .json({ error: "amount ต้องเป็นจำนวนเงินที่ถูกต้อง" });
        }

        // Block Pro purchase if user already has active Pro
        if (grantType === "pro") {
            const user = await User.findById(req.userId);

            // Admin always has Pro and no expiry - block purchase
            if (user && user.isAdmin) {
                return res.status(400).json({
                    error: "Admin ไม่สามารถซื้อ Pro ได้",
                });
            }

            // Check if user has active Pro subscription
            if (user && user.isPro) {
                const now = new Date();

                // If proExpiry exists and still valid, block
                if (user.proExpiry && new Date(user.proExpiry) > now) {
                    const daysLeft = Math.ceil(
                        (new Date(user.proExpiry) - now) / (1000 * 60 * 60 * 24)
                    );
                    return res.status(400).json({
                        error: `คุณมี Pro อยู่แล้ว หมดอายุในอีก ${daysLeft} วัน`,
                        proExpiry: user.proExpiry,
                    });
                }

                // If isPro but no expiry (legacy/manual grant), still block
                if (!user.proExpiry) {
                    return res.status(400).json({
                        error: "คุณมี Pro อยู่แล้ว กรุณาติดต่อ admin หากต้องการต่ออายุ",
                    });
                }
            }
        }

        // Determine plan mapping (allow client to send proPlan or infer from amount)
        let resolvedPlan = null;
        if (grantType === "pro") {
            // Prefer explicit proPlan parameter
            if (proPlan && ["monthly", "yearly"].includes(proPlan)) {
                resolvedPlan = proPlan;
            } else {
                // Infer from common pricing (adjust if pricing changes)
                if (amt >= 900) resolvedPlan = "yearly"; // e.g. 999
                else resolvedPlan = "monthly"; // default for smaller amount e.g. 99
            }
        }

        // Build payment reference
        const paymentId = `${Date.now()}-${req.userId}`;
        const t =
            grantType === "pro" ? "pro" : grantType === "item" ? "item" : "raw";
        const i = t === "item" && itemId ? String(itemId).slice(0, 40) : "-";
        const ref = `u:${req.userId};t:${t};i:${i};id:${paymentId}`;

        // Create Stripe Payment Intent with PromptPay
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amt * 100), // Convert to satang
            currency: "thb",
            payment_method_types: ["promptpay"],
            metadata: {
                userId: req.userId,
                grantType: t,
                itemId: i || "",
                paymentId: paymentId,
                ref: ref,
                proPlan: resolvedPlan || "",
                proAmount: grantType === "pro" ? amt : "",
            },
            description: `Vexto ${
                t === "pro"
                    ? `Pro Subscription (${resolvedPlan || "monthly"})`
                    : t === "item"
                    ? `Item: ${i}`
                    : "Payment"
            }`,
        });

        return res.json({
            paymentId,
            payment_intent_id: paymentIntent.id,
            client_secret: paymentIntent.client_secret,
            amount: amt,
            currency: "thb",
            ref,
            grantType: t,
            proPlan: resolvedPlan,
            expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
            stripe_status: paymentIntent.status,
            stripe_publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
        });
    } catch (e) {
        console.error("Stripe payment creation error:", e);
        next(e);
    }
});

// Verify Stripe Payment Intent
router.post("/verify", auth, async (req, res, next) => {
    try {
        const { payment_intent_id, paymentId } = req.body || {};

        if (!payment_intent_id && !paymentId) {
            return res.status(400).json({
                error: "กรุณาระบุ payment_intent_id หรือ paymentId",
            });
        }

        // Retrieve Payment Intent from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(
            payment_intent_id
        );

        if (!paymentIntent) {
            return res.status(400).json({
                error: "ไม่พบการชำระเงิน",
            });
        }

        // Check payment status
        if (paymentIntent.status !== "succeeded") {
            return res.status(400).json({
                error: "การชำระเงินยังไม่สมบูรณ์",
                status: paymentIntent.status,
                details: {
                    id: paymentIntent.id,
                    status: paymentIntent.status,
                    amount: paymentIntent.amount / 100,
                    currency: paymentIntent.currency,
                },
            });
        }

        // Get metadata from Payment Intent
        const metadata = paymentIntent.metadata;
        const userId = metadata.userId;
        const type = metadata.grantType;
        const item = metadata.itemId;

        // Verify user matches
        if (userId && userId === req.userId) {
            const user = await User.findById(userId);
            if (user) {
                // Grant entitlements
                if (type === "pro") {
                    user.isPro = true;
                    // Determine plan & extend expiry
                    const plan = metadata.proPlan || "monthly";
                    user.proTier = ["monthly", "yearly"].includes(plan)
                        ? plan
                        : "monthly";
                    const now = Date.now();
                    const baseStart =
                        user.proExpiry &&
                        new Date(user.proExpiry).getTime() > now
                            ? new Date(user.proExpiry).getTime()
                            : now;
                    const durationMs =
                        user.proTier === "yearly"
                            ? 365 * 24 * 60 * 60 * 1000
                            : 30 * 24 * 60 * 60 * 1000; // monthly default ~30 days
                    user.proExpiry = new Date(baseStart + durationMs);
                } else if (type === "item" && item && item !== "-") {
                    if (!user.purchasedItems.includes(item)) {
                        user.purchasedItems.push(item);
                    }
                }
                await user.save();

                return res.json({
                    ok: true,
                    verified: true,
                    granted: {
                        userId,
                        type,
                        item: item || null,
                        proTier: user.proTier,
                        proExpiry: user.proExpiry,
                    },
                    transaction: {
                        payment_intent_id: paymentIntent.id,
                        amount: paymentIntent.amount / 100,
                        currency: paymentIntent.currency,
                        status: paymentIntent.status,
                        payment_method: paymentIntent.payment_method,
                        created: new Date(
                            paymentIntent.created * 1000
                        ).toISOString(),
                        metadata: paymentIntent.metadata,
                    },
                });
            }
        }

        return res.status(400).json({
            error: "ไม่สามารถอัพเดทสิทธิ์ได้ หรือ userId ไม่ตรงกัน",
        });
    } catch (e) {
        console.error("Stripe payment verification error:", e);
        next(e);
    }
});

// Stripe Webhook handler (for real-time payment updates)
router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
        const sig = req.headers["stripe-signature"];
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        let event;

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                webhookSecret
            );
        } catch (err) {
            console.error(
                "Webhook signature verification failed:",
                err.message
            );
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // Handle the event
        switch (event.type) {
            case "payment_intent.succeeded":
                const paymentIntent = event.data.object;
                console.log("Payment succeeded:", paymentIntent.id);

                // Auto-grant permissions when payment succeeds
                const metadata = paymentIntent.metadata;
                if (metadata.userId) {
                    try {
                        const user = await User.findById(metadata.userId);
                        if (user) {
                            if (metadata.grantType === "pro") {
                                user.isPro = true;
                                const plan = metadata.proPlan || "monthly";
                                user.proTier = ["monthly", "yearly"].includes(
                                    plan
                                )
                                    ? plan
                                    : "monthly";
                                const now = Date.now();
                                const baseStart =
                                    user.proExpiry &&
                                    new Date(user.proExpiry).getTime() > now
                                        ? new Date(user.proExpiry).getTime()
                                        : now;
                                const durationMs =
                                    user.proTier === "yearly"
                                        ? 365 * 24 * 60 * 60 * 1000
                                        : 30 * 24 * 60 * 60 * 1000;
                                user.proExpiry = new Date(
                                    baseStart + durationMs
                                );
                            } else if (
                                metadata.grantType === "item" &&
                                metadata.itemId &&
                                metadata.itemId !== "-"
                            ) {
                                if (
                                    !user.purchasedItems.includes(
                                        metadata.itemId
                                    )
                                ) {
                                    user.purchasedItems.push(metadata.itemId);
                                }
                            }
                            await user.save();
                            console.log(
                                "Auto-granted permissions for user:",
                                metadata.userId
                            );

                            // Send Discord notification
                            const webhookUrl =
                                process.env.DISCORD_PAYMENT_WEBHOOK_URL;
                            if (webhookUrl) {
                                const embed = {
                                    title: "💰 การชำระเงินสำเร็จ",
                                    color: 0x00ff00,
                                    fields: [
                                        {
                                            name: "ผู้ใช้",
                                            value: user.username || user.email,
                                            inline: true,
                                        },
                                        {
                                            name: "จำนวนเงิน",
                                            value: `฿${
                                                paymentIntent.amount / 100
                                            }`,
                                            inline: true,
                                        },
                                        {
                                            name: "ประเภท",
                                            value:
                                                metadata.grantType === "pro"
                                                    ? `Pro (${
                                                          metadata.proPlan ||
                                                          "monthly"
                                                      })`
                                                    : metadata.grantType ===
                                                      "item"
                                                    ? `Item: ${metadata.itemId}`
                                                    : "อื่นๆ",
                                            inline: true,
                                        },
                                        {
                                            name: "Payment ID",
                                            value: paymentIntent.id,
                                            inline: false,
                                        },
                                    ],
                                    timestamp: new Date().toISOString(),
                                    footer: {
                                        text: "Vexto Payment System",
                                    },
                                };
                                await sendDiscordWebhook(webhookUrl, embed);
                            }
                        }
                    } catch (error) {
                        console.error(
                            "Error auto-granting permissions:",
                            error
                        );
                    }
                }
                break;

            case "payment_intent.payment_failed":
                console.log("Payment failed:", event.data.object.id);
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.json({ received: true });
    }
);

module.exports = router;
