import { ENDPOINTS } from './constants.js';

const format = (level, msg, meta) => {
    const time = new Date().toISOString();
    if (meta !== undefined) {
        console.log(`[${time}] [${level.toUpperCase()}] ${msg}`, meta);
    } else {
        console.log(`[${time}] [${level.toUpperCase()}] ${msg}`);
    }
};

export const info = (msg, meta) => format('info', msg, meta);
export const warn = (msg, meta) => format('warn', msg, meta);
export const error = (msg, meta) => format('error', msg, meta);
export const debug = (msg, meta) => format('debug', msg, meta);

export const requestLogger = (req, res, next) => {
    const { method, originalUrl } = req;
    const safeBody = req.body && Object.keys(req.body).length ? { ...req.body } : undefined;
    // attach known endpoint if matches
    const endpointMatch = Object.entries(ENDPOINTS).find(([, path]) => originalUrl.includes(path));
    const endpoint = endpointMatch ? endpointMatch[0] : undefined;
    info(`Incoming request: ${method} ${originalUrl}`, { method, endpoint, body: safeBody });
    next();
};

export default {
    info,
    warn,
    error,
    debug,
    requestLogger,
};
