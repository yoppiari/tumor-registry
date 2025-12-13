/**
 * MSTS (Musculoskeletal Tumor Society) Score Type Definitions
 *
 * The MSTS score is a functional outcome assessment tool for musculoskeletal tumors
 * Score Range: 0-30 points (6 domains × 0-5 points each)
 */

export type ExtremityType = 'UPPER' | 'LOWER';

export type ScoreLevel = 0 | 1 | 2 | 3 | 4 | 5;

export type InterpretationLevel = 'Excellent' | 'Good' | 'Fair' | 'Poor';

/**
 * Common domains for both upper and lower extremity
 */
export interface CommonDomainScores {
  pain: ScoreLevel;
  function: ScoreLevel;
  emotionalAcceptance: ScoreLevel;
}

/**
 * Upper extremity specific domains
 */
export interface UpperExtremityScores {
  handPositioning: ScoreLevel;
  manualDexterity: ScoreLevel;
}

/**
 * Lower extremity specific domains
 */
export interface LowerExtremityScores {
  liftingAbility: ScoreLevel;
}

/**
 * Complete MSTS score values based on extremity type
 */
export type MstsScoreValues = CommonDomainScores & (
  | ({ extremityType: 'UPPER' } & UpperExtremityScores)
  | ({ extremityType: 'LOWER' } & LowerExtremityScores)
);

/**
 * MSTS Score result with calculations
 */
export interface MstsScoreResult {
  pain: ScoreLevel;
  function: ScoreLevel;
  emotionalAcceptance: ScoreLevel;
  handPositioning?: ScoreLevel;
  manualDexterity?: ScoreLevel;
  liftingAbility?: ScoreLevel;
  totalScore: number; // 0-30
  percentageScore: number; // 0-100
  interpretation: InterpretationLevel;
  extremityType: ExtremityType;
  assessmentDate: Date;
  assessedBy?: string;
  notes?: string;
}

/**
 * Saved MSTS Score (from backend)
 */
export interface SavedMstsScore extends MstsScoreResult {
  id: string;
  patientId: string;
  followUpVisitId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * MSTS Score Calculator Props
 */
export interface MstsScoreCalculatorProps {
  extremityType: ExtremityType;
  initialValues?: Partial<MstsScoreValues>;
  onSave: (score: MstsScoreResult) => Promise<void>;
  readOnly?: boolean;
  showResetButton?: boolean;
  autoCalculate?: boolean;
  previousScore?: MstsScoreResult; // For comparison/warnings
}

/**
 * Individual domain configuration
 */
export interface DomainLevel {
  value: ScoreLevel;
  label: string;
  description: string;
}

export interface DomainConfig {
  title: string;
  levels: DomainLevel[];
  helpText?: string;
}

/**
 * Domain selector props
 */
export interface MstsDomainSelectorProps {
  domain: string;
  config: DomainConfig;
  value: ScoreLevel;
  onChange: (value: ScoreLevel) => void;
  readOnly?: boolean;
}

/**
 * MSTS Score trend data point
 */
export interface MstsTrendDataPoint {
  date: Date;
  visitNumber: number;
  totalScore: number;
  pain: ScoreLevel;
  function: ScoreLevel;
  emotionalAcceptance: ScoreLevel;
  handPositioning?: ScoreLevel;
  manualDexterity?: ScoreLevel;
  liftingAbility?: ScoreLevel;
  interpretation: InterpretationLevel;
}

/**
 * MSTS Trend chart props
 */
export interface MstsScoreTrendChartProps {
  patientId: string;
  extremityType: ExtremityType;
  data?: MstsTrendDataPoint[];
  showDomains?: boolean;
  highlightChanges?: boolean;
  maxVisits?: number;
}

/**
 * MSTS Score summary props
 */
export interface MstsScoreSummaryProps {
  score: MstsScoreResult;
  showBreakdown?: boolean;
  onEdit?: () => void;
  editable?: boolean;
  compact?: boolean;
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Score change detection
 */
export interface ScoreChange {
  domain: string;
  previousValue: number;
  currentValue: number;
  change: number;
  changeType: 'improvement' | 'decline' | 'stable';
}

/**
 * MSTS calculation utilities return type
 */
export interface MstsCalculation {
  totalScore: number;
  percentageScore: number;
  interpretation: InterpretationLevel;
  scoresByDomain: Record<string, ScoreLevel>;
}

/**
 * Hook return types
 */
export interface UseMstsCalculatorReturn {
  scores: Partial<MstsScoreValues>;
  setScore: (domain: string, value: ScoreLevel) => void;
  totalScore: number;
  percentageScore: number;
  interpretation: InterpretationLevel;
  isValid: boolean;
  validation: ValidationResult;
  reset: () => void;
  compareWithPrevious: (previous: MstsScoreResult) => ScoreChange[];
}

export interface UseMstsTrendReturn {
  data: MstsTrendDataPoint[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  latestScore: MstsTrendDataPoint | null;
  averageScore: number | null;
  trend: 'improving' | 'declining' | 'stable' | 'insufficient-data';
}
