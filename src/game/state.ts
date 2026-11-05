// The rules of the garden. This module owns every number that decides how
// stardust moves: it knows nothing about the DOM, and nothing outside it
// mutates stardust.

import { type Upgrade, upgrades } from "./upgrades.ts";

export type GameState = {
  stardust: number;
};

const CLICK_BASE = 1;
// The Great Seed sheds its own light even before anything is planted.
const SEED_BASE_PER_SECOND = 1;

// Each copy of an upgrade makes the next one more expensive, so the
// garden's growth must be planned rather than spammed.
const COST_GROWTH = 1.35;

export function createGameState(): GameState {
  return { stardust: 0 };
}

export function upgradeCost(upgrade: Upgrade): number {
  return Math.ceil(upgrade.baseCost * Math.pow(COST_GROWTH, upgrade.owned));
}

export function clickPower(): number {
  return (
    CLICK_BASE +
    upgrades.reduce(
      (total, upgrade) => total + upgrade.stardustPerClick * upgrade.owned,
      0,
    )
  );
}

export function stardustPerSecond(): number {
  return (
    SEED_BASE_PER_SECOND +
    upgrades.reduce(
      (total, upgrade) => total + upgrade.stardustPerSecond * upgrade.owned,
      0,
    )
  );
}

// Plants light in the seed: adds the harvest and returns how much it was.
export function plantSeed(state: GameState): number {
  const harvest = clickPower();
  state.stardust += harvest;
  return harvest;
}

// Buys one copy of the upgrade if affordable; reports whether it happened.
export function buyUpgrade(state: GameState, upgrade: Upgrade): boolean {
  const cost = upgradeCost(upgrade);
  if (state.stardust < cost) return false;
  state.stardust -= cost;
  upgrade.owned += 1;
  return true;
}

// Passive growth integrated over elapsed real time, so it does not depend
// on frame rate.
export function growStardust(state: GameState, elapsedSeconds: number): void {
  state.stardust += elapsedSeconds * stardustPerSecond();
}
