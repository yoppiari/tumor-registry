import { DomainConfig } from '../types/msts.types';

/**
 * MSTS Domain Configurations
 * Official scoring criteria from MSTS (Musculoskeletal Tumor Society)
 */

/**
 * Common domains for both upper and lower extremity
 */

export const PAIN_CONFIG: DomainConfig = {
  title: 'Pain',
  levels: [
    {
      value: 5,
      label: 'No pain',
      description: 'No pain or discomfort at any time',
    },
    {
      value: 4,
      label: 'Intermediate pain',
      description: 'Intermediate pain, no medication required',
    },
    {
      value: 3,
      label: 'Modest pain',
      description: 'Modest pain, occasional medication (NSAIDs)',
    },
    {
      value: 2,
      label: 'Moderate pain',
      description: 'Moderate pain, regular medication needed',
    },
    {
      value: 1,
      label: 'Moderate-marked pain',
      description: 'Moderate to marked pain, frequent medication required',
    },
    {
      value: 0,
      label: 'Marked/disabling pain',
      description: 'Marked or disabling pain, constant severe pain',
    },
  ],
  helpText: 'Assess the patient\'s pain level at rest and during activities',
};

export const FUNCTION_CONFIG: DomainConfig = {
  title: 'Function',
  levels: [
    {
      value: 5,
      label: 'No restriction',
      description: 'No functional limitations or restrictions',
    },
    {
      value: 4,
      label: 'Recreational restriction',
      description: 'Minor restriction of recreational activities only',
    },
    {
      value: 3,
      label: 'Partial occupational restriction',
      description: 'Partial restriction of occupational and recreational activities',
    },
    {
      value: 2,
      label: 'Total occupational restriction',
      description: 'Total restriction of occupation, some recreational activities possible',
    },
    {
      value: 1,
      label: 'Partial disability',
      description: 'Partially disabled, unable to work or participate in activities',
    },
    {
      value: 0,
      label: 'Total disability',
      description: 'Totally disabled, continuous care required',
    },
  ],
  helpText: 'Evaluate ability to perform work and recreational activities',
};

export const EMOTIONAL_ACCEPTANCE_CONFIG: DomainConfig = {
  title: 'Emotional Acceptance',
  levels: [
    {
      value: 5,
      label: 'Enthusiastic',
      description: 'Enthusiastic about treatment outcome and condition',
    },
    {
      value: 4,
      label: 'Satisfied',
      description: 'Satisfied with treatment outcome',
    },
    {
      value: 3,
      label: 'Accepts',
      description: 'Accepts treatment outcome',
    },
    {
      value: 2,
      label: 'Acknowledges',
      description: 'Acknowledges outcome with reservations',
    },
    {
      value: 1,
      label: 'Dislikes',
      description: 'Dislikes treatment outcome',
    },
    {
      value: 0,
      label: 'Dislikes greatly',
      description: 'Greatly dislikes or unaccepting of outcome',
    },
  ],
  helpText: 'Assess patient\'s psychological acceptance of their condition',
};

/**
 * Upper Extremity Specific Domains
 */

export const HAND_POSITIONING_CONFIG: DomainConfig = {
  title: 'Hand Positioning',
  levels: [
    {
      value: 5,
      label: 'Normal',
      description: 'Can position hand above head, behind head, and to mouth normally',
    },
    {
      value: 4,
      label: 'Above head',
      description: 'Can raise hand above head',
    },
    {
      value: 3,
      label: 'To shoulder',
      description: 'Can raise hand to shoulder level',
    },
    {
      value: 2,
      label: 'To waist',
      description: 'Can raise hand to waist level only',
    },
    {
      value: 1,
      label: 'To mouth',
      description: 'Can raise hand to mouth but not higher',
    },
    {
      value: 0,
      label: 'Unable to position',
      description: 'Unable to position hand functionally',
    },
  ],
  helpText: 'Test ability to position hand in different functional positions',
};

export const MANUAL_DEXTERITY_CONFIG: DomainConfig = {
  title: 'Manual Dexterity',
  levels: [
    {
      value: 5,
      label: 'Normal',
      description: 'Normal hand function and dexterity',
    },
    {
      value: 4,
      label: 'Slight impairment',
      description: 'Slight impairment, can perform fine motor tasks',
    },
    {
      value: 3,
      label: 'Moderate impairment',
      description: 'Moderate impairment, some difficulty with fine motor tasks',
    },
    {
      value: 2,
      label: 'Can grasp, cannot pinch',
      description: 'Able to grasp objects but unable to pinch',
    },
    {
      value: 1,
      label: 'Cannot grasp, can hold',
      description: 'Unable to grasp, can only hold larger objects',
    },
    {
      value: 0,
      label: 'Completely impaired',
      description: 'No useful hand function',
    },
  ],
  helpText: 'Assess fine motor skills including grasp, pinch, and manipulation',
};

/**
 * Lower Extremity Specific Domains
 */

export const LIFTING_ABILITY_CONFIG: DomainConfig = {
  title: 'Lifting Ability',
  levels: [
    {
      value: 5,
      label: 'Normal',
      description: 'Normal lifting ability, no restrictions',
    },
    {
      value: 4,
      label: 'Slight restriction',
      description: 'Slight restriction on heavy lifting',
    },
    {
      value: 3,
      label: 'Moderate restriction',
      description: 'Moderate restriction, can lift more than 5 lbs',
    },
    {
      value: 2,
      label: 'Light restriction',
      description: 'Light restriction, can lift up to 5 lbs only',
    },
    {
      value: 1,
      label: 'Unable to lift',
      description: 'Unable to lift any significant weight',
    },
    {
      value: 0,
      label: 'N/A',
      description: 'Not applicable or completely unable',
    },
  ],
  helpText: 'Evaluate ability to lift and carry objects',
};

/**
 * Get score color based on value (for visual indicators)
 */
export const getScoreColor = (score: number): string => {
  if (score >= 4) return 'bg-green-100 border-green-300 text-green-800';
  if (score >= 2) return 'bg-yellow-100 border-yellow-300 text-yellow-800';
  return 'bg-red-100 border-red-300 text-red-800';
};

/**
 * Get score badge color class
 */
export const getScoreBadgeColor = (score: number): string => {
  if (score >= 4) return 'bg-green-500';
  if (score >= 2) return 'bg-yellow-500';
  return 'bg-red-500';
};

/**
 * Get interpretation color
 */
export const getInterpretationColor = (interpretation: string): string => {
  switch (interpretation) {
    case 'Excellent':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'Good':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'Fair':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'Poor':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

/**
 * Get all domain configs for a specific extremity type
 */
export const getDomainConfigsForExtremity = (extremityType: 'UPPER' | 'LOWER') => {
  const commonDomains = {
    pain: PAIN_CONFIG,
    function: FUNCTION_CONFIG,
    emotionalAcceptance: EMOTIONAL_ACCEPTANCE_CONFIG,
  };

  if (extremityType === 'UPPER') {
    return {
      ...commonDomains,
      handPositioning: HAND_POSITIONING_CONFIG,
      manualDexterity: MANUAL_DEXTERITY_CONFIG,
    };
  } else {
    return {
      ...commonDomains,
      liftingAbility: LIFTING_ABILITY_CONFIG,
    };
  }
};
