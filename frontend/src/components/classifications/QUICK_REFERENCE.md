# Quick Reference Card

## Import

```tsx
import {
  BoneTumorTree,
  SoftTissueTumorTree,
  WhoClassificationTree
} from '@/components/classifications';
```

## Basic Usage

```tsx
<BoneTumorTree
  selectedId={id}
  onSelect={(classification) => {
    // Handle selection
  }}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tumorType` | `'BONE' \| 'SOFT_TISSUE'` | Required* | Tumor type (*not needed for wrappers) |
| `selectedId` | `string` | `undefined` | Currently selected ID |
| `onSelect` | `(c: WhoClassification) => void` | Required | Selection callback |
| `searchable` | `boolean` | `true` | Enable search |
| `showCodes` | `boolean` | `true` | Show ICD-O-3 codes |
| `showRecent` | `boolean` | `true` | Show recent tab |
| `showFavorites` | `boolean` | `true` | Show favorites tab |
| `enableKeyboardNav` | `boolean` | `true` | Keyboard navigation |

## TypeScript Types

```tsx
interface WhoClassification {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  diagnosis?: string;
  icdO3Code?: string;
  isMalignant?: boolean;
}
```

## Custom Hooks

```tsx
// Fetch classifications
const { categories, getById, isLoading } = useWhoClassifications({
  tumorType: 'BONE'
});

// Search
const { searchQuery, setSearchQuery, filteredCategories } =
  useClassificationSearch({ classifications, categories });

// Recent selections
const { recents, addRecent, clearRecents } = useRecentSelections('BONE');

// Favorites
const { favorites, isFavorite, toggleFavorite } = useFavorites('BONE');
```

## React Hook Form

```tsx
<Controller
  name="classificationId"
  control={control}
  rules={{ required: 'Required' }}
  render={({ field }) => (
    <BoneTumorTree
      selectedId={field.value}
      onSelect={(c) => field.onChange(c.id)}
    />
  )}
/>
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `↓` | Next item |
| `↑` | Previous item |
| `Enter` | Select item |
| `Tab` | Next UI element |

## LocalStorage Keys

- `who_recent_bone_classifications`
- `who_recent_soft_tissue_classifications`
- `who_favorites_bone_classifications`
- `who_favorites_soft_tissue_classifications`

## API Endpoints

```
GET /api/v1/who-bone-tumors
GET /api/v1/who-soft-tissue-tumors
```

## File Locations

```
/frontend/src/components/classifications/
├── BoneTumorTree.tsx           ← Use this for bone
├── SoftTissueTumorTree.tsx     ← Use this for soft tissue
├── WhoClassificationTree.tsx   ← Main component
├── README.md                   ← Full documentation
├── INTEGRATION.md              ← Integration guide
└── examples/                   ← Code examples
    ├── BasicExample.tsx
    ├── FormIntegrationExample.tsx
    └── AdvancedExample.tsx
```

## Common Patterns

### Display Selected

```tsx
{selectedClassification && (
  <div>
    <h4>{selectedClassification.name}</h4>
    <p>{selectedClassification.category}</p>
    {selectedClassification.icdO3Code && (
      <span>ICD-O-3: {selectedClassification.icdO3Code}</span>
    )}
  </div>
)}
```

### Dynamic Tumor Type

```tsx
const [type, setType] = useState<'BONE' | 'SOFT_TISSUE'>('BONE');

<select onChange={(e) => setType(e.target.value)}>
  <option value="BONE">Bone</option>
  <option value="SOFT_TISSUE">Soft Tissue</option>
</select>

<WhoClassificationTree
  tumorType={type}
  selectedId={id}
  onSelect={handleSelect}
/>
```

### Reset Selection

```tsx
<button onClick={() => setSelectedId(undefined)}>
  Clear Selection
</button>
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Not loading | Check API endpoint accessibility |
| Recent not saving | Check localStorage permissions |
| Search not working | Ensure `searchable={true}` |
| Styles broken | Verify Tailwind CSS is configured |

## React Query Setup

Ensure provider exists in `_app.tsx` or layout:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
```

## Performance Tips

1. **Use wrappers**: `BoneTumorTree` instead of `WhoClassificationTree`
2. **Lazy load**: `lazy(() => import('./classifications'))`
3. **Memoize callbacks**: Use `useCallback` for `onSelect`
4. **Cache hit**: First load ~500ms, subsequent <50ms

## Links

- 📖 [Full Documentation](./README.md)
- 🔧 [Integration Guide](./INTEGRATION.md)
- 🏗️ [Architecture](./ARCHITECTURE.md)
- 📊 [Summary](./SUMMARY.md)
- 💻 [Examples](./examples/)

---

**Need Help?** Check `README.md` or `INTEGRATION.md`
