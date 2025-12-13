import { useState, useCallback, useMemo } from 'react';
import {
  MstsScoreValues,
  MstsScoreResult,
  ScoreLevel,
  InterpretationLevel,
  ValidationResult,
  ScoreChange,
  ExtremityType,
  UseMstsCalculatorReturn,
} from '../../types/msts.types';

/**
 * Calculate total MSTS score from domain values
 */
export const calculateTotalScore = (
  scores: Partial<MstsScoreValues>
): number => {
  const { pain = 0, function: func = 0, emotionalAcceptance = 0 } = scores;

  // Type-specific domains
  const handPositioning = 'handPositioning' in scores ? scores.handPositioning || 0 : 0;
  const manualDexterity = 'manualDexterity' in scores ? scores.manualDexterity || 0 : 0;
  const liftingAbility = 'liftingAbility' in scores ? scores.liftingAbility || 0 : 0;

  // Common domains (3) + extremity-specific domains (3) = 6 total domains
  return pain + func + emotionalAcceptance +
         (handPositioning || liftingAbility) +
         (manualDexterity || 0) +
         (manualDexterity ? 0 : liftingAbility); // Ensure we don't double count
};

/**
 * Calculate percentage score (0-100)
 */
export const calculatePercentageScore = (totalScore: number): number => {
  return Math.round((totalScore / 30) * 100);
};

/**
 * Get interpretation level based on total score
 * Excellent: ≥25, Good: 20-24, Fair: 15-19, Poor: <15
 */
export const getInterpretation = (totalScore: number): InterpretationLevel => {
  if (totalScore >= 25) return 'Excellent';
  if (totalScore >= 20) return 'Good';
  if (totalScore >= 15) return 'Fair';
  return 'Poor';
};

/**
 * Validate MSTS score completeness
 */
export const validateScores = (
  scores: Partial<MstsScoreValues>,
  extremityType: ExtremityType
): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check common domains
  if (scores.pain === undefined) errors.push('Pain score is required');
  if (scores.function === undefined) errors.push('Function score is required');
  if (scores.emotionalAcceptance === undefined) {
    errors.push('Emotional Acceptance score is required');
  }

  // Check extremity-specific domains
  if (extremityType === 'UPPER') {
    if (!('handPositioning' in scores) || scores.handPositioning === undefined) {
      errors.push('Hand Positioning score is required for upper extremity');
    }
    if (!('manualDexterity' in scores) || scores.manualDexterity === undefined) {
      errors.push('Manual Dexterity score is required for upper extremity');
    }
  } else {
    if (!('liftingAbility' in scores) || scores.liftingAbility === undefined) {
      errors.push('Lifting Ability score is required for lower extremity');
    }
  }

  // Validate score ranges
  Object.entries(scores).forEach(([key, value]) => {
    if (key !== 'extremityType' && value !== undefined && typeof value === 'number') {
      if (value < 0 || value > 5) {
        errors.push(`${key} must be between 0 and 5`);
      }
    }
  });

  // Add warnings for low scores
  const totalScore = calculateTotalScore(scores);
  if (totalScore < 10) {
    warnings.push('Total score is critically low - consider additional clinical assessment');
  } else if (totalScore < 15) {
    warnings.push('Total score indicates poor functional status');
  }

  if (scores.pain !== undefined && scores.pain <= 1) {
    warnings.push('Severe pain reported - pain management review recommended');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Compare current scores with previous assessment
 */
export const compareScores = (
  current: Partial<MstsScoreValues>,
  previous: MstsScoreResult
): ScoreChange[] => {
  const changes: ScoreChange[] = [];

  const domainMap: Record<string, string> = {
    pain: 'Pain',
    function: 'Function',
    emotionalAcceptance: 'Emotional Acceptance',
    handPositioning: 'Hand Positioning',
    manualDexterity: 'Manual Dexterity',
    liftingAbility: 'Lifting Ability',
  };

  Object.entries(current).forEach(([key, currentValue]) => {
    if (key === 'extremityType') return;

    const previousValue = previous[key as keyof MstsScoreResult];
    if (typeof currentValue === 'number' && typeof previousValue === 'number') {
      const change = currentValue - previousValue;
      if (change !== 0) {
        changes.push({
          domain: domainMap[key] || key,
          previousValue,
          currentValue,
          change,
          changeType: change > 0 ? 'improvement' : 'decline',
        });
      }
    }
  });

  return changes;
};

/**
 * Custom hook for MSTS score calculation and management
 */
export const useMstsCalculator = (
  extremityType: ExtremityType,
  initialValues?: Partial<MstsScoreValues>
): UseMstsCalculatorReturn => {
  const [scores, setScores] = useState<Partial<MstsScoreValues>>(() => {
    const initial: Partial<MstsScoreValues> = {
      extremityType,
      pain: undefined,
      function: undefined,
      emotionalAcceptance: undefined,
      ...initialValues,
    };

    if (extremityType === 'UPPER') {
      return {
        ...initial,
        handPositioning: undefined,
        manualDexterity: undefined,
      };
    } else {
      return {
        ...initial,
        liftingAbility: undefined,
      };
    }
  });

  // Set individual domain score
  const setScore = useCallback((domain: string, value: ScoreLevel) => {
    setScores(prev => ({
      ...prev,
      [domain]: value,
    }));
  }, []);

  // Calculate derived values
  const totalScore = useMemo(() => calculateTotalScore(scores), [scores]);
  const percentageScore = useMemo(() => calculatePercentageScore(totalScore), [totalScore]);
  const interpretation = useMemo(() => getInterpretation(totalScore), [totalScore]);

  // Validate scores
  const validation = useMemo(
    () => validateScores(scores, extremityType),
    [scores, extremityType]
  );

  // Reset to initial state
  const reset = useCallback(() => {
    const resetScores: Partial<MstsScoreValues> = {
      extremityType,
      pain: undefined,
      function: undefined,
      emotionalAcceptance: undefined,
    };

    if (extremityType === 'UPPER') {
      (resetScores as any).handPositioning = undefined;
      (resetScores as any).manualDexterity = undefined;
    } else {
      (resetScores as any).liftingAbility = undefined;
    }

    setScores(resetScores);
  }, [extremityType]);

  // Compare with previous score
  const compareWithPrevious = useCallback(
    (previous: MstsScoreResult): ScoreChange[] => {
      return compareScores(scores, previous);
    },
    [scores]
  );

  return {
    scores,
    setScore,
    totalScore,
    percentageScore,
    interpretation,
    isValid: validation.isValid,
    validation,
    reset,
    compareWithPrevious,
  };
};

/**
 * Pure function to create MstsScoreResult from values
 */
export const createMstsScoreResult = (
  scores: MstsScoreValues,
  additionalData?: {
    assessmentDate?: Date;
    assessedBy?: string;
    notes?: string;
  }
): MstsScoreResult => {
  const totalScore = calculateTotalScore(scores);
  const percentageScore = calculatePercentageScore(totalScore);
  const interpretation = getInterpretation(totalScore);

  const result: MstsScoreResult = {
    pain: scores.pain,
    function: scores.function,
    emotionalAcceptance: scores.emotionalAcceptance,
    totalScore,
    percentageScore,
    interpretation,
    extremityType: scores.extremityType,
    assessmentDate: additionalData?.assessmentDate || new Date(),
    assessedBy: additionalData?.assessedBy,
    notes: additionalData?.notes,
  };

  if (scores.extremityType === 'UPPER') {
    result.handPositioning = scores.handPositioning;
    result.manualDexterity = scores.manualDexterity;
  } else {
    result.liftingAbility = scores.liftingAbility;
  }

  return result;
};
