/**
 * Tests for tier.ts
 * Tier Configuration and Utility Functions
 */

import { describe, it, expect } from 'vitest';
import {
  TIER_LIMITS,
  canSaveChat,
  canUseFeature,
  getMaxChats,
  getUsagePercentage,
  isApproachingLimit,
  isAtLimit,
  getRemainingChats,
  isValidTier,
  getTierDisplayName,
  type Tier,
  type TierFeature
} from './tier';

describe('TIER_LIMITS', () => {
  it('should have hobbyist tier with max 50 chats', () => {
    expect(TIER_LIMITS.hobbyist.maxChats).toBe(50);
  });

  it('should have hobbyist tier with cloudSync disabled', () => {
    expect(TIER_LIMITS.hobbyist.cloudSync).toBe(false);
  });

  it('should have hobbyist tier with vectorSearch disabled', () => {
    expect(TIER_LIMITS.hobbyist.vectorSearch).toBe(false);
  });

  it('should have power_user tier with unlimited chats', () => {
    expect(TIER_LIMITS.power_user.maxChats).toBe(Infinity);
  });

  it('should have power_user tier with cloudSync enabled', () => {
    expect(TIER_LIMITS.power_user.cloudSync).toBe(true);
  });

  it('should have power_user tier with vectorSearch enabled', () => {
    expect(TIER_LIMITS.power_user.vectorSearch).toBe(true);
  });

  it('should have team tier with unlimited chats', () => {
    expect(TIER_LIMITS.team.maxChats).toBe(Infinity);
  });

  it('should have team tier with cloudSync enabled', () => {
    expect(TIER_LIMITS.team.cloudSync).toBe(true);
  });

  it('should have team tier with vectorSearch enabled', () => {
    expect(TIER_LIMITS.team.vectorSearch).toBe(true);
  });

  it('should have team tier with 5 team members', () => {
    expect(TIER_LIMITS.team.teamMembers).toBe(5);
  });
});

describe('canSaveChat', () => {
  describe('hobbyist tier', () => {
    it('should return true when chat count is below limit', () => {
      expect(canSaveChat('hobbyist', 49)).toBe(true);
    });

    it('should return true when chat count is 0', () => {
      expect(canSaveChat('hobbyist', 0)).toBe(true);
    });

    it('should return false when chat count equals limit', () => {
      expect(canSaveChat('hobbyist', 50)).toBe(false);
    });

    it('should return false when chat count exceeds limit', () => {
      expect(canSaveChat('hobbyist', 51)).toBe(false);
    });

    it('should return false when chat count is well over limit', () => {
      expect(canSaveChat('hobbyist', 100)).toBe(false);
    });
  });

  describe('power_user tier', () => {
    it('should always return true for any finite chat count', () => {
      expect(canSaveChat('power_user', 0)).toBe(true);
      expect(canSaveChat('power_user', 100)).toBe(true);
      expect(canSaveChat('power_user', 1000)).toBe(true);
      expect(canSaveChat('power_user', 10000)).toBe(true);
    });
  });

  describe('team tier', () => {
    it('should always return true for any finite chat count', () => {
      expect(canSaveChat('team', 0)).toBe(true);
      expect(canSaveChat('team', 100)).toBe(true);
      expect(canSaveChat('team', 1000)).toBe(true);
      expect(canSaveChat('team', 10000)).toBe(true);
    });
  });
});

describe('canUseFeature', () => {
  describe('cloudSync feature', () => {
    it('should return false for hobbyist tier', () => {
      expect(canUseFeature('hobbyist', 'cloudSync')).toBe(false);
    });

    it('should return true for power_user tier', () => {
      expect(canUseFeature('power_user', 'cloudSync')).toBe(true);
    });

    it('should return true for team tier', () => {
      expect(canUseFeature('team', 'cloudSync')).toBe(true);
    });
  });

  describe('vectorSearch feature', () => {
    it('should return false for hobbyist tier', () => {
      expect(canUseFeature('hobbyist', 'vectorSearch')).toBe(false);
    });

    it('should return true for power_user tier', () => {
      expect(canUseFeature('power_user', 'vectorSearch')).toBe(true);
    });

    it('should return true for team tier', () => {
      expect(canUseFeature('team', 'vectorSearch')).toBe(true);
    });
  });

  describe('teamMembers feature', () => {
    it('should return false for hobbyist tier', () => {
      expect(canUseFeature('hobbyist', 'teamMembers')).toBe(false);
    });

    it('should return false for power_user tier', () => {
      expect(canUseFeature('power_user', 'teamMembers')).toBe(false);
    });

    it('should return true for team tier', () => {
      expect(canUseFeature('team', 'teamMembers')).toBe(true);
    });
  });
});

describe('getMaxChats', () => {
  it('should return 50 for hobbyist tier', () => {
    expect(getMaxChats('hobbyist')).toBe(50);
  });

  it('should return Infinity for power_user tier', () => {
    expect(getMaxChats('power_user')).toBe(Infinity);
  });

  it('should return Infinity for team tier', () => {
    expect(getMaxChats('team')).toBe(Infinity);
  });
});

