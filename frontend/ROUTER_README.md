# DiskiData - TanStack Router Implementation

## 🎯 Overview
The application now uses **TanStack Router** for navigation between the three main sections: Players, Clubs, and Competitions.

## 📁 Project Structure

```
frontend/src/
├── App.jsx                    # Router provider entry point  
├── router.jsx                 # Router configuration
├── components/
│   ├── Navigation.jsx         # Navigation bar with route links
│   └── dialogs/
│       ├── PlayerDialog.jsx
│       ├── ClubDialog.jsx
│       └── CompetitionDialog.jsx
└── pages/
    ├── SearchPage.jsx         # Shared search component
    ├── PlayersPage.jsx        # /players route
    ├── ClubsPage.jsx          # /clubs route
    └── CompetitionsPage.jsx   # /competitions route
```

## 🛣️ Routes

| Route           | Component          | Description                    |
|-----------------|--------------------|---------------------------------|
| `/`             | Redirect           | Redirects to `/players`         |
| `/players`      | PlayersPage        | Search and view player profiles |
| `/clubs`        | ClubsPage          | Search and view club squads     |
| `/competitions` | CompetitionsPage   | Search and view competitions    |

## 🔧 Key Features

### 1. **URL-Based Navigation**
- Each section now has its own URL
- Users can bookmark specific pages
- Browser back/forward buttons work correctly
- Clean, semantic URLs (e.g., `/players`, `/clubs`)

### 2. **Shared Search Component**
- `SearchPage.jsx` is a reusable component that accepts a `searchType` prop
- Handles search logic, results display, and modal dialogs
- Reduces code duplication across pages

### 3. **Navigation Component**
- Persistent navigation bar across all pages
- Active route highlighting
- Material UI Button components with route-aware styling

### 4. **Root Layout**
- Consistent header and navigation on all pages
- Centralized layout management via TanStack Router's root route

## 🚀 How It Works

1. **App.jsx** initializes the router with `<RouterProvider router={router} />`
2. **router.jsx** defines all rou and their components
3. **Root route** provides the layout wrapper (Navigation + Outlet)
4. **Page components** render the appropriate `SearchPage` with the correct `searchType`
5. **Navigation** component uses `<Link>` from TanStack Router for client-side navigation

## 📝 Usage

```javascript
// Navigating programmatically
import { useNavigate } from '@tanstack/react-router';

const navigate = useNavigate();
navigate({ to: '/players' });
```

```javascript
// Using Link component
import { Link } from '@tanstack/react-router';

<Link to="/clubs">Go to Clubs</Link>
```

## 🎨 Benefits

- ✅ **Better UX**: URL changes reflect the current page
- ✅ **SEO Friendly**: Each page has its own URL
- ✅ **Maintainable**: Clean separation of concerns
- ✅ **Type-Safe**: TanStack Router provides excellent TypeScript support
- ✅ **Performance**: Code splitting and lazy loading support
- ✅ **Developer Experience**: Better debugging and navigation flow

## 🔄 Migration Notes

**Before (Tabs):**
- Navigation via Material UI Tabs
- State-based routing (`searchType` state)
- No URL changes
- Single component handling all logic

**After (TanStack Router):**
- Navigation via router links
- URL-based routing
- Proper browser history
- Modular page components

## 🛠️ Development

The router automatically handles:
- 404 pages (can be added as a catch-all route)
- Redirects (root `/` redirects to `/players`)
- Nested routes (can be extended for future features)
- Search params (can be added for query preservation)

## 📦 Dependencies

```json
{
  "@tanstack/react-router": "^latest"
}
```

## 🎯 Future Enhancements

- Add search query to URL params (e.g., `/players?q=messi`)
- Implement lazy loading for page components
- Add route-based analytics
- Create nested routes for player/club details pages
- Add transition animations between routes
