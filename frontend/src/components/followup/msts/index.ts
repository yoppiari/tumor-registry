/**
 * MSTS Score Calculator Module
 * Exports all components, hooks, and utilities for MSTS scoring
 */

// Main Components
export { MstsScoreCalculator } from './MstsScoreCalculator';
export { MstsScoreSummary } from './MstsScoreSummary';
export { MstsScoreTrendChart } from './MstsScoreTrendChart';
export { MstsDomainSelector } from './MstsDomainSelector';

// Hooks
export { useMstsCalculator, createMstsScoreResult } from './hooks/useMstsCalculator';
export { useMstsTrend } from './hooks/useMstsTrend';

// Domain Configurations
export {
  PAIN_CONFIG,
  FUNCTION_CONFIG,
  EMOTIONAL_ACCEPTANCE_CONFIG,
  HAND_POSITIONING_CONFIG,
  MANUAL_DEXTERITY_CONFIG,
  LIFTING_ABILITY_CONFIG,
  getDomainConfigsForExtremity,
  getScoreColor,
  getScoreBadgeColor,
  getInterpretationColor,
} from './domainConfigs';

// Re-export types
export type {
  ExtremityType,
  ScoreLevel,
  InterpretationLevel,
  MstsScoreValues,
  MstsScoreResult,
  SavedMstsScore,
  MstsScoreCalculatorProps,
  MstsScoreSummaryProps,
  MstsScoreTrendChartProps,
  MstsDomainSelectorProps,
  MstsTrendDataPoint,
  ValidationResult,
  ScoreChange,
} from '../types/msts.types';
