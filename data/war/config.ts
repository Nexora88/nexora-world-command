export const WAR_CONFIG = {
  baseAttackStrength: 100,
  armyMoraleMultiplier: 0.5,
  armyOrganizationMultiplier: 0.5,
  fortificationDefensePerLevel: 0.2,
  defenseBaseMultiplier: 1,
  randomFactorMin: 0.9,
  randomFactorMax: 1.1,
  attackerCasualtyRate: 0.08,
  defenderCasualtyRate: 0.1,
  moraleLossPerBattle: 8,
  organizationLossPerBattle: 12,
  retreatOrganizationThreshold: 15,
  captureWarScore: 20,
  battleWarScore: 10,
} as const;

export const FORTIFICATION_CONFIG: Record<0 | 1 | 2 | 3, number> = {
  0: 0,
  1: 0.2,
  2: 0.4,
  3: 0.6,
};
