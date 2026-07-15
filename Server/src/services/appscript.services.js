/**
 * Send data to Google Apps Script
 * @param {Object} payload
 * @returns {Promise<Object>}
 */
export const sendToAppsScript = async (payload) => {
    try {
        // Read this after dotenv has been initialized. ESM imports are evaluated
        // before server.js reaches dotenv.config(), so a module-level value can
        // otherwise be captured as undefined.
        const appsScriptUrl = process.env.APPS_SCRIPT_URL;

        if (!appsScriptUrl) {
            throw new Error("APPS_SCRIPT_URL is not configured. Please check your .env file.");
        }

        // lazy import to avoid cycle in some environments
        const { info, error: logError } = await import("../utils/logger.js");
        
        info('sendToAppsScript: Attempting to send data', { 
            url: appsScriptUrl,
            formType: payload.formType,
            hasData: !!payload
        });

        const response = await fetch(appsScriptUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        info(`sendToAppsScript: Response received with status ${response.status}`);

        if (!response.ok) {
            const errorText = await response.text();
            logError('sendToAppsScript: Failed response', { 
                status: response.status, 
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(
                `Apps Script returned HTTP ${response.status}: ${response.statusText}`
            );
        }

        const result = await response.json();

        if (!result.success) {
            logError('sendToAppsScript: Apps script reported failure', { result });
            throw new Error(result.message || "Apps Script failed to process request");
        }

        info('sendToAppsScript: Success', { result });

        return result;
    } catch (error) {
        // surface and log
        // eslint-disable-next-line no-console
        console.error('sendToAppsScript error', error);
        const { error: logError } = await import("../utils/logger.js");
        logError('sendToAppsScript: Exception occurred', { 
            error: error.message,
            stack: error.stack
        });
        throw new Error(
            `Apps Script Error: ${error.message}`
        );
    }
};
