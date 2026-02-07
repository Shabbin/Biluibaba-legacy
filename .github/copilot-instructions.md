# Copilot Instructions — Biluibaba

## Architecture

Monorepo with 5 apps sharing one Express backend. Each app is a separate Next.js project with its own `package.json`, port, and auth cookie:

| App | Port | Language | Auth Cookie | Role |
|---|---|---|---|---|
| `client/` | 3000 | JavaScript (`.jsx`) | `token` | Customer storefront |
| `admin/` | 3001 | TypeScript (`.tsx`) | `super-token` | Admin panel |
| `app/` | 3002 | TypeScript (`.tsx`) | `app-token` | Vendor & Vet dashboard |
| `room/` | 3003 | TypeScript (`.tsx`) | — | Twilio video calls |
| `server/` | env `PORT` | JavaScript (CommonJS) | — | Express + MongoDB API |

All frontends call `server/` via axios at `NEXT_PUBLIC_API_URL` with `withCredentials: true`. API routes are prefixed `/api/{auth,product,order,vendor,vet,room,adoptions,admin,app}`.

## Server Conventions (`server/`)

### Controller pattern
Controllers export named async functions with `(request, response, next)` — always spelled out, never abbreviated. Errors go through `next(new ErrorResponse("message", statusCode))` from `utils/ErrorResponse.js`. Don't wrap in try/catch unless doing payment or file I/O — the global `middleware/error.js` catches everything.

```js
// Example — server/controllers/product.js
module.exports.getProduct = async (request, response, next) => {
  const product = await Products.findOne({ slug: request.params.slug });
  if (!product) return next(new ErrorResponse("Product not found", 404));
  return response.status(200).json({ success: true, product });
};
```

### Response format
Always return `{ success: true, ... }`. Data goes in a domain-named key (`product`, `orders`, `user`), or `data` for simple messages. Auth endpoints set an httpOnly cookie then return `{ success: true }` with no body data.

### Route organization
In route files, **public routes go above** `router.use(protectXxx)`, **protected routes below**. Auth middleware: `protectUser` (cookie `token`), `protectVendor`/`protectVet` (cookie `app-token` or `Authorization` header), `protectAdmin` (cookie `super-token` with separate `ADMIN_TOKEN_SECRET`).

### Models
Files: `models/*.model.js`. Import with plural PascalCase (`const Products = require("../models/product.model")`). Mongoose schemas use `{ collection: "xxx-data", timestamps: true }`.

### File uploads
Use `utils/Upload.js` factory — pass a multer `storage` config, it adds a file filter (png/jpg/jpeg/pdf only). Multer middleware is defined in the controller file and exported alongside the handler. Uploads go to `server/uploads/{profile,product,adoptions,vendor,site-settings}/`.

### Email
`utils/SendMail.js` wraps Nodemailer. Templates are Handlebars `.hbs` files in `server/templates/`, read synchronously at module load with `fs.readFileSync`, compiled per-request with `handlebars.compile(template)(data)`.

### Payment (SSLCommerz)
`utils/Payment.js` exports `createPaymentRequest()` and `validatePayment()`. Flow: create order in DB → call `createPaymentRequest()` → save `paymentSessionKey` → return `GatewayPageURL` to frontend. SSLCommerz POSTs back to `/api/{order,vet/appointment}/validate` → validate with `val_id` → update order → redirect to frontend. The transaction ID is passed via `value_a`. Currency is always BDT.

### ID generation
`utils/GenerateId.js` has `generateRandomId(length)` (alphanumeric) and `generateRoomId()` (xxx-xxxx-xxx format for Twilio rooms).

## Frontend Conventions

### `client/` (Customer — JavaScript)
- Plain `.jsx` files, no TypeScript, no type checking.
- **Custom UI components** in `src/components/ui/` (button, input, select, etc.) — not shadcn.
- **No form library** — uses raw `useState` + event handlers.
- **Toast**: `react-hot-toast` — imperative `toast.success()` / `toast.error()`.
- **Auth context**: `src/components/providers/AuthProvider.jsx` — exposes `user`, `setUser`, `fetchUser`.
- **Axios**: `src/lib/axiosInstance.jsx` — no interceptors beyond default.
- Layout has `<Navbar>` and `<Footer>` wrapping all pages.

### `admin/` and `app/` (Admin & Vendor/Vet — TypeScript)
- TypeScript `.tsx`, but builds suppress TS and ESLint errors (`ignoreBuildErrors: true`).
- **shadcn/ui** components in `components/ui/` — Radix primitives, `class-variance-authority`, `tailwind-merge`.
- **Forms**: `react-hook-form` + `@hookform/resolvers/zod` + shadcn `<Form>` wrapper. Schemas in `schema/*.tsx`.
- **Toast**: shadcn toast via `hooks/use-toast.ts` — call `toast({ title, description, variant })`.
- **Axios**: `lib/axios.tsx` — adds `Cache-Control: no-cache` headers via interceptor.
- Login page is the root `/`; dashboard is under `/dashboard/...`.
- `app/` middleware checks `decodedToken.type` to gate `/dashboard/vet` routes to vet-only.

### `room/` (Video — TypeScript)
- Next.js 15 + React 19 + Tailwind v4 (CSS-first config, not `tailwind.config.ts`).
- Twilio Video SDK — room name comes from `?room=` query param, validated against appointment DB records.

## Key Cross-Cutting Rules

1. **Axios base URL**: Always use the configured axios instance (`import axios from "@/lib/axios"` or `@/src/lib/axiosInstance`), never raw `axios` or hardcoded URLs.
2. **Cookie names matter**: `token` (users), `app-token` (vendors/vets), `super-token` (admin). Mismatched cookies = silent 401.
3. **All static uploads** served at `/uploads/{type}` via `express.static` in `server.js`.
4. **Swagger docs** available at `/api-docs` on the server (configured in `config/swagger.js`).
5. **Utility filenames** are PascalCase (`ErrorResponse.js`, `SendMail.js`, `Payment.js`, `GeneratePDF.js`).
6. **Model filenames** are kebab-case (`product.model.js`, `adoption-order.model.js`).
7. When adding a new API route: create controller in `controllers/`, add route in `routes/`, register in `server.js` with `app.use("/api/xxx", require("./routes/xxx"))`.
