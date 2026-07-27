const collapseWhitespace = (value) => value.replace(/\s+/g, ' ').trim();
const SPREADSHEET_FORMULA_PREFIX = /^\s*[=+\-@]/;

export const sanitizeTextInput = (value) => {
  if (typeof value !== 'string') return '';

  return collapseWhitespace(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]*>/g, ' ')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=\s*/gi, '')
      .replace(/[\u0000-\u001f\u007f]/g, ' ')
  );
};

export const escapeHtml = (value) => {
  if (typeof value !== 'string') return '';

  return value.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
};

/**
 * Forces potentially formula-like spreadsheet values to be stored as text.
 * Leading whitespace is included because Sheets/Excel may ignore it before
 * deciding whether a value is a formula.
 */
export const escapeSpreadsheetFormula = (value) => {
  if (typeof value !== 'string' || !SPREADSHEET_FORMULA_PREFIX.test(value)) {
    return value;
  }

  return `'${value}`;
};

/** Applies spreadsheet formula escaping to every string in an outbound payload. */
export const sanitizeSpreadsheetPayload = (value) => {
  if (typeof value === 'string') return escapeSpreadsheetFormula(value);
  if (Array.isArray(value)) return value.map(sanitizeSpreadsheetPayload);
  if (!value || typeof value !== 'object') return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, sanitizeSpreadsheetPayload(item)]),
  );
};
