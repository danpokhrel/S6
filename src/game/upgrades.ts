// The garden's residents. Everything that makes one resident differ from
// another lives here as data: shared processing in state.ts and render.ts
// reads these entries, so adding a resident is adding an entry.
//
// Passive helpers (dew, comets) grow stardust over time; the moth carries
// light to the seed on each click.

export type Upgrade = {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  // Extra stardust per second granted by each copy of this upgrade.
  stardustPerSecond: number;
  // Extra stardust per click granted by each copy of this upgrade.
  stardustPerClick: number;
  owned: number;
};

export const upgrades: Upgrade[] = [
  {
    id: "moth",
    name: "Lantern moth",
    description: "Carries light from the flowers to the seed.",
    baseCost: 15,
    stardustPerSecond: 0,
    stardustPerClick: 1,
    owned: 0,
  },
  {
    id: "dewcatcher",
    name: "Dewcatcher",
    description: "Traps the dew that condenses from moonlight.",
    baseCost: 20,
    stardustPerSecond: 0.5,
    stardustPerClick: 0,
    owned: 0,
  },
  {
    id: "comet",
    name: "Comet plow",
    description: "Tills the dark soil of the sky.",
    baseCost: 150,
    stardustPerSecond: 3,
    stardustPerClick: 0,
    owned: 0,
  },
  {
    id: "nebula",
    name: "Nebula nursery",
    description:
      "A warm cloud where sprouting stars raise themselves into light.",
    baseCost: 1200,
    stardustPerSecond: 15,
    stardustPerClick: 0,
    owned: 0,
  },
];
