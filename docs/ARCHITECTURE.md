# Architecture

High-level architecture

This is a client-side single page application (SPA). The project uses React for UI and React Context for global state.

Key layers:
- Presentation: components in `src/components` and `src/pages`
- Routing: `src/router/AppRouter.jsx` (React Router v7)
- State & data fetching: Context providers in `src/context`:
  - `ProductProvider` handles fetching product lists, filtering, search, and product detail fetching from json-server.
  - `CartProvider` manages cart items, quantities and totals, persisting cart changes to json-server.
  - `AuthProvider` implements mock register/login flows and uses `localStorage` for session.

Data flow:
- `ProductProvider` fetches from `http://localhost:3000/products` and exposes `products`, `categories`, filter setters and `fetchProductDetail`.
- UI components call Context methods (for example `addToCart` from `CartProvider`) which update json-server via fetch requests and then re-fetch or patch as needed.

Routing:
- Public routes include `/`, `/products`, `/products/:id`, `/cart`, `/login`, `/register`.
- Admin routes are mounted under `/admin` (nested routes).

Error handling & UX:
- Fetch calls check `res.ok` and log errors to console; minimal user-friendly error UI is present in some pages.

Testing & builds:
- No unit tests currently in repository.
- Production build: `npm run build` (Vite build output in `dist/`)

Security considerations:
- Authentication and user data are mock implementations — not secure for production.
- Avoid storing real user credentials in `db.json`.

