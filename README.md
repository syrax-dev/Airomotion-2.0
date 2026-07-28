# AIROMOTION

AIROMOTION is a smart automation, security, and energy solutions website.

Live site: [airomotion.com](https://airomotion.com)

## Project structure

- `Client/` — React + Vite public website
- `Server/` — Express API for enquiries and product registrations

## Run locally

```sh
# Terminal 1
cd Server
pnpm install
pnpm dev

# Terminal 2
cd Client
pnpm install
pnpm dev
```

The client runs on Vite's local URL and the API runs on `http://localhost:5000`.

## Form API

The production API is hosted at `https://airomotion-api.onrender.com`.
All form routes use the `/api` prefix:

- `POST /api/enquiry`
- `POST /api/product-registration`

For production, configure the client with:

```dotenv
VITE_API_URL=https://airomotion-api.onrender.com/api
```

## Deployment

The client and API are deployed as separate Docker services. See the READMEs in
[`Client/`](Client/README.md) and [`Server/`](Server/README.md) for deployment
and environment-variable details.
