# Components Reference

This file lists main components and their responsibilities.

Layouts
- `src/layouts/Navbar.jsx` — top navigation with search, auth links, cart icon and total items badge. Uses `AuthContext`, `CartContext`, and `ProductContext` for search.
- `src/layouts/Footer.jsx` — footer with static links and newsletter form (UI only).

Pages
- `src/pages/Home.jsx` — Landing page showing hero, trending categories, and a product grid (first 8 items). Uses `ProductContext`.
- `src/pages/Product.jsx` — Product listing with filter sidebar, sorting, grid/list view toggle, pagination, and search result integration.
- `src/pages/ProductDetial.jsx` — Single product detail page with image gallery, variant controls (colors), quantity selector, and add-to-cart.
- `src/pages/Cart.jsx` — Cart summary and product list (uses `CartListProduct` for each item).

Reusable components
- `src/components/ProductCard.jsx` — Compact product card used on home and grid views.
- `src/components/ProductListCard.jsx` — List/grid product card used on product listing; supports `showStyle` prop to adapt layout.
- `src/components/CartListProduct.jsx` — Cart row component with quantity controls and remove action.

Contexts
- `src/context/ProductProvider.jsx` — Provides `products`, `categories`, `productDetail`, filtering, sorting and search handlers.
- `src/context/CartProvider.jsx` — Provides cart CRUD operations, totals, and syncs with `http://localhost:3000/carts`.
- `src/context/AuthProvider.jsx` — Mock authentication wrapper with `register`, `login`, `logout` and `isAuthenticated` state.

API / Data
- Mock API served by `json-server` from `db.json` with endpoints: `/products`, `/users`, `/carts`, `/orders`.

