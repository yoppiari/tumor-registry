# MSTS Score Calculator Component System

## Overview

A comprehensive, production-ready implementation of the **MSTS (Musculoskeletal Tumor Society) Score Calculator** for the Indonesian Musculoskeletal Tumor Registry. This system provides functional outcome assessment tools for both upper and lower extremity musculoskeletal tumors.

### Key Features

- ✅ **Conditional Extremity Logic**: Automatically shows correct domains based on upper/lower extremity
- ✅ **Real-time Calculation**: Auto-calculates total score (0-30), percentage, and interpretation
- ✅ **Visual Score Indicators**: Color-coded badges (red 0-1, yellow 2-3, green 4-5)
- ✅ **Score Comparison**: Highlights changes from previous assessments
- ✅ **Trend Visualization**: Interactive charts showing score progression over 14 visits
- ✅ **Validation**: Comprehensive field validation with error/warning messages
- ✅ **TypeScript**: Full type safety with comprehensive interfaces
- ✅ **Responsive Design**: Mobile-friendly, professional medical UI
- ✅ **Print-Friendly**: Optimized for clinical documentation

---

## MSTS Score System

The MSTS score evaluates **6 functional domains**, each scored **0-5 points**, for a total of **0-30 points**.

### Common Domains (All Extremities)

1. **Pain** (0-5): From no pain to disabling pain
2. **Function** (0-5): Daily activity and occupational function
3. **Emotional Acceptance** (0-5): Psychological acceptance of condition

### Upper Extremity Specific

4. **Hand Positioning** (0-5): Ability to position hand (above head, to mouth, etc.)
5. **Manual Dexterity** (0-5): Fine motor skills, grasp, and pinch

### Lower Extremity Specific

4. **Lifting Ability** (0-5): Weight lifting capability

### Interpretation Levels

- **Excellent**: ≥25 points (83-100%)
- **Good**: 20-24 points (67-80%)
- **Fair**: 15-19 points (50-63%)
- **Poor**: <15 points (<50%)

---

## Component Architecture

```
/followup/
  ├── msts/
  │   ├── MstsScoreCalculator.tsx       # Main calculator component
  │   ├── MstsScoreSummary.tsx          # Read-only score display
  │   ├── MstsScoreTrendChart.tsx       # Trend visualization
  │   ├── MstsDomainSelector.tsx        # Reusable domain selector
  │   ├── domainConfigs.ts              # Domain scoring criteria
  │   ├── hooks/
  │   │   ├── useMstsCalculator.ts      # Calculation logic hook
  │   │   └── useMstsTrend.ts           # Historical data hook
  │   ├── index.ts                      # Public exports
  │   ├── README.md                     # This file
  │   └── EXAMPLES.md                   # Usage examples
  └── types/
      └── msts.types.ts                 # TypeScript definitions
```

---

## Installation & Setup

### 1. Dependencies

The components use these dependencies (already in your project):

```json
{
  "react": "^18.x",
  "@heroicons/react": "^2.x",
  "tailwindcss": "^3.x"
}
```

### 2. Import Components

```tsx
import {
  MstsScoreCalculator,
  MstsScoreSummary,
  MstsScoreTrendChart,
} from '@/components/followup/msts';
```

### 3. TypeScript Types

```tsx
import type {
  MstsScoreResult,
  ExtremityType,
  MstsScoreValues,
} from '@/components/followup/msts';
```

---

## Quick Start

### Basic Calculator (Upper Extremity)

```tsx
import { MstsScoreCalculator } from '@/components/followup/msts';

function MyComponent() {
  const handleSave = async (score) => {
    await apiClient.post('/msts-scores', score);
  };

  return (
    <MstsScoreCalculator
      extremityType="UPPER"
      onSave={handleSave}
    />
  );
}
```

### Display Saved Score

```tsx
import { MstsScoreSummary } from '@/components/followup/msts';

function ScoreDisplay({ score }) {
  return (
    <MstsScoreSummary
      score={score}
      showBreakdown={true}
      editable={true}
      onEdit={() => navigateToEdit()}
    />
  );
}
```

### Trend Chart

