# Project Overview

Project: eTrade (ProjectEtec2)

Type: React + Vite e-commerce demo (single-repo SPA)

Short description:
This repository contains a small e-commerce frontend built with React and Vite. It uses local JSON-server (db.json) as a mock backend for products, users, carts and orders. The UI uses Tailwind CSS classes and simple components for Product listing, product detail, cart management, and simple authentication flows (login/register via json-server).

Key features:
- Product listing with filtering, sorting, and pagination
- Product detail pages with image gallery and add-to-cart
- Cart management (add, update quantity, remove) persisted to json-server
- Simple auth flow (register/login) using json-server users
- Admin routes scaffolded under `/admin` (Dashboard, Products, Users, Orders)

Stack & tools:
- React 19
- Vite + @vitejs/plugin-react
- React Router DOM v7
- json-server (mock REST API)
- Tailwind CSS
- ESLint + related plugins

Important files and locations:
- `db.json` — mock API data for users, products, carts, orders
- `package.json` — scripts and dependencies (dev: runs Vite + json-server concurrently)
- `src/main.jsx` — app bootstrapping and context providers
- `src/router/AppRouter.jsx` — application routes
- `src/context` — React Contexts: `AuthProvider`, `ProductProvider`, `CartProvider`
- `src/components` — presentational components: `ProductCard`, `ProductListCard`, `CartListProduct`
- `src/pages` — page-level components: `Home`, `Product`, `ProductDetial`, `Cart`, `Login`, `Register`, `NotFound`, and `Admin` pages
- `src/layouts` — `Navbar` and `Footer`

Runtime:
The project expects `json-server` to run at `http://localhost:3000` and Vite dev server (default `http://localhost:5173`). The `dev` npm script runs both concurrently.

Limitations & notes:
- Authentication is a mock flow backed by `db.json` and `localStorage` for a simple demo. Not secure for production.
- All data is in `db.json` and modified by json-server; be mindful about destructive operations.

