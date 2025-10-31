# Search Functionality

## Overview

The search functionality allows users to search for products by name and category. When a user searches for something, they are redirected to the products page where only the matching products are displayed.

## Features

### Search by Name and Category

- Users can search for products using the search bar in the navigation
- Search works for both product names and categories
- Search is case-insensitive
- Partial matches are supported

### User Experience

- Search input has a search icon for better visual feedback
- When a search is performed, users are automatically redirected to the products page
- Search results show a clear indication of what was searched
- A "Clear search" button allows users to return to viewing all products
- If no results are found, a helpful message is displayed with an option to browse all products

### Integration with Existing Filters

- Search works seamlessly with existing category, price, and rating filters
- All filters can be combined with search results
- Pagination is preserved and works with search results

## How to Use

1. **Search for Products:**

   - Type your search term in the search bar in the navigation
   - Press Enter or click the search icon
   - You'll be redirected to the products page with filtered results

2. **Clear Search:**

   - Click the "Clear search" button next to the search results
   - Or click "Browse All Products" if no results are found

3. **Combine with Filters:**
   - Use the category, price, and rating filters on the left sidebar
   - These will work together with your search results

## Technical Implementation

### Components Modified:

- `src/context/ProductProvider.jsx` - Added search state and filtering logic
- `src/layouts/Navbar.jsx` - Added search form handling and navigation
- `src/pages/Product.jsx` - Added search results display and clear functionality

### Search Logic:

```javascript
const searchMatch =
  !searchQuery ||
  product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  product.category.toLowerCase().includes(searchQuery.toLowerCase());
```

### State Management:

- `searchQuery` - Stores the current search term
- `handleSearch(query)` - Sets the search query and triggers filtering
- `clearSearch()` - Clears the search and shows all products

## Example Searches

- Search for "iPhone" to find all iPhone products
- Search for "Laptops" to find all laptop products
- Search for "Samsung" to find Samsung products
- Search for "Pro" to find products with "Pro" in the name

The search functionality is now fully integrated and ready to use!
