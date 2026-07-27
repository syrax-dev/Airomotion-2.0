# AIROMOTION client

The client is AIROMOTION's public marketing site and form interface. It is a
single-page React application built with Vite. It presents the Automation,
Security, and Energy offerings, and submits enquiries and product
registrations to the separate Express API in [`../Server`](../Server).

## Technology and layout

- React 19 and React Router for the browser application and client-side routes.
- Vite for local development and the static production build.
- Axios for requests to the API.
- Nginx in the production Docker image, including a fallback to `index.html`
  for React Router routes such as `/contact`.

```text
Client/
├── src/
│   ├── api/api.js          # API base URL and form request helpers
│   ├── components/         # Shared UI, SEO, loading, header and footer
│   ├── pages/              # Home, About, Products, Services and Contact
│   └── assets/             # Optimized images and video used by the site
├── public/                 # Favicon, sitemap, robots.txt and static assets
├── Dockerfile              # Multi-stage Vite build + Nginx runtime image
└── nginx/                  # Runtime-port-aware Nginx configuration
```

## Prerequisites

- Node.js 22 or later recommended.
- pnpm (the repository includes `pnpm-lock.yaml`) or npm.
- Docker, only when building/running the production container.

## Local development

Install dependencies and start Vite from this directory:

```sh
pnpm install
pnpm dev
```

The development site normally runs at `http://localhost:5173`. Start the API
separately at `http://localhost:5000` using the Server README.

Useful commands:

```sh
pnpm dev       # Development server with hot reload
pnpm build     # Produce the static dist/ directory
pnpm preview   # Serve an already-built dist/ locally
pnpm lint      # Run Oxlint
```

## API configuration

The browser needs one public setting: `VITE_API_URL`. It must include the API
prefix, for example:

```dotenv
VITE_API_URL=http://localhost:5000/api
```

It can be supplied in either of these ways:

1. In local Vite development, set it in `Client/.env` (or let the local API
   fallback of `http://localhost:5000/api` be used).
2. In the Docker/Render deployment, set it as a container environment variable.
   The startup script writes it to `/runtime-config.js`; this takes precedence
   over a build-time Vite variable. This means the image can be reused with a
   different API URL without rebuilding it.

`VITE_API_URL` is intentionally visible to every browser visitor. Never put
credentials, Google Apps Script URLs, private keys, or any secret in a
`VITE_*` variable.

The API base URL is normalized to remove a trailing slash. The form helpers
send requests to:

| Helper | Request |
| --- | --- |
| `submitEnquiry` | `POST /api/enquiry` |
| `submitRegistration` | `POST /api/product-registration` |

The registration request is sent as `multipart/form-data` because it includes
an invoice PDF.

## Production Docker image

The Dockerfile first creates a Vite production build, then copies only the
static files into an Nginx image. Nginx listens on the runtime `PORT`, so it is
compatible with Render and a local custom port.

From the repository root:

```sh
docker build -t airomotion-client ./Client
docker run --rm -p 8080:8080 \
  -e PORT=8080 \
  -e VITE_API_URL=https://your-api.onrender.com/api \
  airomotion-client
```

Open `http://localhost:8080`. Also test a deep link such as
`http://localhost:8080/contact`; Nginx should serve the application rather
than a 404 page.

## Render deployment

Deploy the client as a **Web Service** using Docker.

| Render setting | Value |
| --- | --- |
| Root Directory | `Client` |
| Runtime | Docker |
| Dockerfile | `Dockerfile` (the default relative to the root directory) |
| Environment variable | `VITE_API_URL=https://<backend-service>.onrender.com/api` |

Render sets `PORT` automatically; do not hard-code a port in the service
settings. Point `VITE_API_URL` at the backend's public HTTPS URL, including
`/api`, not at its internal Docker address.

After both services are created, set the backend's `CLIENT_URL` to this
client's exact public origin (for example,
`https://airomotion-client.onrender.com`). If custom domains are used, update
both settings to their final HTTPS origins and redeploy/restart the services.

## Common changes

- **Add a page:** create it in `src/pages`, add a lazy route in `src/App.jsx`,
  then add navigation in the shared header/footer as appropriate.
- **Add or replace media:** place source assets in `src/assets`; Vite fingerprints
  imported files for cache-safe production delivery.
- **Change SEO metadata:** update the reusable `Seo` component and relevant
  static metadata in `index.html`.
- **Change an API route or payload:** update `src/api/api.js` and the matching
  server route/validator together. Keep backend validation authoritative.

## Troubleshooting

- **Form requests fail with CORS or 403:** verify that `VITE_API_URL` is the
  correct API URL and that the server's `CLIENT_URL` exactly matches the
  frontend origin (scheme and domain included; no path).
- **The deployed client calls localhost:** `VITE_API_URL` was not configured on
  the running client service. Set it in Render and restart the service.
- **A direct URL returns 404:** ensure the Docker service uses this repository's
  `Client/Dockerfile` and Nginx configuration, rather than a static-host setup
  without SPA fallback.
- **Changed the API URL but browser still uses the old one:** inspect
  `https://<client-origin>/runtime-config.js`; it is intentionally sent with
  `Cache-Control: no-store` and should contain the current value.

## Before handing off a change

```sh
pnpm lint
pnpm build
docker build -t airomotion-client ./Client
```

Do not commit `.env` files. Public values can be documented in an `.env.example`
file if the project later needs one.
