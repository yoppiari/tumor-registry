# WHO Classification Tree Selector

Hierarchical tree selector components for WHO Classification of Tumours of Soft Tissue and Bone (5th Edition). Provides an intuitive, feature-rich interface for selecting tumor classifications in the Indonesian Musculoskeletal Tumor Registry.

## Features

- **Hierarchical Tree Display**: Organized by category with expandable/collapsible nodes
- **Full-Text Search**: Search by name, category, or ICD-O-3 code
- **Recent Selections**: Automatically saves last 5 selections (persisted in localStorage)
- **Favorites/Bookmarks**: Star frequently used classifications
- **Keyboard Navigation**: Navigate using arrow keys and Enter
- **ICD-O-3 Codes**: Display international classification codes
- **Malignancy Indicators**: Visual badges for benign/malignant tumors
- **Mobile-Friendly**: Touch-optimized expand/collapse controls
- **Loading States**: Skeleton screens and error handling
- **React Query Integration**: Automatic caching and refetching

## Components

### WhoClassificationTree (Main Component)

The primary component that handles all functionality.

```typescript
import { WhoClassificationTree } from '@/components/classifications';

<WhoClassificationTree
  tumorType="BONE" // or "SOFT_TISSUE"
  selectedId={selectedClassificationId}
  onSelect={(classification) => {
    console.log('Selected:', classification);
    // Handle selection
  }}
  searchable={true}
  showCodes={true}
  showRecent={true}
  showFavorites={true}
  enableKeyboardNav={true}
/>
```

### BoneTumorTree (Specialized Wrapper)

Pre-configured for bone tumors with helpful header.

```typescript
import { BoneTumorTree } from '@/components/classifications';

<BoneTumorTree
  selectedId={selectedId}
  onSelect={handleSelect}
/>
```

### SoftTissueTumorTree (Specialized Wrapper)

Pre-configured for soft tissue tumors with helpful header.

```typescript
import { SoftTissueTumorTree } from '@/components/classifications';

<SoftTissueTumorTree
  selectedId={selectedId}
  onSelect={handleSelect}
/>
```

## Props

### WhoClassificationTreeProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tumorType` | `'BONE' \| 'SOFT_TISSUE'` | Required | Type of tumor classification to display |
| `selectedId` | `string` | `undefined` | ID of currently selected classification |
| `onSelect` | `(classification: WhoClassification) => void` | Required | Callback when a classification is selected |
| `searchable` | `boolean` | `true` | Enable search functionality |
| `showCodes` | `boolean` | `true` | Display ICD-O-3 codes |
| `showRecent` | `boolean` | `true` | Show recent selections tab |
| `showFavorites` | `boolean` | `true` | Show favorites tab |
| `enableKeyboardNav` | `boolean` | `true` | Enable keyboard navigation |
| `className` | `string` | `''` | Additional CSS classes |

## Types

### WhoClassification

```typescript
interface WhoClassification {
  id: string;
  code?: string;
  name: string;
  category: string;
  subcategory?: string;
  diagnosis?: string;
  icdO3Code?: string;
  isMalignant?: boolean;
  sortOrder?: number;
  parentId?: string;
  children?: WhoClassification[];
}
```

## Usage Examples

### Basic Usage

```tsx
import { useState } from 'react';
import { BoneTumorTree } from '@/components/classifications';

export function TumorSelectionForm() {
  const [selectedId, setSelectedId] = useState<string>();

  return (
    <div>
      <h2>Select Tumor Classification</h2>
      <BoneTumorTree
        selectedId={selectedId}
        onSelect={(classification) => {
          setSelectedId(classification.id);
          console.log('Selected:', classification.name);
        }}
      />
    </div>
  );
}
```

### With React Hook Form

```tsx
import { Controller, useForm } from 'react-hook-form';
import { BoneTumorTree } from '@/components/classifications';

interface FormData {
  tumorClassificationId: string;
}

export function PatientDiagnosisForm() {
  const { control, handleSubmit } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log('Form data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="tumorClassificationId"
        control={control}
        rules={{ required: 'Please select a tumor classification' }}
        render={({ field, fieldState }) => (
          <div>
            <label>WHO Classification *</label>
            <BoneTumorTree
              selectedId={field.value}
              onSelect={(classification) => {
                field.onChange(classification.id);
              }}
            />
            {fieldState.error && (
              <p className="text-red-600 text-sm">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Dynamic Tumor Type

```tsx
import { useState } from 'react';
import { WhoClassificationTree } from '@/components/classifications';

