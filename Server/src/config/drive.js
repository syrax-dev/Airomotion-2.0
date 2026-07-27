/**
 * The Apps Script deployment performs the Drive upload. This ID is passed to
 * the script so the backend does not require Google service-account keys.
 */
export const getInvoicesFolderId = () => {
    const folderId = process.env.GOOGLE_DRIVE_INVOICES_FOLDER_ID?.trim();

    if (!folderId) {
        throw new Error("GOOGLE_DRIVE_INVOICES_FOLDER_ID is not configured.");
    }

    return folderId;
};
