# MSTS Score Calculator - Usage Examples

This document provides comprehensive examples for using the MSTS Score Calculator components in the Indonesian Musculoskeletal Tumor Registry.

## Table of Contents

1. [Basic Usage](#basic-usage)
2. [Integration with Follow-up Forms](#integration-with-follow-up-forms)
3. [Displaying Score Summary](#displaying-score-summary)
4. [Trend Visualization](#trend-visualization)
5. [Advanced Scenarios](#advanced-scenarios)

---

## Basic Usage

### Example 1: Simple Upper Extremity Calculator

```tsx
import React from 'react';
import { MstsScoreCalculator } from '@/components/followup/msts';
import type { MstsScoreResult } from '@/components/followup/msts';

const UpperExtremityAssessment: React.FC = () => {
  const handleSave = async (score: MstsScoreResult) => {
    console.log('Saving score:', score);
    // API call to save score
    // await apiClient.post('/msts-scores', score);
  };

  return (
    <div className="container mx-auto p-6">
      <MstsScoreCalculator
        extremityType="UPPER"
        onSave={handleSave}
        showResetButton={true}
      />
    </div>
  );
};

export default UpperExtremityAssessment;
```

### Example 2: Lower Extremity with Initial Values

```tsx
import React from 'react';
import { MstsScoreCalculator } from '@/components/followup/msts';
import type { MstsScoreResult } from '@/components/followup/msts';

const LowerExtremityWithDefaults: React.FC = () => {
  const handleSave = async (score: MstsScoreResult) => {
    // Save to backend
    const response = await fetch('/api/msts-scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(score),
    });

    if (response.ok) {
      alert('Score saved successfully!');
    }
  };

  return (
    <MstsScoreCalculator
      extremityType="LOWER"
      initialValues={{
        extremityType: 'LOWER',
        pain: 3,
        function: 3,
        emotionalAcceptance: 4,
        liftingAbility: 2,
      }}
      onSave={handleSave}
    />
  );
};
```

---

## Integration with Follow-up Forms

### Example 3: Embedded in Follow-up Visit Form

```tsx
import React, { useState } from 'react';
import { MstsScoreCalculator, MstsScoreSummary } from '@/components/followup/msts';
import type { MstsScoreResult } from '@/components/followup/msts';

interface FollowUpVisit {
  id: string;
  patientId: string;
  visitNumber: number;
  visitDate: Date;
  mstsScore?: MstsScoreResult;
}

const FollowUpVisitForm: React.FC<{ patientId: string }> = ({ patientId }) => {
  const [visit, setVisit] = useState<FollowUpVisit>({
    id: '',
    patientId,
    visitNumber: 1,
    visitDate: new Date(),
  });

  const [showCalculator, setShowCalculator] = useState(true);

  const handleSaveMstsScore = async (score: MstsScoreResult) => {
    // Save MSTS score as part of the visit
    const updatedVisit = { ...visit, mstsScore: score };
    setVisit(updatedVisit);
    setShowCalculator(false);

    // Save to backend
    await fetch(`/api/follow-up-visits/${visit.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedVisit),
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Follow-up Visit Assessment</h2>

      {/* Visit Details */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-semibold mb-2">Visit Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Visit Number</label>
            <input
              type="number"
              value={visit.visitNumber}
              onChange={(e) => setVisit({ ...visit, visitNumber: Number(e.target.value) })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Visit Date</label>
            <input
              type="date"
              value={visit.visitDate.toISOString().split('T')[0]}
              onChange={(e) => setVisit({ ...visit, visitDate: new Date(e.target.value) })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* MSTS Score Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4">MSTS Functional Assessment</h3>

        {visit.mstsScore && !showCalculator ? (
          <MstsScoreSummary
            score={visit.mstsScore}
            showBreakdown={true}
            editable={true}
            onEdit={() => setShowCalculator(true)}
          />
        ) : (
          <MstsScoreCalculator
            extremityType="UPPER" // or determine from patient data
            onSave={handleSaveMstsScore}
            initialValues={visit.mstsScore}
          />
        )}
      </div>
    </div>
  );
};
```

### Example 4: Multi-visit Workflow with Comparison

```tsx
import React, { useState, useEffect } from 'react';
import {
  MstsScoreCalculator,
  MstsScoreTrendChart,
  useMstsTrend,
} from '@/components/followup/msts';
import type { MstsScoreResult } from '@/components/followup/msts';

const MultiVisitMstsAssessment: React.FC<{
  patientId: string;
  extremityType: 'UPPER' | 'LOWER';
}> = ({ patientId, extremityType }) => {
  const { data, latestScore, refetch } = useMstsTrend(patientId, extremityType);
  const [showNewAssessment, setShowNewAssessment] = useState(false);

  const handleSaveNewScore = async (score: MstsScoreResult) => {
    // Save to backend
    await fetch('/api/msts-scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...score,
        patientId,
      }),
    });

    // Refresh trend data
    await refetch();
    setShowNewAssessment(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">MSTS Assessment History</h2>
        <button
          onClick={() => setShowNewAssessment(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          New Assessment
        </button>
      </div>

      {/* Trend Chart */}
      <MstsScoreTrendChart
        patientId={patientId}
        extremityType={extremityType}
        showDomains={true}
        highlightChanges={true}
      />

      {/* New Assessment Form */}
      {showNewAssessment && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">New Assessment</h3>
          <MstsScoreCalculator
            extremityType={extremityType}
            onSave={handleSaveNewScore}
            previousScore={latestScore ? {
              ...latestScore,
              assessmentDate: latestScore.date,
            } : undefined}
          />
        </div>
      )}
    </div>
  );
};
```

---

## Displaying Score Summary

### Example 5: Compact Score Display in Patient Dashboard

```tsx
import React from 'react';
import { MstsScoreSummary } from '@/components/followup/msts';
import type { MstsScoreResult } from '@/components/followup/msts';

const PatientDashboardMstsWidget: React.FC<{ score: MstsScoreResult }> = ({ score }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-3">Latest MSTS Score</h3>
      <MstsScoreSummary
        score={score}
        compact={true}
        showBreakdown={false}
        editable={false}
      />
    </div>
  );
};
```

### Example 6: Full Score Display with Breakdown

```tsx
import React from 'react';
import { MstsScoreSummary } from '@/components/followup/msts';

const FullMstsScoreView: React.FC<{ scoreId: string }> = ({ scoreId }) => {
  const [score, setScore] = React.useState(null);

  React.useEffect(() => {
    // Fetch score from API
    fetch(`/api/msts-scores/${scoreId}`)
      .then((res) => res.json())
      .then((data) => setScore(data));
  }, [scoreId]);

  if (!score) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <MstsScoreSummary
        score={score}
        showBreakdown={true}
        editable={true}
        onEdit={() => {
          // Navigate to edit page or open edit modal
          window.location.href = `/msts-scores/${scoreId}/edit`;
        }}
      />
    </div>
  );
};
```

---

## Trend Visualization

### Example 7: Standalone Trend Chart

```tsx
import React from 'react';
import { MstsScoreTrendChart } from '@/components/followup/msts';

const MstsTrendPage: React.FC<{ patientId: string }> = ({ patientId }) => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Functional Outcome Trend</h1>

      <MstsScoreTrendChart
        patientId={patientId}
        extremityType="UPPER"
        showDomains={true}
        highlightChanges={true}
        maxVisits={14}
      />
    </div>
  );
};
```

### Example 8: Side-by-side Comparison

```tsx
import React from 'react';
import { MstsScoreTrendChart } from '@/components/followup/msts';

const ComparativeTrendView: React.FC<{
  patient1Id: string;
  patient2Id: string;
}> = ({ patient1Id, patient2Id }) => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Patient Comparison</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Patient A</h2>
          <MstsScoreTrendChart
            patientId={patient1Id}
            extremityType="UPPER"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Patient B</h2>
          <MstsScoreTrendChart
            patientId={patient2Id}
            extremityType="UPPER"
          />
        </div>
      </div>
    </div>
  );
};
```

---

## Advanced Scenarios

### Example 9: Read-only Mode for Review

```tsx
import React from 'react';
import { MstsScoreCalculator } from '@/components/followup/msts';

