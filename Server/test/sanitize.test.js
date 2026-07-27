import test from 'node:test';
import assert from 'node:assert/strict';

import {
  escapeHtml,
  escapeSpreadsheetFormula,
  sanitizeSpreadsheetPayload,
  sanitizeTextInput,
} from '../src/utils/sanitize.js';

test('sanitizes dangerous text input and escapes HTML for rendering', () => {
  const dirtyValue = '<img src=x onerror=alert(1)>Hello <b>world</b> & "quotes"';

  const sanitized = sanitizeTextInput(dirtyValue);
  const rendered = escapeHtml(sanitized);

  assert.equal(sanitized, 'Hello world & "quotes"');
  assert.equal(rendered, 'Hello world &amp; &quot;quotes&quot;');
});

test('escapes formula-like values before they reach a spreadsheet', () => {
  for (const value of ['=SUM(A1:A2)', '+1+1', '-1+1', '@SUM(A1:A2)', '  =HYPERLINK("https://attacker")']) {
    assert.equal(escapeSpreadsheetFormula(value), `'${value}`);
  }

  assert.equal(escapeSpreadsheetFormula('Normal customer note'), 'Normal customer note');
});

test('escapes every string in an outbound spreadsheet payload', () => {
  const payload = sanitizeSpreadsheetPayload({
    name: '=IMPORTXML("https://attacker")',
    metadata: { note: '+SUM(1,1)' },
    items: ['safe', '@cmd'],
    count: 1,
  });

  assert.deepEqual(payload, {
    name: "'=IMPORTXML(\"https://attacker\")",
    metadata: { note: "'+SUM(1,1)" },
    items: ['safe', "'@cmd"],
    count: 1,
  });
});
