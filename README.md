# MUSE

A unified-checkout marketplace for small, independent "aesthetic" sellers (dresses, jewelry,
shoes, home decor). Buyers can add products from multiple different sellers to one cart and
pay once at a single checkout; each seller only ever sees and manages their own slice of the
order from their own dashboard.

MERN stack: MongoDB, Express, React (Vite), Node.js.

## Prerequisites

- Node.js 20+
- MongoDB running locally, or a MongoDB Atlas connection string
- (Optional, for full functionality) free accounts for:
  - [Cloudinary](https://cloudinary.com) — product/story image & video uploads
  - [Razorpay](https://razorpay.com) — test-mode payments
  - A Gmail account with an [App Password](https://myaccount.google.com/apppasswords) — OTP verification emails

The app runs and is fully browsable without any of the optional credentials. Features that
need them (uploading images, posting stories, paying at checkout, sending real emails) show a
clear in-app message telling you which `.env` variable is missing instead of crashing. Until
email is configured, the OTP code is shown directly in a toast in the browser (dev-mode fallback).

## Setup

```bash
# Backend
cd server
cp .env.example .env      # fill in MONGO_URI and any credentials you have
npm install
npm run seed               # optional: creates demo sellers/products/stories
npm run dev                 # http://localhost:5000

# Frontend (in a second terminal)
cd client
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```

Seeded demo accounts (after `npm run seed`), all password `password123`:
- Sellers: `ananya@muse.demo`, `meera@muse.demo`, `priya@muse.demo`
- Buyer: `buyer@muse.demo`

## Environment variables

**`server/.env`**

| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Random string used to sign auth cookies |
| `CLIENT_URL` | Frontend origin, for CORS (`http://localhost:5173`) |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Product/story media uploads |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Test-mode checkout payments |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` | Sending OTP verification emails |

**`client/.env`**

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend API base URL |
| `VITE_RAZORPAY_KEY_ID` | Same value as server's `RAZORPAY_KEY_ID` (safe to expose) |

## Try the full flow

1. Register as a seller (fill in a store name), verify the emailed/dev-mode OTP code.
2. In the Seller Dashboard, add a product with at least one image and check "Publish live".
3. Post a Story linked to that product — it appears in the homepage's "Shop the Trend" circles.
4. Register a second account as a buyer, verify its OTP.
5. Add products from two different sellers to the cart, and check out (Razorpay test card:
   `4111 1111 1111 1111`, any future expiry, any CVV, OTP `1234`).
6. As the buyer, view Order status on `/orders`. As the seller, update fulfillment status on
   `/seller/orders` — only that seller's portion of the order changes.

## Project structure

```
server/   Express + MongoDB REST API
client/   React (Vite) + Tailwind CSS frontend
```

See `server/models` for the data model and `server/routes` for the API surface.