const MstsScoreReview: React.FC<{ score: any }> = ({ score }) => {
  return (
    <MstsScoreCalculator
      extremityType={score.extremityType}
      initialValues={score}
      onSave={async () => {
        // No-op in read-only mode
      }}
      readOnly={true}
      showResetButton={false}
    />
  );
};
```

### Example 10: Custom Hook Usage

```tsx
import React from 'react';
import { useMstsCalculator } from '@/components/followup/msts';

const CustomMstsComponent: React.FC = () => {
  const {
    scores,
    setScore,
    totalScore,
    percentageScore,
    interpretation,
    isValid,
    validation,
    reset,
  } = useMstsCalculator('UPPER');

  return (
    <div className="p-6">
      <h2>Custom MSTS Interface</h2>

      <div className="mb-4">
        <label>Pain Score (0-5):</label>
        <input
          type="range"
          min="0"
          max="5"
          value={scores.pain || 0}
          onChange={(e) => setScore('pain', Number(e.target.value) as any)}
          className="w-full"
        />
        <span>{scores.pain || 0}</span>
      </div>

      {/* Similar inputs for other domains */}

      <div className="mt-6 p-4 bg-blue-50 rounded">
        <p>Total Score: {totalScore} / 30</p>
        <p>Percentage: {percentageScore}%</p>
        <p>Interpretation: {interpretation}</p>
        <p>Valid: {isValid ? 'Yes' : 'No'}</p>
      </div>

      {validation.errors.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 rounded">
          <ul>
            {validation.errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-gray-600 text-white rounded"
      >
        Reset
      </button>
    </div>
  );
};
```

---

## TypeScript Integration

### Example 11: Type-safe Integration

```tsx
import React from 'react';
import type {
  MstsScoreResult,
  ExtremityType,
  ValidationResult,
} from '@/components/followup/msts';
import { MstsScoreCalculator } from '@/components/followup/msts';

interface Patient {
  id: string;
  name: string;
  extremityType: ExtremityType;
}

interface Props {
  patient: Patient;
  onScoreSaved: (scoreId: string) => void;
}

const TypeSafeMstsAssessment: React.FC<Props> = ({ patient, onScoreSaved }) => {
  const handleSave = async (score: MstsScoreResult): Promise<void> => {
    try {
      const response = await fetch('/api/msts-scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...score,
          patientId: patient.id,
        }),
      });

      const data = await response.json();
      onScoreSaved(data.id);
    } catch (error) {
      console.error('Failed to save MSTS score:', error);
      throw error;
    }
  };

  return (
    <div>
      <h2>MSTS Assessment for {patient.name}</h2>
      <MstsScoreCalculator
        extremityType={patient.extremityType}
        onSave={handleSave}
      />
    </div>
  );
};

export default TypeSafeMstsAssessment;
```

---

## Testing Examples

### Example 12: Unit Test for Calculation Hook

```tsx
import { renderHook, act } from '@testing-library/react';
import { useMstsCalculator } from '@/components/followup/msts';

describe('useMstsCalculator', () => {
  it('calculates total score correctly for upper extremity', () => {
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
    expect(result.current.percentageScore).toBe(83);
  });

  it('validates required fields', () => {
    const { result } = renderHook(() => useMstsCalculator('UPPER'));

    expect(result.current.isValid).toBe(false);
    expect(result.current.validation.errors.length).toBeGreaterThan(0);
  });
});
```

---

## Best Practices

1. **Always specify extremityType correctly** based on patient data
2. **Use previousScore prop** to enable change tracking
3. **Implement proper error handling** in onSave callback
4. **Validate data on backend** even though frontend validates
5. **Store assessmentDate** from the form, not auto-generated
6. **Use compact mode** for dashboard widgets
7. **Enable trend charts** for longitudinal monitoring (14-visit system)
8. **Combine with other outcome measures** (TESS, SF-36) for comprehensive assessment

---

For more information, see the main documentation in the components directory.
