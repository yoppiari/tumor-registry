import { useState, useEffect, useCallback } from 'react';
import {
  MstsTrendDataPoint,
  ExtremityType,
  UseMstsTrendReturn,
} from '../../types/msts.types';
import { getInterpretation } from './useMstsCalculator';

/**
 * Mock API call to fetch MSTS score history
 * In production, this would call the actual backend API
 */
const fetchMstsHistory = async (
  patientId: string,
  extremityType: ExtremityType
): Promise<MstsTrendDataPoint[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock data - replace with actual API call
  // Example: const response = await apiClient.get(`/msts-scores/patient/${patientId}/trend`);

  const mockData: MstsTrendDataPoint[] = [
    {
      date: new Date('2024-01-15'),
      visitNumber: 1,
      totalScore: 12,
      pain: 2,
      function: 2,
      emotionalAcceptance: 2,
      handPositioning: extremityType === 'UPPER' ? 2 : undefined,
      manualDexterity: extremityType === 'UPPER' ? 2 : undefined,
      liftingAbility: extremityType === 'LOWER' ? 2 : undefined,
      interpretation: getInterpretation(12),
    },
    {
      date: new Date('2024-02-15'),
      visitNumber: 2,
      totalScore: 15,
      pain: 3,
      function: 2,
      emotionalAcceptance: 3,
      handPositioning: extremityType === 'UPPER' ? 2 : undefined,
      manualDexterity: extremityType === 'UPPER' ? 3 : undefined,
      liftingAbility: extremityType === 'LOWER' ? 2 : undefined,
      interpretation: getInterpretation(15),
    },
    {
      date: new Date('2024-03-15'),
      visitNumber: 3,
      totalScore: 18,
      pain: 3,
      function: 3,
      emotionalAcceptance: 3,
      handPositioning: extremityType === 'UPPER' ? 3 : undefined,
      manualDexterity: extremityType === 'UPPER' ? 3 : undefined,
      liftingAbility: extremityType === 'LOWER' ? 3 : undefined,
      interpretation: getInterpretation(18),
    },
    {
      date: new Date('2024-04-15'),
      visitNumber: 4,
      totalScore: 21,
      pain: 4,
      function: 3,
      emotionalAcceptance: 4,
      handPositioning: extremityType === 'UPPER' ? 3 : undefined,
      manualDexterity: extremityType === 'UPPER' ? 4 : undefined,
      liftingAbility: extremityType === 'LOWER' ? 3 : undefined,
      interpretation: getInterpretation(21),
    },
    {
      date: new Date('2024-05-15'),
      visitNumber: 5,
      totalScore: 24,
      pain: 4,
      function: 4,
      emotionalAcceptance: 4,
      handPositioning: extremityType === 'UPPER' ? 4 : undefined,
      manualDexterity: extremityType === 'UPPER' ? 4 : undefined,
      liftingAbility: extremityType === 'LOWER' ? 4 : undefined,
      interpretation: getInterpretation(24),
    },
  ];

  return mockData;
};

/**
 * Calculate trend direction based on historical data
 */
const calculateTrend = (
  data: MstsTrendDataPoint[]
): 'improving' | 'declining' | 'stable' | 'insufficient-data' => {
  if (data.length < 2) return 'insufficient-data';

  // Simple trend calculation: compare recent scores with earlier scores
  const recentCount = Math.min(3, Math.floor(data.length / 2));
  const recentScores = data.slice(-recentCount);
  const earlierScores = data.slice(0, recentCount);

  const recentAvg =
    recentScores.reduce((sum, d) => sum + d.totalScore, 0) / recentScores.length;
  const earlierAvg =
    earlierScores.reduce((sum, d) => sum + d.totalScore, 0) / earlierScores.length;

  const difference = recentAvg - earlierAvg;

  // Consider stable if change is less than 2 points on average
  if (Math.abs(difference) < 2) return 'stable';
  return difference > 0 ? 'improving' : 'declining';
};

/**
 * Custom hook for fetching and managing MSTS trend data
 */
export const useMstsTrend = (
  patientId: string,
  extremityType: ExtremityType
): UseMstsTrendReturn => {
  const [data, setData] = useState<MstsTrendDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const history = await fetchMstsHistory(patientId, extremityType);
      setData(history);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch MSTS trend data'));
    } finally {
      setIsLoading(false);
    }
  }, [patientId, extremityType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate derived values
  const latestScore = data.length > 0 ? data[data.length - 1] : null;
  const averageScore =
    data.length > 0
      ? data.reduce((sum, d) => sum + d.totalScore, 0) / data.length
      : null;
  const trend = calculateTrend(data);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    latestScore,
    averageScore: averageScore !== null ? Math.round(averageScore * 10) / 10 : null,
    trend,
  };
};

export default useMstsTrend;
