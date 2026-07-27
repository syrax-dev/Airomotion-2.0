# AIROMOTION server

The server is the private integration boundary for the AIROMOTION website. It
accepts customer enquiries and product registrations from the React client,
validates and protects the input, scans uploaded invoice PDFs, then sends the
approved data to the deployed Google Apps Script. The Apps Script writes to
Google Sheets and creates invoice files in Google Drive.

The browser must never receive the Apps Script URL, Drive folder ID, or any
other integration secret. Those values belong only in this service's runtime
environment.

## Technology and layout

- Node.js with Express 5.
- `express-validator` for server-side form validation.
- Multer memory storage for the single invoice PDF upload.
- ClamAV's INSTREAM protocol for mandatory malware scanning.
- Helmet, strict CORS, request/body limits, rate limiting and a honeypot for
  layered request protection.
- Google Apps Script as the outbound persistence integration.

```text
Server/
├── src/
│   ├── app.js                 # Express middleware and health routes
│   ├── server.js              # Process entry point and PORT listener
│   ├── routes/                # /api/enquiry and /api/product-registration
│   ├── controllers/           # Validated request → Apps Script payload
│   ├── validators/            # Per-field validation rules
│   ├── middleware/            # CORS, limits, upload, scan and error handling
│   ├── services/              # Apps Script, invoice encoding and ClamAV
│   └── utils/                 # Sanitization, logging and response helpers
├── test/                      # Node built-in test runner tests
├── Dockerfile                 # Production Node image
└── .dockerignore              # Keeps secrets/tests/dependencies out of image context
```

## Prerequisites

- Node.js 22 or later recommended.
- pnpm (the repository includes `pnpm-lock.yaml`) or npm.
- A reachable ClamAV daemon for product-registration uploads.
- A deployed Google Apps Script endpoint that accepts the documented payloads.
- Docker, only for container builds/runs.

## Local development

Create `Server/.env`; this file is ignored by Git:

```dotenv
PORT=5000
NODE_ENV=development

# Exact browser origin allowed to call this API.
CLIENT_URL=http://localhost:5173
TRUST_PROXY_HOPS=1

# Server-only integrations.
APPS_SCRIPT_URL=YOUR_APPS_SCRIPT_WEB_APP_URL
GOOGLE_DRIVE_INVOICES_FOLDER_ID=YOUR_DRIVE_FOLDER_ID

# Required for invoice uploads. Use either a Unix socket OR host/port.
CLAMAV_HOST=127.0.0.1
CLAMAV_PORT=3310
CLAMAV_TIMEOUT_MS=10000
# CLAMAV_SOCKET=/var/run/clamav/clamd.ctl
```

Then run:

```sh
pnpm install
pnpm dev
```

Useful commands:

```sh
pnpm dev    # Start with nodemon for local reloads
pnpm start  # Start once; this is the production command
pnpm test   # Run all automated tests with node --test
```

Check local liveness:

```sh
curl http://localhost:5000/health
```

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | No | Listening port; defaults to `5000`. Render supplies this. |
| `NODE_ENV` | Yes in production | Set to `production` so production error responses are masked and CORS requires configuration. |
| `CLIENT_URL` | Yes in production | Exact allowed frontend origin, for example `https://site.onrender.com`. Do not use `*` or include `/api`. |
| `TRUST_PROXY_HOPS` | No | Reverse-proxy depth; defaults to `1`, which is appropriate for Render. |
| `APPS_SCRIPT_URL` | Yes for form persistence | Deployed Google Apps Script web-app URL that receives the JSON payload. |
| `GOOGLE_DRIVE_INVOICES_FOLDER_ID` | Yes for registrations | Drive folder ID passed to Apps Script for invoice storage. |
| `CLAMAV_HOST` + `CLAMAV_PORT` | One scanner option | Host and port for a reachable `clamd` service; default port is `3310`. |
| `CLAMAV_SOCKET` | Alternative scanner option | Unix socket path for a local `clamd`; takes precedence over host/port. |
| `CLAMAV_TIMEOUT_MS` | No | Scanner timeout in milliseconds; defaults to `10000`. |

Without a valid ClamAV configuration or reachable scanner, product-registration
uploads fail closed with `503`; they are never sent to Apps Script unscanned.

## HTTP API

All application endpoints use the `/api` prefix. Successful responses use:

```json
{
  "success": true,
  "message": "…",
  "data": {}
}
```

| Method and path | Content type | Purpose |
| --- | --- | --- |
| `GET /` | — | Basic service confirmation. |
| `GET /health` | — | Lightweight liveness check; does not call external services. |
| `POST /api/enquiry` | `application/json` | Submit an enquiry. |
| `POST /api/product-registration` | `multipart/form-data` | Register a product and upload its invoice PDF. |

### Enquiry body

Send `name`, `phone`, `email`, `propertyType`, `productCategory`, and `message`.
Phone numbers are limited to 10–15 characters and the message is limited to
1,000 characters.

### Product-registration fields

