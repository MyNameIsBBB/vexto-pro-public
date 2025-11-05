const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

// Helper to build transporter from ENV or fallback to json transport for dev
function buildTransporter() {
    const host = process.env.EMAIL_HOST;
    const port = process.env.EMAIL_PORT
        ? Number(process.env.EMAIL_PORT)
        : undefined;
    const secure = String(process.env.EMAIL_SECURE || "false") === "true";
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (host && port && user && pass) {
        return nodemailer.createTransport({
            host,
            port,
            secure,
            auth: { user, pass },
        });
    }
    if (user && pass) {
        return nodemailer.createTransport({
            service: "gmail",
            auth: { user, pass },
        });
    }
    // Fallback logs email as JSON (does not send) so dev can test without creds
    return nodemailer.createTransport({ jsonTransport: true });
}

router.post("/", async (req, res) => {
    try {
        const {
            name,
            email,
            subject,
            rating,
            comments,
            improvements,
            allowContact,
        } = req.body || {};

        if (!name || !email || !comments) {
            return res
                .status(400)
                .json({ error: "กรุณากรอกชื่อ อีเมล และความคิดเห็น" });
        }
        const ratingNum = Number(rating) || 0;
        const stars = "★"
            .repeat(Math.max(0, Math.min(5, ratingNum)))
            .padEnd(5, "☆");
        const to = process.env.EMAIL_TO || "peeratus0912@gmail.com";

        const transporter = buildTransporter();

        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER || email,
            to,
            subject:
                subject ||
                `Feedback จาก ${name} (${ratingNum}/5 ดาว) - Vectr.co`,
            text: `มีฟีดแบ็กใหม่เข้ามา\n\nผู้ส่ง: ${name} <${email}>\nให้คะแนน: ${ratingNum}/5 (${stars})\nยินดีให้ติดต่อกลับ: ${
                allowContact ? "ใช่" : "ไม่"
            }\n\nความคิดเห็น:\n${comments}\n\nข้อเสนอแนะเพิ่มเติม:\n${
                improvements || "-"
            }`,
            html: `
                <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;">
                    <h2>มีฟีดแบ็กใหม่เข้ามา</h2>
                    <p><strong>ผู้ส่ง:</strong> ${name} &lt;${email}&gt;</p>
                    <p><strong>ให้คะแนน:</strong> ${stars} (${ratingNum}/5)</p>
                    <p><strong>ยินดีให้ติดต่อกลับ:</strong> ${
                        allowContact ? "ใช่" : "ไม่"
                    }</p>
                    <hr />
                    <p><strong>ความคิดเห็น</strong></p>
                    <p style="white-space: pre-wrap;">${(
                        comments || ""
                    ).replace(/</g, "&lt;")}</p>
                    <p><strong>ข้อเสนอแนะเพิ่มเติม</strong></p>
                    <p style="white-space: pre-wrap;">${(
                        improvements || "-"
                    ).replace(/</g, "&lt;")}</p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        const sent = Boolean(info?.messageId || info?.envelope || info);
        return res.json({ ok: true, sent });
    } catch (e) {
        console.error("Feedback send error", e);
        return res.status(500).json({ error: "ส่งอีเมลไม่สำเร็จ" });
    }
});

module.exports = router;
