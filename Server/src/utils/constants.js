export const MAX_PDF_SIZE_MB = 5;
export const MAX_PDF_SIZE = MAX_PDF_SIZE_MB * 1024 * 1024;
export const MAX_MULTIPART_FIELD_SIZE = 64 * 1024;
// Eleven registration fields plus the hidden anti-spam honeypot field.
export const MAX_REGISTRATION_FIELDS = 12;
// Busboy emits its `partsLimit` event when it reaches this value. Keep one
// spare part so the expected 12 fields plus one invoice PDF are accepted,
// while a fourteenth part is rejected.
export const MAX_REGISTRATION_PARTS = MAX_REGISTRATION_FIELDS + 2;
export const MAX_REQUEST_BODY_SIZE = "100kb";
export const MAX_URLENCODED_PARAMETERS = 20;

export const ALLOWED_MIME_TYPES = [
    "application/pdf",
];

export const ENDPOINTS = {
  ENQUIRY: "/enquiry",
  PRODUCT_REGISTRATION: "/product-registration"
}

export const METHODS = {
  GET: "GET: ",
  POST: "POST: ",
  PATCH: "PATCH: "
}
