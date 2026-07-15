import axios from "axios";

// Vite exposes only variables prefixed with VITE_. Keep the local backend as
// the development default, while allowing deployed environments to supply
// their own API origin (for example: VITE_API_URL=https://api.example.com/api).
const apiBaseUrl = (import.meta.env.VITE_API_URL || "https://airomotion.com/api")
    .replace(/\/$/, "");

const api = axios.create({
    baseURL: apiBaseUrl,
});

const submitEnquiry = (data) => api.post('/enquiry', data);

// Product registration contains only text fields. Axios serializes this
// object as JSON, which is what the Express API and Apps Script expect.
const submitRegistration = (data) => api.post('/product-registration', data);

export { submitEnquiry, submitRegistration };
export default api;
