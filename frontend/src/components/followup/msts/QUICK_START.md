# MSTS Score Calculator - Quick Start Guide

## 5-Minute Setup

### Step 1: Import the Component

```tsx
import { MstsScoreCalculator } from '@/components/followup/msts';
```

### Step 2: Add to Your Page

```tsx
function MyPage() {
  const handleSave = async (score) => {
    console.log('Score:', score);
    // Save to your API here
  };

  return (
    <MstsScoreCalculator
      extremityType="UPPER"  // or "LOWER"
      onSave={handleSave}
    />
  );
}
```

### Step 3: Done!

That's it! The calculator is now functional with:
- ✅ All 6 domains (automatic based on extremity type)
- ✅ Real-time score calculation
- ✅ Validation
- ✅ Professional UI

---

## Common Use Cases

### Display a Saved Score

```tsx
import { MstsScoreSummary } from '@/components/followup/msts';

<MstsScoreSummary
  score={savedScore}
  showBreakdown={true}
/>
```

### Show Score Trend

```tsx
import { MstsScoreTrendChart } from '@/components/followup/msts';

<MstsScoreTrendChart
  patientId="patient-123"
  extremityType="UPPER"
/>
```

### Edit Existing Score

```tsx
<MstsScoreCalculator
  extremityType="UPPER"
  initialValues={existingScore}
  onSave={handleUpdate}
/>
```

---

## What You Get

### Upper Extremity (5 domains + 1 common = 6 total)

1. Pain (0-5)
2. Function (0-5)
3. Emotional Acceptance (0-5)
4. **Hand Positioning** (0-5) - Upper specific
5. **Manual Dexterity** (0-5) - Upper specific

### Lower Extremity (4 domains + 2 common = 6 total)

1. Pain (0-5)
2. Function (0-5)
3. Emotional Acceptance (0-5)
4. **Lifting Ability** (0-5) - Lower specific

### Automatic Calculations

- **Total Score**: 0-30 points
- **Percentage**: 0-100%
- **Interpretation**:
  - Excellent: ≥25 points
  - Good: 20-24 points
  - Fair: 15-19 points
  - Poor: <15 points

---

## Props Reference

### MstsScoreCalculator

| Prop | Type | Required | Example |
|------|------|----------|---------|
| `extremityType` | `'UPPER' \| 'LOWER'` | ✅ Yes | `"UPPER"` |
| `onSave` | `(score) => Promise<void>` | ✅ Yes | `async (s) => {...}` |
| `initialValues` | `object` | No | `{ pain: 3, ... }` |
| `readOnly` | `boolean` | No | `false` |
| `previousScore` | `object` | No | `lastScore` |

### MstsScoreSummary

| Prop | Type | Required | Example |
|------|------|----------|---------|
| `score` | `object` | ✅ Yes | `savedScore` |
| `showBreakdown` | `boolean` | No | `true` |
| `compact` | `boolean` | No | `false` |
| `editable` | `boolean` | No | `false` |

### MstsScoreTrendChart

| Prop | Type | Required | Example |
|------|------|----------|---------|
| `patientId` | `string` | ✅ Yes | `"patient-123"` |
| `extremityType` | `'UPPER' \| 'LOWER'` | ✅ Yes | `"UPPER"` |
| `showDomains` | `boolean` | No | `true` |
| `maxVisits` | `number` | No | `14` |

---

## Complete Example

```tsx
'use client';

import React, { useState } from 'react';
import {
  MstsScoreCalculator,
  MstsScoreSummary,
} from '@/components/followup/msts';

export default function FollowUpVisit({ patientId }) {
  const [savedScore, setSavedScore] = useState(null);

  const handleSave = async (score) => {
    // Save to backend
    const response = await fetch('/api/msts-scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...score, patientId }),
    });

    const data = await response.json();
    setSavedScore(data);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">MSTS Assessment</h1>

      {savedScore ? (
        <MstsScoreSummary
          score={savedScore}
          editable={true}
          onEdit={() => setSavedScore(null)}
        />
      ) : (
        <MstsScoreCalculator
          extremityType="UPPER"
          onSave={handleSave}
        />
      )}
    </div>
  );
}
```

---

## Next Steps

1. **Read the Full Documentation**: See `README.md` for complete API reference
2. **Check Examples**: Browse `EXAMPLES.md` for 12 detailed usage patterns
3. **Review Integration**: Look at `IntegrationExample.tsx` for complete implementations
4. **Customize**: Adjust styling, add features, integrate with your backend

---

## Need Help?

- 📖 **Full Docs**: `README.md`
- 💡 **Examples**: `EXAMPLES.md`
- 🔧 **Integration**: `IntegrationExample.tsx`
- 📊 **Project Info**: `PROJECT_SUMMARY.md`

---

## Troubleshooting

### Issue: "Cannot find module"

**Solution**: Check import path. Should be:
```tsx
import { ... } from '@/components/followup/msts';
```

### Issue: "extremityType is required"

**Solution**: Always pass extremityType prop:
```tsx
<MstsScoreCalculator extremityType="UPPER" ... />
```

### Issue: "Score not saving"

**Solution**: Implement onSave callback:
```tsx
onSave={async (score) => {
  await fetch('/api/msts-scores', {
    method: 'POST',
    body: JSON.stringify(score),
  });
}}
```

---

**You're ready to go!** 🚀

Start with the basic example above and expand as needed.
