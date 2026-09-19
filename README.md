# SANTHOSH BARCODE GEN
Production client integrated with NAGI KEY.

Render:
- Build: npm install
- Start: npm start

Environment:
NAGI_KEY_URL=https://nagi-key-clean.onrender.com

The browser never receives DATABASE_URL, JWT_SECRET, LICENSE_SIGNING_SECRET or ADMIN_PASSWORD. License requests are proxied by the application backend.

Default sticker: 37 × 15 mm.

## Build verification
`npm install`
`npm run build`

## Render
The production service is `santhosh-barcode-gen-m9mm.onrender.com`. NAGI KEY is configured through `NAGI_KEY_URL` and license secrets never enter browser code.
