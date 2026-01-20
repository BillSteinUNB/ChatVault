/**
 * Tier Configuration and Utility Functions
 * 
 * Defines tier limits and provides helper functions for checking permissions
 */

export type Tier = 'hobbyist' | 'power_user' | 'team';
export type TierFeature = 'cloudSync' | 'vectorSearch' | 'teamMembers';

export interface TierLimits {
  maxChats: number;
  cloudSync: boolean;
  vectorSearch: boolean;
  teamMembers?: number;
}

export const TIER_LIMITS: Record<Tier, TierLimits> = {
  hobbyist: {
    maxChats: 50,
    cloudSync: false,
    vectorSearch: false,
  },
  power_user: {
    maxChats: Infinity,
    cloudSync: true,
    vectorSearch: true,
  },
  team: {
    maxChats: Infinity,
    cloudSync: true,
    vectorSearch: true,
    teamMembers: 5,
  }
};

/**
 * Check if a user can save a chat based on their tier and current chat count
 * @param tier - The user's tier
 * @param chatCount - The current number of chats
 * @returns true if the user can save a chat, false otherwise
 */
export function canSaveChat(tier: Tier, chatCount: number): boolean {
  const limits = TIER_LIMITS[tier];
  return chatCount < limits.maxChats;
}

/**
 * Check if a user can use a specific feature based on their tier
 * @param tier - The user's tier
 * @param feature - The feature to check
 * @returns true if the user can use the feature, false otherwise
 */
export function canUseFeature(tier: Tier, feature: TierFeature): boolean {
  const limits = TIER_LIMITS[tier];
  
  switch (feature) {
    case 'cloudSync':
      return limits.cloudSync;
    case 'vectorSearch':
      return limits.vectorSearch;
    case 'teamMembers':
      return 'teamMembers' in limits && (limits.teamMembers ?? 0) > 0;
    default:
      return false;
  }
}

/**
 * Get the maximum number of chats allowed for a tier
 * @param tier - The user's tier
 * @returns The maximum number of chats (Infinity for unlimited)
 */
export function getMaxChats(tier: Tier): number {
  return TIER_LIMITS[tier].maxChats;
}

/**
 * Get the usage percentage for a tier (for progress bars)
 * @param tier - The user's tier
 * @param chatCount - The current number of chats
 * @returns The usage percentage (0-100), or null if unlimited
 */
export function getUsagePercentage(tier: Tier, chatCount: number): number | null {
  const maxChats = getMaxChats(tier);
  
  if (maxChats === Infinity) {
    return null; // Unlimited tier, no percentage
  }
  
  return Math.min((chatCount / maxChats) * 100, 100);
}

/**
 * Check if the user is approaching their limit (80% or more)
 * @param tier - The user's tier
 * @param chatCount - The current number of chats
 * @returns true if usage is 80% or higher, false otherwise
 */
export function isApproachingLimit(tier: Tier, chatCount: number): boolean {
  const percentage = getUsagePercentage(tier, chatCount);
  return percentage !== null && percentage >= 80;
}

/**
 * Check if the user has reached their limit
 * @param tier - The user's tier
 * @param chatCount - The current number of chats
 * @returns true if at or over the limit, false otherwise
 */
export function isAtLimit(tier: Tier, chatCount: number): boolean {
  return !canSaveChat(tier, chatCount);
}

/**
 * Get the number of chats remaining before hitting the limit
 * @param tier - The user's tier
 * @param chatCount - The current number of chats
 * @returns The number of remaining chats, or null if unlimited
 */
export function getRemainingChats(tier: Tier, chatCount: number): number | null {
  const maxChats = getMaxChats(tier);
  
  if (maxChats === Infinity) {
    return null; // Unlimited
  }
  
  return Math.max(0, maxChats - chatCount);
}

/**
 * Validate if a string is a valid tier
 * @param tier - The tier string to validate
 * @returns true if valid tier, false otherwise
 */
export function isValidTier(tier: string): tier is Tier {
  return ['hobbyist', 'power_user', 'team'].includes(tier);
}

/**
 * Get the display name for a tier
 * @param tier - The tier
 * @returns The human-readable display name
 */
export function getTierDisplayName(tier: Tier): string {
  switch (tier) {
    case 'hobbyist':
      return 'Hobbyist';
    case 'power_user':
      return 'Power User';
    case 'team':
      return 'Team';
    default:
      return 'Unknown';
  }
}