Send `name`, `phone`, `email`, `address`, `productCategory`, `productName`,
`modelNumber`, `serialNumber`, `purchaseDate`, `installationDate`, and
`invoicePdf`. `notes` is optional but, when provided, must contain at least
10 characters. Dates must be strict ISO-8601 values, and installation cannot
precede purchase.

`invoicePdf` must be one genuine `application/pdf` file with a `.pdf`
extension, PDF header/trailer markers, and a maximum size of 5 MB. The API
checks metadata and content before scanning it.

Both forms may include a hidden `website` field. If it is populated, the API
returns `204` and intentionally does no validation, scanning, storage, or
outbound request; this is the honeypot anti-bot control.

## Request flow and safety controls

```text
Browser → CORS / Helmet / global limiter → route limiter → validation
        → (registration only: PDF checks → ClamAV scan)
        → input + spreadsheet formula sanitization → Google Apps Script
        → Google Sheets / Google Drive
```

- Global API rate limit: 100 requests per IP per 15 minutes.
- Enquiry limit: 10 submissions per IP per minute.
- Registration limit: 5 submissions per IP per minute.
- JSON and URL-encoded request bodies: 100 KB maximum.
- Registration PDFs: 5 MB maximum; uploads stay in memory and are not written
  to a shared temporary directory.
- Inputs are escaped and spreadsheet-bound strings beginning with `=`, `+`,
  `-`, or `@` are prefixed to prevent formula execution in Sheets.
- Production error responses mask unexpected server error details.

The Apps Script response must confirm the expected form type and destination:
`Enquiries` for enquiries and `Product Registration` for registrations. A
mismatched/outdated Apps Script deployment is treated as a `502`, never as a
successful submission.

## Production Docker image

The image installs production dependencies only and runs `node src/server.js`.
It does not contain the local `.env`, credentials directory, or test suite.

From the repository root:

```sh
docker build -t airomotion-server ./Server
docker run --rm -p 5000:5000 \
  -e PORT=5000 \
  -e NODE_ENV=production \
  -e CLIENT_URL=https://your-frontend.onrender.com \
  -e APPS_SCRIPT_URL=YOUR_APPS_SCRIPT_WEB_APP_URL \
  -e GOOGLE_DRIVE_INVOICES_FOLDER_ID=YOUR_DRIVE_FOLDER_ID \
  -e CLAMAV_HOST=host.docker.internal \
  -e CLAMAV_PORT=3310 \
  airomotion-server
```

The container needs network access to ClamAV. `host.docker.internal` is often
useful for local Docker Desktop; in production use the hostname reachable from
the service. Do not add service-account files or `.env` files to the image.

## Render deployment

Deploy this as a separate **Web Service** using Docker.

| Render setting | Value |
| --- | --- |
| Root Directory | `Server` |
| Runtime | Docker |
| Dockerfile | `Dockerfile` (the default relative to the root directory) |
| Health Check Path | `/health` |

Add the production environment variables from the table above. At minimum,
set `NODE_ENV=production`, `CLIENT_URL`, `APPS_SCRIPT_URL`, and
`GOOGLE_DRIVE_INVOICES_FOLDER_ID`; additionally provide a network-reachable
ClamAV host/port if product registration is enabled.

Render's service is behind a reverse proxy, so retain `TRUST_PROXY_HOPS=1`.
After the frontend service receives its public URL, set `CLIENT_URL` to that
exact origin. After the backend receives its public URL, set the client's
`VITE_API_URL` to `https://<backend>.onrender.com/api`.

Important: a separate Render Web Service is not automatically a ClamAV daemon.
If uploads are enabled, provision a reachable scanner (for example a dedicated
private service) and ensure Render networking/firewall rules permit the API to
reach it. Do not disable the scanner merely to make registrations succeed.

## Troubleshooting

- **Backend will not boot in production:** set a valid non-wildcard `CLIENT_URL`.
- **Browser gets CORS/403:** the frontend origin does not exactly match
  `CLIENT_URL`; check protocol, hostname, and custom-domain changes.
- **Registration gets 503:** ClamAV is unset, unreachable, too slow, or returns
  an invalid response. Inspect the service logs and scanner connectivity.
- **Registration gets 422:** ClamAV detected malware in the uploaded PDF.
- **Registration gets 400/413:** verify PDF extension/content/type and the
  5 MB limit; also check the required form fields and ISO dates.
- **Form request succeeds at the API but data is missing:** validate
  `APPS_SCRIPT_URL`, the Drive folder ID, and that the deployed Apps Script
  returns the expected `success`, `formType`, and destination values.
- **Rate limit blocks valid testing:** wait for the relevant one-minute or
  fifteen-minute window, or use a different test IP. Do not raise limits
  casually in production.

## Before handing off a change

```sh
pnpm test
docker build -t airomotion-server ./Server
docker run --rm -p 5000:5000 \
  -e NODE_ENV=production \
  -e CLIENT_URL=https://example.com \
  -e PORT=5000 \
  airomotion-server
curl http://localhost:5000/health
```

The final smoke test only checks liveness; it intentionally does not call
Apps Script or ClamAV. Keep all real secrets in Render environment variables
or another approved secret manager, never in Git.