export function DynamicTumorSelector() {
  const [tumorType, setTumorType] = useState<'BONE' | 'SOFT_TISSUE'>('BONE');
  const [selectedId, setSelectedId] = useState<string>();

  return (
    <div>
      <div className="mb-4">
        <label>Tumor Type</label>
        <select
          value={tumorType}
          onChange={(e) => {
            setTumorType(e.target.value as 'BONE' | 'SOFT_TISSUE');
            setSelectedId(undefined); // Reset selection when type changes
          }}
        >
          <option value="BONE">Bone Tumor</option>
          <option value="SOFT_TISSUE">Soft Tissue Tumor</option>
        </select>
      </div>

      <WhoClassificationTree
        tumorType={tumorType}
        selectedId={selectedId}
        onSelect={(classification) => setSelectedId(classification.id)}
      />
    </div>
  );
}
```

### Modal/Dialog Integration

```tsx
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { BoneTumorTree, WhoClassification } from '@/components/classifications';

export function ClassificationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<WhoClassification | null>(null);

  const handleSelect = (classification: WhoClassification) => {
    setSelected(classification);
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        {selected ? selected.name : 'Select Classification'}
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <Dialog.Panel className="max-w-3xl mx-auto bg-white rounded-lg p-6">
          <Dialog.Title>Select WHO Classification</Dialog.Title>
          <BoneTumorTree
            selectedId={selected?.id}
            onSelect={handleSelect}
          />
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
```

## Custom Hooks

### useWhoClassifications

Fetch and manage classification data with React Query.

```typescript
import { useWhoClassifications } from '@/components/classifications';

const { data, isLoading, categories, getById } = useWhoClassifications({
  tumorType: 'BONE',
  category: 'Osteogenic tumors', // Optional filter
  isMalignant: true, // Optional filter
});
```

### useClassificationSearch

Handle search and filtering logic.

```typescript
import { useClassificationSearch } from '@/components/classifications';

const {
  searchQuery,
  setSearchQuery,
  filteredCategories,
  searchResults,
  resultCount,
} = useClassificationSearch({
  classifications: data?.raw || [],
  categories: categories || [],
  searchableFields: ['name', 'category', 'icdO3Code'],
});
```

### useRecentSelections

Manage recent selections with localStorage persistence.

```typescript
import { useRecentSelections } from '@/components/classifications';

const { recents, addRecent, clearRecents, hasRecents } = useRecentSelections('BONE');

// Add to recents
addRecent('classification-id', 'Osteosarcoma', 'Osteogenic tumors');
```

### useFavorites

Manage favorite classifications with localStorage persistence.

```typescript
import { useFavorites } from '@/components/classifications';

const { favorites, isFavorite, toggleFavorite, hasFavorites } = useFavorites('BONE');

// Toggle favorite
toggleFavorite('classification-id', 'Osteosarcoma', 'Osteogenic tumors');

// Check if favorited
if (isFavorite('classification-id')) {
  console.log('This is a favorite!');
}
```

## API Integration

The component expects these API endpoints:

```typescript
// Bone tumors
GET /api/v1/who-bone-tumors
Response: {
  data: [
    {
      id: "uuid",
      category: "Osteogenic tumors",
      subcategory: "Malignant",
      diagnosis: "Osteosarcoma",
      icdO3Code: "9180/3",
      isMalignant: true,
      sortOrder: 1
    },
    ...
  ],
  meta: { total: 57 }
}

// Soft tissue tumors
GET /api/v1/who-soft-tissue-tumors
Response: {
  data: [
    {
      id: "uuid",
      category: "Adipocytic tumors",
      subcategory: "Malignant",
      diagnosis: "Liposarcoma",
      icdO3Code: "8850/3",
      isMalignant: true,
      sortOrder: 1
    },
    ...
  ],
  meta: { total: 68 }
}
```

## Styling

The component uses Tailwind CSS for styling. Ensure your project has Tailwind configured with the following colors:

- Blue (primary)
- Red (malignant indicators)
- Green (benign indicators)
- Gray (neutral elements)
- Yellow (favorites/highlights)
- Purple (soft tissue variant)

## Performance

- **React Query Caching**: Data is cached for 5 minutes (stale time)
- **Client-Side Filtering**: Search and filtering happens client-side for instant results
- **Lazy Rendering**: Only expanded categories render their children
- **LocalStorage**: Recent and favorites are persisted for fast subsequent loads

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires ES6+ support

## Accessibility

- Keyboard navigation support
- ARIA labels on interactive elements
- Focus management
- Screen reader friendly

## License

Part of the Indonesian Musculoskeletal Tumor Registry (INAMSOS) project.
