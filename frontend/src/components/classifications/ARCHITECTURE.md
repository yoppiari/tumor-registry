# Architecture Overview

## Component Hierarchy

```
WhoClassificationTree (Main Container)
├── ClassificationSearch (Search input)
├── Tabs (All | Recent | Favorites)
├── Controls (Expand All | Collapse All)
├── Tree Container
│   ├── CategoryNode (Expandable category header)
│   │   └── ClassificationNode[] (Individual classifications)
│   │       ├── Name & Details
│   │       ├── Malignancy Badge
│   │       ├── ICD-O-3 Code
│   │       ├── Selection Indicator
│   │       └── Favorite Button
│   └── ... (more categories)
└── SelectedClassificationDisplay (When selected)
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      User Interaction                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              WhoClassificationTree Component                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  React Query (useWhoClassifications)                  │  │
│  │  ├── Cache Management                                 │  │
│  │  ├── Auto-refetch on stale                            │  │
│  │  └── Error/Loading states                             │  │
│  └───────────────────────────────────────────────────────┘  │
│                              │                              │
│  ┌───────────────────────────▼────────────────────────────┐ │
│  │  Data Transformation Layer                            │ │
│  │  ├── Group by category                                │ │
│  │  ├── Build hierarchical structure                     │ │
│  │  └── Create lookup maps                               │ │
│  └───────────────────────────────────────────────────────┘ │
│                              │                              │
│  ┌───────────────────────────▼────────────────────────────┐ │
│  │  Search & Filter (useClassificationSearch)            │ │
│  │  ├── Multi-field search                               │ │
│  │  ├── Real-time filtering                              │ │
│  │  └── Auto-expand matching categories                  │ │
│  └───────────────────────────────────────────────────────┘ │
│                              │                              │
│  ┌───────────────────────────▼────────────────────────────┐ │
│  │  State Management                                      │ │
│  │  ├── Expanded categories (useState)                   │ │
│  │  ├── Active tab (useState)                            │ │
│  │  ├── Recent selections (localStorage)                 │ │
│  │  └── Favorites (localStorage)                         │ │
│  └───────────────────────────────────────────────────────┘ │
│                              │                              │
│                              ▼                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Render Tree (CategoryNode + ClassificationNode)     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    onSelect Callback                        │
│              (Parent Form receives selection)               │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
/components/classifications/
│
├── index.ts                          # Public exports
├── types.ts                          # TypeScript interfaces
├── README.md                         # User documentation
├── INTEGRATION.md                    # Integration guide
├── ARCHITECTURE.md                   # This file
│
├── WhoClassificationTree.tsx         # Main component (400+ lines)
├── BoneTumorTree.tsx                 # Bone tumor wrapper (~30 lines)
├── SoftTissueTumorTree.tsx           # Soft tissue wrapper (~30 lines)
│
├── ClassificationNode.tsx            # Individual node component
├── ClassificationSearch.tsx          # Search input component
├── SelectedClassificationDisplay.tsx # Selected state display
│
├── hooks/
│   ├── index.ts                      # Hook exports
│   ├── useWhoClassifications.ts      # Data fetching hook
│   ├── useClassificationSearch.ts    # Search logic hook
│   ├── useRecentSelections.ts        # Recent selections hook
│   └── useFavorites.ts               # Favorites management hook
│
├── examples/
│   ├── index.ts
│   ├── BasicExample.tsx              # Simple usage
│   ├── FormIntegrationExample.tsx    # React Hook Form integration
│   └── AdvancedExample.tsx           # Multi-step wizard
│
└── __tests__/
    └── WhoClassificationTree.test.tsx # Jest/RTL tests
```

## Key Design Decisions

### 1. React Query for Data Fetching

**Why?**
- Automatic caching and stale-while-revalidate
- Built-in loading and error states
- Deduplicates requests
- Reduces server load

**Configuration:**
```typescript
staleTime: 5 minutes   // Data fresh for 5 min
gcTime: 10 minutes     // Keep in cache for 10 min
retry: 2               // Retry failed requests twice
```

### 2. LocalStorage for Persistence

**Why?**
- No server storage needed
- Instant access
- Survives page refreshes
- Privacy-friendly (client-side only)

**Storage Keys:**
- `who_recent_bone_classifications`
- `who_recent_soft_tissue_classifications`
- `who_favorites_bone_classifications`
- `who_favorites_soft_tissue_classifications`

### 3. Hierarchical Category Structure

**Why?**
- Reduces visual clutter (100+ items)
- Logical grouping by WHO categories
- Better findability
- Follows medical classification standards

**Implementation:**
```typescript
CategoryNode {
  id: string
  name: string (category name)
  isCategory: true
  children: WhoClassification[]
}
```

### 4. Client-Side Search

**Why?**
- Instant results (no API delay)
- Works offline
- Reduces server load
- Better UX for small datasets (<200 items)

