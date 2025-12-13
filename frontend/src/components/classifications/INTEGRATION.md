# Integration Guide

## Quick Start: Integrating WHO Classification Tree into Patient Forms

### Step 1: Install (Already Done)

All components are ready to use in:
```
/frontend/src/components/classifications/
```

### Step 2: Import in Your Form

Replace the existing `WHOClassificationPicker` with the new tree component:

```tsx
// In your form component (e.g., Section4Diagnostics.tsx)
import { BoneTumorTree, SoftTissueTumorTree } from '@/components/classifications';
```

### Step 3: Replace Existing Picker

**Before:**
```tsx
import { WHOClassificationPicker } from '../components/WHOClassificationPicker';

<WHOClassificationPicker
  type="bone"
  selectedId={selectedId}
  onSelect={(id, classification) => {
    // handle selection
  }}
/>
```

**After:**
```tsx
import { BoneTumorTree } from '@/components/classifications';

<BoneTumorTree
  selectedId={selectedId}
  onSelect={(classification) => {
    // handle selection - note: receives full classification object
    setFieldValue('classificationId', classification.id);
    setFieldValue('classification', classification);
  }}
/>
```

### Step 4: Update Form State

The new component returns the full `WhoClassification` object:

```tsx
interface FormState {
  // Old approach
  classificationId: string;

  // Enhanced approach - store full object for better UX
  classification: WhoClassification;
}
```

### Step 5: Wrapper for Existing Code Compatibility

If you want to maintain existing interfaces without changing much code:

```tsx
import { BoneTumorTree, WhoClassification } from '@/components/classifications';

function WHOClassificationWrapper({ type, selectedId, onSelect }) {
  const Component = type === 'bone' ? BoneTumorTree : SoftTissueTumorTree;

  return (
    <Component
      selectedId={selectedId}
      onSelect={(classification: WhoClassification) => {
        // Convert to old callback format if needed
        onSelect(classification.id, classification);
      }}
    />
  );
}
```

## Example: Updating Section4Diagnostics.tsx

Here's a complete example of integrating into an existing patient form section:

```tsx
import React from 'react';
import { Controller } from 'react-hook-form';
import { BoneTumorTree, SoftTissueTumorTree, WhoClassification } from '@/components/classifications';

interface Section4Props {
  control: any;
  watch: any;
  setValue: any;
}

export function Section4Diagnostics({ control, watch, setValue }: Section4Props) {
  const tumorType = watch('tumorType'); // 'BONE' or 'SOFT_TISSUE'

  return (
    <div className="space-y-6">
      {/* Tumor Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tumor Type
        </label>
        <Controller
          name="tumorType"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              onChange={(e) => {
                field.onChange(e);
                // Reset classification when tumor type changes
                setValue('classificationId', '');
              }}
              className="block w-full rounded-md border-gray-300"
            >
              <option value="BONE">Bone Tumor</option>
              <option value="SOFT_TISSUE">Soft Tissue Tumor</option>
            </select>
          )}
        />
      </div>

      {/* WHO Classification */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          WHO Classification <span className="text-red-600">*</span>
        </label>
        <Controller
          name="classificationId"
          control={control}
          rules={{ required: 'Please select a tumor classification' }}
          render={({ field, fieldState }) => (
            <div>
              {tumorType === 'BONE' ? (
                <BoneTumorTree
                  selectedId={field.value}
                  onSelect={(classification: WhoClassification) => {
                    field.onChange(classification.id);
                    // Optionally store the full classification object
                    setValue('classificationName', classification.name);
                    setValue('classificationCategory', classification.category);
                  }}
                />
              ) : (
                <SoftTissueTumorTree
                  selectedId={field.value}
                  onSelect={(classification: WhoClassification) => {
                    field.onChange(classification.id);
                    setValue('classificationName', classification.name);
                    setValue('classificationCategory', classification.category);
                  }}
                />
              )}
              {fieldState.error && (
                <p className="mt-2 text-sm text-red-600">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />
      </div>

      {/* Diagnosis Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Diagnosis Date
        </label>
        <Controller
          name="diagnosisDate"
          control={control}
          render={({ field }) => (
            <input
              type="date"
              {...field}
              className="block w-full rounded-md border-gray-300"
            />
          )}
        />
      </div>
    </div>
  );
}
```

## Migration Checklist

- [ ] Import new components from `@/components/classifications`
- [ ] Replace `WHOClassificationPicker` with `BoneTumorTree` or `SoftTissueTumorTree`
- [ ] Update `onSelect` callback to handle full classification object
- [ ] Test selection behavior
- [ ] Test search functionality
- [ ] Test recent selections persistence
- [ ] Test favorites feature
- [ ] Verify form validation still works
- [ ] Update any TypeScript types if needed
- [ ] Test on mobile devices (touch interactions)
- [ ] Review accessibility (keyboard navigation)

## Advanced Features to Leverage

### 1. Pre-populate Recent Selections

Users will automatically see their last 5 selections in a "Recent" tab - no extra code needed!

### 2. Favorites for Common Diagnoses

Users can star frequently-used classifications for quick access.

### 3. Smart Search

The search supports:
- Classification names (e.g., "osteosarcoma")
- Categories (e.g., "osteogenic")
- ICD-O-3 codes (e.g., "9180/3")

### 4. Keyboard Shortcuts

Users can navigate with:
- Arrow keys to move between items
- Enter to select
- Tab to navigate between UI elements

### 5. Loading States

The component automatically shows loading skeletons and error states.

### 6. Offline Support (Future Enhancement)

Consider adding service workers to cache classifications for offline use.

## Performance Considerations

- **React Query**: Classifications are cached for 5 minutes
- **LocalStorage**: Recent and favorites are stored client-side
- **Lazy Rendering**: Only expanded categories render their children
- **Search**: Client-side filtering is instant (no API calls)

## Troubleshooting

### Issue: "Classifications not loading"

**Check:**
1. API endpoint is accessible: `GET /api/v1/who-bone-tumors`
2. React Query provider is in your app root
3. Network tab for errors

### Issue: "Recent selections not saving"

**Check:**
1. Browser allows localStorage
2. No localStorage quota exceeded
3. Check browser console for errors

### Issue: "Search not working"

**Check:**
1. `searchable` prop is set to `true` (default)
2. Classifications have loaded successfully
3. Search query matches existing data

## Need Help?

Refer to:
- `README.md` - Full component documentation
- `examples/` - Working code examples
- `__tests__/` - Test suite for behavior reference