```tsx
import { MstsScoreTrendChart } from '@/components/followup/msts';

function TrendView({ patientId }) {
  return (
    <MstsScoreTrendChart
      patientId={patientId}
      extremityType="UPPER"
      showDomains={true}
      highlightChanges={true}
    />
  );
}
```

---

## Component API Reference

### MstsScoreCalculator

Main calculator component with full scoring interface.

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `extremityType` | `'UPPER' \| 'LOWER'` | Yes | - | Determines which domains to show |
| `onSave` | `(score: MstsScoreResult) => Promise<void>` | Yes | - | Save callback function |
| `initialValues` | `Partial<MstsScoreValues>` | No | `undefined` | Pre-fill values |
| `readOnly` | `boolean` | No | `false` | Disable editing |
| `showResetButton` | `boolean` | No | `true` | Show reset button |
| `autoCalculate` | `boolean` | No | `true` | Auto-calculate on change |
| `previousScore` | `MstsScoreResult` | No | `undefined` | Enable change comparison |

#### Example

```tsx
<MstsScoreCalculator
  extremityType="UPPER"
  initialValues={{
    pain: 3,
    function: 4,
    emotionalAcceptance: 4,
  }}
  onSave={async (score) => {
    await saveToDatabase(score);
  }}
  previousScore={lastAssessment}
  showResetButton={true}
/>
```

---

### MstsScoreSummary

Read-only display of a saved MSTS score.

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `score` | `MstsScoreResult` | Yes | - | Score to display |
| `showBreakdown` | `boolean` | No | `true` | Show domain breakdown |
| `onEdit` | `() => void` | No | `undefined` | Edit callback |
| `editable` | `boolean` | No | `false` | Show edit button |
| `compact` | `boolean` | No | `false` | Compact display mode |

---

### MstsScoreTrendChart

Visualizes score progression over multiple visits.

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `patientId` | `string` | Yes | - | Patient identifier |
| `extremityType` | `'UPPER' \| 'LOWER'` | Yes | - | Extremity type |
| `data` | `MstsTrendDataPoint[]` | No | `undefined` | External data (optional) |
| `showDomains` | `boolean` | No | `false` | Show individual domains |
| `highlightChanges` | `boolean` | No | `true` | Highlight score changes |
| `maxVisits` | `number` | No | `14` | Maximum visits to display |

---

## Hooks API

### useMstsCalculator

Custom hook for MSTS score calculation and validation.

```tsx
const {
  scores,
  setScore,
  totalScore,
  percentageScore,
  interpretation,
  isValid,
  validation,
  reset,
  compareWithPrevious,
} = useMstsCalculator('UPPER', initialValues);
```

#### Returns

- `scores`: Current domain scores
- `setScore(domain, value)`: Update a domain score
- `totalScore`: Calculated total (0-30)
- `percentageScore`: Percentage (0-100)
- `interpretation`: 'Excellent' | 'Good' | 'Fair' | 'Poor'
- `isValid`: Boolean validation status
- `validation`: Error/warning messages
- `reset()`: Reset all scores
- `compareWithPrevious(previous)`: Compare with previous score

---

### useMstsTrend

Fetch and analyze historical MSTS scores.

```tsx
const {
  data,
  isLoading,
  error,
  refetch,
  latestScore,
  averageScore,
  trend,
} = useMstsTrend(patientId, extremityType);
```

#### Returns

- `data`: Array of trend data points
- `isLoading`: Loading state
- `error`: Error object if failed
- `refetch()`: Manually refetch data
- `latestScore`: Most recent score
- `averageScore`: Average across all visits
- `trend`: 'improving' | 'declining' | 'stable' | 'insufficient-data'

---

## Validation

The calculator performs comprehensive validation:

### Required Fields

- All 6 domains must be scored (0-5)
- Correct domains based on extremity type

### Warnings

- Total score < 10: Critical - recommend clinical assessment
- Total score < 15: Poor functional status
- Pain ≤ 1: Severe pain - recommend pain management review

### Score Change Detection

When `previousScore` is provided, the calculator highlights:

- Domain-level changes (improvement/decline)
- Magnitude of change
- Visual indicators (green up arrow, red down arrow)

---

## Styling

All components use **Tailwind CSS** with:

- Professional medical form design
- Color-coded score indicators:
  - **Green** (4-5): Good function
  - **Yellow** (2-3): Moderate function
  - **Red** (0-1): Poor function
