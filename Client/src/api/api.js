import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

const submitEnquiry = (data) => api.post('/enquiry', data);

// registration expects multipart/form-data (invoice file)
const submitRegistration = (formData) => api.post('/registration', formData);

export { submitEnquiry, submitRegistration };
export default api;