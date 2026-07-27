import axios from "axios";

// Vite embeds VITE_* values into the browser bundle. This setting is limited
// to the public API origin; never add secrets, Apps Script URLs, or API keys
// here. Backend integrations belong in server-side environment variables.
const runtimeApiUrl = globalThis.__APP_CONFIG__?.VITE_API_URL;
const apiBaseUrl = (runtimeApiUrl || import.meta.env.VITE_API_URL || "http://localhost:5000/api")
    .replace(/\/$/, "");

const api = axios.create({
    baseURL: apiBaseUrl,
});

const submitEnquiry = (data) => api.post('/enquiry', data);

// Product registration now includes an invoice PDF, so it is sent as multipart/form-data.
const submitRegistration = (data) => api.post('/product-registration', data);

export { submitEnquiry, submitRegistration };
export default api;
