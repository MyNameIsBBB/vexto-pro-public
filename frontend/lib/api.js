const BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001/api";

export function setToken(token) {
    if (typeof window !== "undefined") localStorage.setItem("token", token);
}

export function getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
}

async function request(path, { method = "GET", body } = {}) {
    const headers = { "Content-Type": "application/json" };
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${BASE}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data?.error || "Request failed");
    }
    return data;
}

export const api = {
    get: (p) => request(p, { method: "GET" }),
    post: (p, b) => request(p, { method: "POST", body: b }),
    put: (p, b) => request(p, { method: "PUT", body: b }),
    delete: (p) => request(p, { method: "DELETE" }),
};

// Check username availability
export async function checkUsername(username, currentUsername = null) {
    try {
        const url = `/auth/check-username/${encodeURIComponent(username)}${
            currentUsername
                ? `?currentUsername=${encodeURIComponent(currentUsername)}`
                : ""
        }`;
        const res = await fetch(`${BASE}${url}`);
        return await res.json();
    } catch (e) {
        return { available: false, message: "เกิดข้อผิดพลาด" };
    }
}

// Stripe PromptPay Payment API
export const payment = {
    // Create Stripe Payment Intent with PromptPay
    async createPayment(amount, grantType, itemId = null) {
        return api.post("/payment/create", {
            amount,
            grantType,
            itemId,
        });
    },

    // Verify Stripe Payment Intent
    async verifyPayment(payment_intent_id, paymentId = null) {
        return api.post("/payment/verify", {
            payment_intent_id,
            paymentId,
        });
    },
};