- Responsive grid layouts
- Print-optimized views
- Accessible contrast ratios

---

## Data Flow

### 1. Calculator → Save

```
User Input → Domain Scores → Calculation → Validation → onSave Callback → Backend API
```

### 2. Trend Display

```
Patient ID → useMstsTrend Hook → API Call → Data Processing → Chart Rendering
```

### 3. Summary Display

```
Saved Score → MstsScoreSummary → Formatted Display → Optional Edit
```

---

## Backend Integration

### Expected API Endpoints

```typescript
// Create new score
POST /api/msts-scores
Body: {
  patientId: string;
  extremityType: 'UPPER' | 'LOWER';
  pain: number;
  function: number;
  emotionalAcceptance: number;
  handPositioning?: number;
  manualDexterity?: number;
  liftingAbility?: number;
  assessmentDate: Date;
  assessedBy?: string;
  notes?: string;
}

// Get patient scores
GET /api/msts-scores/patient/:patientId

// Get trend data
GET /api/msts-scores/patient/:patientId/trend
```

### Sample Response

```json
{
  "id": "uuid",
  "patientId": "patient-123",
  "extremityType": "UPPER",
  "pain": 4,
  "function": 4,
  "emotionalAcceptance": 5,
  "handPositioning": 4,
  "manualDexterity": 3,
  "totalScore": 20,
  "percentageScore": 67,
  "interpretation": "Good",
  "assessmentDate": "2024-12-12T00:00:00Z",
  "assessedBy": "Dr. Smith",
  "createdAt": "2024-12-12T10:30:00Z",
  "updatedAt": "2024-12-12T10:30:00Z"
}
```

---

## Testing

### Unit Tests (Jest/Vitest)

```tsx
import { renderHook, act } from '@testing-library/react';
import { useMstsCalculator } from './hooks/useMstsCalculator';

test('calculates total score correctly', () => {
  const { result } = renderHook(() => useMstsCalculator('UPPER'));

  act(() => {
    result.current.setScore('pain', 5);
    result.current.setScore('function', 5);
    result.current.setScore('emotionalAcceptance', 5);
    result.current.setScore('handPositioning', 5);
    result.current.setScore('manualDexterity', 5);
  });

  expect(result.current.totalScore).toBe(25);
  expect(result.current.interpretation).toBe('Excellent');
});
```

### Component Tests (React Testing Library)

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MstsScoreCalculator } from './MstsScoreCalculator';

test('renders all upper extremity domains', () => {
  render(
    <MstsScoreCalculator
      extremityType="UPPER"
      onSave={jest.fn()}
    />
  );

  expect(screen.getByText('Pain')).toBeInTheDocument();
  expect(screen.getByText('Hand Positioning')).toBeInTheDocument();
  expect(screen.getByText('Manual Dexterity')).toBeInTheDocument();
});
```

---

## Troubleshooting

### Issue: Scores not saving

**Solution**: Check that `onSave` callback is async and properly handles errors.

### Issue: Trend chart not showing data

**Solution**: Verify `patientId` is correct and API endpoint returns proper data format.

### Issue: Validation errors persist

**Solution**: Ensure all 6 domains are scored (check extremity type matches domains).

---

## Contributing

When extending this system:

1. **Maintain type safety**: Use TypeScript interfaces
2. **Follow domain configs**: Add new scoring criteria in `domainConfigs.ts`
3. **Update tests**: Add tests for new functionality
4. **Document changes**: Update this README and EXAMPLES.md

---

## License

Part of the Indonesian Musculoskeletal Tumor Registry project.

---

## Support

For questions or issues:

1. Check [EXAMPLES.md](./EXAMPLES.md) for usage patterns
2. Review TypeScript types in `types/msts.types.ts`
3. Consult domain configurations in `domainConfigs.ts`

---

## References

- MSTS Scoring System: Enneking WF, Dunham W, Gebhardt MC, et al. "A system for the functional evaluation of reconstructive procedures after surgical treatment of tumors of the musculoskeletal system." Clin Orthop Relat Res. 1993.
- Indonesian Tumor Registry Standards
- 14-Visit Longitudinal Follow-up Protocol
