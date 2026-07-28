import axios from "axios";

// The Docker startup script provides VITE_API_URL at runtime. A Vite variable
// is also supported for non-Docker deployments. Neither value is secret: this
// is the browser-facing API origin only.
const runtimeApiUrl = globalThis.__APP_CONFIG__?.VITE_API_URL?.trim();
const buildTimeApiUrl = import.meta.env.VITE_API_URL?.trim();
const isLocalBrowser = ["localhost", "127.0.0.1", "::1"].includes(
    globalThis.location?.hostname,
);

// Local development works without configuration. A deployed browser must be
// given its public API URL; it must never try to call the visitor's localhost.
const configuredApiUrl = runtimeApiUrl || buildTimeApiUrl || (isLocalBrowser ? "http://localhost:5000/api" : "");

// Render configuration has historically been set to the backend origin (for
// example, https://airomotion-api.onrender.com). The Express routes live below
// /api, so make that harmless configuration mistake resolve to the real API
// endpoint while still accepting an explicit URL that already includes /api.
const apiBaseUrl = configuredApiUrl
    ? `${configuredApiUrl.replace(/\/+$/, "").replace(/\/api$/, "")}/api`
    : "";

const api = axios.create({
    baseURL: apiBaseUrl,
});

api.interceptors.request.use((config) => {
    if (!apiBaseUrl) {
        return Promise.reject(new Error(
            "API is not configured. Set VITE_API_URL to the public backend URL, including /api.",
        ));
    }

    return config;
});

const submitEnquiry = (data) => api.post('/enquiry', data);

// Product registration now includes an invoice PDF, so it is sent as multipart/form-data.
const submitRegistration = (data) => api.post('/product-registration', data);

export { submitEnquiry, submitRegistration };
export default api;