**Searchable Fields:**
- Name/Diagnosis
- Category
- ICD-O-3 Code

### 5. Compound Component Pattern

**Why?**
- Flexibility for different use cases
- Easy to customize
- Separation of concerns
- Testable sub-components

**Structure:**
```typescript
// Public API
<WhoClassificationTree />     // Full-featured
<BoneTumorTree />             // Specialized wrapper
<SoftTissueTumorTree />       // Specialized wrapper

// Internal components
<ClassificationNode />         // Reusable
<CategoryNode />               // Reusable
<ClassificationSearch />       // Reusable
```

## State Management Strategy

### Component-Level State (useState)

Used for:
- `expandedCategories: Set<string>` - Which categories are open
- `activeTab: 'tree' | 'recents' | 'favorites'` - Active tab
- `focusedIndex: number` - For keyboard navigation

### Derived State (useMemo)

Used for:
- `filteredCategories` - Search results
- `searchResults` - Matching classifications

### Persistent State (localStorage)

Used for:
- Recent selections (max 5)
- Favorited classifications

### Server State (React Query)

Used for:
- Classification data from API
- Automatic caching and invalidation

## Performance Optimizations

### 1. Lazy Rendering
- Only expanded categories render children
- Reduces initial DOM size from 125+ to ~10 elements

### 2. Memoization
- `useMemo` for expensive calculations (filtering, grouping)
- `useCallback` for event handlers

### 3. Virtualization (Future)
- Could add `react-virtual` for very large lists
- Current size (<200 items) doesn't require it yet

### 4. Code Splitting
- Component can be lazy-loaded: `lazy(() => import('./classifications'))`

### 5. Image/Icon Optimization
- Using Heroicons (tree-shakeable)
- SVG icons (small size)

## Accessibility Features

### 1. Keyboard Navigation
- Arrow keys: Navigate items
- Enter: Select classification
- Tab: Navigate UI elements
- Escape: Clear search (future)

### 2. ARIA Labels
- `aria-label` on buttons
- `aria-expanded` on category toggles
- `aria-selected` on selected items

### 3. Focus Management
- Visual focus indicators
- Logical tab order
- Focus trap in search (future)

### 4. Screen Reader Support
- Semantic HTML
- Descriptive button text
- Status announcements (future)

## Extension Points

### 1. Custom Filters

Add filter props:
```typescript
interface FilterOptions {
  malignant?: boolean;
  category?: string;
  icdCode?: string;
}
```

### 2. Bulk Selection

Add multi-select mode:
```typescript
interface MultiSelectProps {
  mode: 'single' | 'multiple';
  selectedIds: string[];
  onSelectMultiple: (ids: string[]) => void;
}
```

### 3. Export/Import Favorites

Add import/export buttons:
```typescript
const exportFavorites = () => {
  const data = localStorage.getItem('who_favorites_bone');
  downloadJSON(data, 'favorites.json');
};
```

### 4. Custom Renderers

Allow custom node rendering:
```typescript
interface CustomRenderProps {
  renderNode?: (classification: WhoClassification) => ReactNode;
  renderCategory?: (category: CategoryNode) => ReactNode;
}
```

## Testing Strategy

### Unit Tests
- Individual hook behavior
- Component rendering
- User interactions (click, type, etc.)
- LocalStorage operations

### Integration Tests
- Full component with React Query
- Form integration
- Search and filter flows

### E2E Tests (Future)
- Complete user workflows
- Cross-browser testing
- Mobile touch interactions

## Future Enhancements

1. **Offline Support**: Service Worker + IndexedDB
2. **Internationalization**: Indonesian + English labels
3. **Annotations**: User notes on classifications
4. **Comparison Mode**: Compare multiple classifications
5. **History Timeline**: View all past selections
6. **Smart Suggestions**: ML-based recommendations
7. **Voice Search**: Speech-to-text input
8. **Print Support**: Printer-friendly layouts
9. **Analytics**: Track popular selections
10. **Collaborative Favorites**: Share with team

## Dependencies

### Required
- `react` ^18.2.0
- `react-dom` ^18.2.0
- `@tanstack/react-query` ^5.8.4
- `@heroicons/react` ^2.0.18

### Optional (for examples)
- `react-hook-form` ^7.47.0
- `@headlessui/react` ^1.7.17

### Dev Dependencies (for tests)
- `@testing-library/react`
- `@testing-library/jest-dom`
- `@testing-library/user-event`
- `jest`

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari 14+
- Chrome Mobile 90+

**Features requiring polyfills:**
- `Set` (ES6) - Built-in for all modern browsers
- `localStorage` - Available everywhere
- `async/await` - Transpiled by Next.js

## License & Attribution

Part of the Indonesian Musculoskeletal Tumor Registry (INAMSOS)
- WHO Classification data: © WHO 2020
- Component code: MIT License