describe('getUsagePercentage', () => {
  describe('hobbyist tier', () => {
    it('should return 0 when chat count is 0', () => {
      expect(getUsagePercentage('hobbyist', 0)).toBe(0);
    });

    it('should return 50 when chat count is half of limit', () => {
      expect(getUsagePercentage('hobbyist', 25)).toBe(50);
    });

    it('should return 80 when at 80% of limit', () => {
      expect(getUsagePercentage('hobbyist', 40)).toBe(80);
    });

    it('should return 100 when at limit', () => {
      expect(getUsagePercentage('hobbyist', 50)).toBe(100);
    });

    it('should return 100 when over limit', () => {
      expect(getUsagePercentage('hobbyist', 60)).toBe(100);
    });
  });

  describe('power_user tier', () => {
    it('should return null for unlimited tier', () => {
      expect(getUsagePercentage('power_user', 0)).toBeNull();
      expect(getUsagePercentage('power_user', 100)).toBeNull();
      expect(getUsagePercentage('power_user', 1000)).toBeNull();
    });
  });

  describe('team tier', () => {
    it('should return null for unlimited tier', () => {
      expect(getUsagePercentage('team', 0)).toBeNull();
      expect(getUsagePercentage('team', 100)).toBeNull();
      expect(getUsagePercentage('team', 1000)).toBeNull();
    });
  });
});

describe('isApproachingLimit', () => {
  describe('hobbyist tier', () => {
    it('should return false when below 80%', () => {
      expect(isApproachingLimit('hobbyist', 39)).toBe(false);
    });

    it('should return true when at exactly 80%', () => {
      expect(isApproachingLimit('hobbyist', 40)).toBe(true);
    });

    it('should return true when over 80%', () => {
      expect(isApproachingLimit('hobbyist', 45)).toBe(true);
    });

    it('should return true when at limit', () => {
      expect(isApproachingLimit('hobbyist', 50)).toBe(true);
    });
  });

  describe('power_user tier', () => {
    it('should return false for unlimited tier', () => {
      expect(isApproachingLimit('power_user', 0)).toBe(false);
      expect(isApproachingLimit('power_user', 1000)).toBe(false);
    });
  });

  describe('team tier', () => {
    it('should return false for unlimited tier', () => {
      expect(isApproachingLimit('team', 0)).toBe(false);
      expect(isApproachingLimit('team', 1000)).toBe(false);
    });
  });
});

describe('isAtLimit', () => {
  describe('hobbyist tier', () => {
    it('should return false when below limit', () => {
      expect(isAtLimit('hobbyist', 49)).toBe(false);
    });

    it('should return true when at limit', () => {
      expect(isAtLimit('hobbyist', 50)).toBe(true);
    });

    it('should return true when over limit', () => {
      expect(isAtLimit('hobbyist', 51)).toBe(true);
    });
  });

  describe('power_user tier', () => {
    it('should always return false for unlimited tier', () => {
      expect(isAtLimit('power_user', 0)).toBe(false);
      expect(isAtLimit('power_user', 1000)).toBe(false);
    });
  });

  describe('team tier', () => {
    it('should always return false for unlimited tier', () => {
      expect(isAtLimit('team', 0)).toBe(false);
      expect(isAtLimit('team', 1000)).toBe(false);
    });
  });
});

describe('getRemainingChats', () => {
  describe('hobbyist tier', () => {
    it('should return 50 when chat count is 0', () => {
      expect(getRemainingChats('hobbyist', 0)).toBe(50);
    });

    it('should return 10 when chat count is 40', () => {
      expect(getRemainingChats('hobbyist', 40)).toBe(10);
    });

    it('should return 0 when at limit', () => {
      expect(getRemainingChats('hobbyist', 50)).toBe(0);
    });

    it('should return 0 when over limit', () => {
      expect(getRemainingChats('hobbyist', 60)).toBe(0);
    });
  });

  describe('power_user tier', () => {
    it('should return null for unlimited tier', () => {
      expect(getRemainingChats('power_user', 0)).toBeNull();
      expect(getRemainingChats('power_user', 1000)).toBeNull();
    });
  });

  describe('team tier', () => {
    it('should return null for unlimited tier', () => {
      expect(getRemainingChats('team', 0)).toBeNull();
      expect(getRemainingChats('team', 1000)).toBeNull();
    });
  });
});

describe('isValidTier', () => {
  it('should return true for valid tiers', () => {
    expect(isValidTier('hobbyist')).toBe(true);
    expect(isValidTier('power_user')).toBe(true);
    expect(isValidTier('team')).toBe(true);
  });

  it('should return false for invalid tiers', () => {
    expect(isValidTier('invalid')).toBe(false);
    expect(isValidTier('premium')).toBe(false);
    expect(isValidTier('')).toBe(false);
    expect(isValidTier('HOBBYIST')).toBe(false); // case sensitive
  });
});

describe('getTierDisplayName', () => {
  it('should return "Hobbyist" for hobbyist tier', () => {
    expect(getTierDisplayName('hobbyist')).toBe('Hobbyist');
  });

  it('should return "Power User" for power_user tier', () => {
    expect(getTierDisplayName('power_user')).toBe('Power User');
  });

  it('should return "Team" for team tier', () => {
    expect(getTierDisplayName('team')).toBe('Team');
  });
});
