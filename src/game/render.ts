// What the garden looks like. This module builds the interface and paints
// the current state; it decides nothing about how stardust moves.

// @deno-types="../asset-url.d.ts"
import greatStarUrl from "../assets/great-star.svg?no-inline";
import type { GameState } from "./state.ts";
import { stardustPerSecond, upgradeCost } from "./state.ts";
import { type Upgrade, upgrades } from "./upgrades.ts";

export type UiCallbacks = {
  // Plants a star; returns the harvest so a mote can show its size.
  onPlant: (event: MouseEvent) => number;
  onBuy: (upgrade: Upgrade) => void;
};

export function formatStardust(value: number): string {
  if (value < 1000) return Math.floor(value).toString();
  const units = ["K", "M", "B", "T"];
  let scaled = value;
  let unitIndex = -1;
  while (scaled >= 1000 && unitIndex < units.length - 1) {
    scaled /= 1000;
    unitIndex += 1;
  }
  const digits = scaled < 10 ? 2 : 1;
  return `${scaled.toFixed(digits)}${units[unitIndex]}`;
}

// Builds every element inside the app root and returns a render function
// that repaints the interface from a game state.
export function buildUi(
  root: HTMLElement,
  callbacks: UiCallbacks,
): (state: GameState) => void {
  const sky = document.createElement("div");
  sky.id = "sky";
  for (let i = 0; i < 70; i += 1) {
    const star = document.createElement("span");
    star.className = "sky-star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    const size = 1 + Math.random() * 2;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.animationDuration = `${2 + Math.random() * 4}s`;
    star.style.animationDelay = `${Math.random() * 4}s`;
    sky.append(star);
  }

  const heading = document.createElement("h1");
  heading.textContent = "Star Gardener";

  const tagline = document.createElement("p");
  tagline.className = "tagline";
  tagline.textContent = "The night sky is a garden gone to seed. Tend it.";

  const stardustCounter = document.createElement("p");
  stardustCounter.id = "stardust-counter";

  const rateLine = document.createElement("p");
  rateLine.id = "rate-line";

  const greatSeed = document.createElement("button");
  greatSeed.type = "button";
  greatSeed.id = "great-seed";
  greatSeed.setAttribute("aria-label", "Plant a star");

  // A soft halo that puffs out behind the seed on every press.
  const seedFlare = document.createElement("span");
  seedFlare.className = "seed-flare";
  greatSeed.append(seedFlare);

  greatSeed.addEventListener("click", (event) => {
    const harvest = callbacks.onPlant(event);
    floatHarvest(greatSeed, event, harvest);
    shockwave(greatSeed, event);
    sparkBurst(greatSeed, event);
    seedFlarePuff(seedFlare);
    flashSeed(greatSeed);
    punch(stardustCounter);
  });

  const seedImage = document.createElement("img");
  seedImage.src = greatStarUrl;
  seedImage.alt = "The Great Seed, a dim star waiting to be woken";
  seedImage.draggable = false;
  greatSeed.append(seedImage);

  const shop = document.createElement("div");
  shop.id = "shop";

  const shopCards = new Map<string, HTMLButtonElement>();
  for (const upgrade of upgrades) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "shop-card";
    card.addEventListener("click", () => callbacks.onBuy(upgrade));
    shop.append(card);
    shopCards.set(upgrade.id, card);
  }

  root.append(
    sky,
    heading,
    tagline,
    stardustCounter,
    rateLine,
    greatSeed,
    shop,
  );

  return (state) => {
    stardustCounter.textContent = `✦ ${
      formatStardust(state.stardust)
    } stardust`;
    const rate = stardustPerSecond();
    rateLine.textContent = rate > 1
      ? `${rate} stardust per second`
      : "The seed sheds its own light: 1 stardust per second";
    for (const upgrade of upgrades) {
      const card = shopCards.get(upgrade.id)!;
      const cost = upgradeCost(upgrade);
      const effect = upgrade.stardustPerClick > 0
        ? `+${upgrade.stardustPerClick} per click`
        : `+${upgrade.stardustPerSecond} per second`;
      card.innerHTML = "";
      const name = document.createElement("span");
      name.className = "shop-name";
      name.textContent = upgrade.name;
      const meta = document.createElement("span");
      meta.className = "shop-meta";
      meta.textContent = `costs ${
        formatStardust(cost)
      } — owned ${upgrade.owned}`;
      const detail = document.createElement("span");
      detail.className = "shop-detail";
      detail.textContent = `${upgrade.description} ${effect}.`;
      card.append(name, meta, detail);
      card.disabled = state.stardust < cost;
    }
  };
}

// Removes the element once its one-shot animation has certainly finished.
// CSS animations pause in hidden tabs, so animationend alone is not a
// reliable cleanup signal.
function transient(element: HTMLElement, milliseconds: number): void {
  element.addEventListener("animationend", () => element.remove());
  setTimeout(() => element.remove(), milliseconds);
}

function floatHarvest(
  seed: HTMLElement,
  event: MouseEvent,
  harvest: number,
): void {
  const seedRect = seed.getBoundingClientRect();
  const mote = document.createElement("span");
  mote.className = "harvest-mote";
  mote.textContent = `+${formatStardust(harvest)}`;
  mote.style.left = `${event.clientX - seedRect.left}px`;
  mote.style.top = `${event.clientY - seedRect.top}px`;
  transient(mote, 1000);
  seed.append(mote);
}

// A ring that expands from the press point and fades away.
function shockwave(seed: HTMLElement, event: MouseEvent): void {
  const seedRect = seed.getBoundingClientRect();
  const ring = document.createElement("span");
  ring.className = "shockwave";
  ring.style.left = `${event.clientX - seedRect.left}px`;
  ring.style.top = `${event.clientY - seedRect.top}px`;
  transient(ring, 600);
  seed.append(ring);
}

// A handful of stardust sparks thrown outward from the press point.
function sparkBurst(seed: HTMLElement, event: MouseEvent): void {
  const seedRect = seed.getBoundingClientRect();
  const sparks = 10;
  for (let i = 0; i < sparks; i += 1) {
    const spark = document.createElement("span");
    spark.className = "spark";
    const angle = (i / sparks) * 2 * Math.PI + Math.random() * 0.5;
    const distance = 38 + Math.random() * 34;
    spark.style.left = `${event.clientX - seedRect.left}px`;
    spark.style.top = `${event.clientY - seedRect.top}px`;
    spark.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    spark.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    spark.style.animationDuration = `${0.45 + Math.random() * 0.25}s`;
    transient(spark, 800);
    seed.append(spark);
  }
}

// Puffs the halo behind the seed. Restarting the class re-runs the puff
// even when presses land mid-animation.
function seedFlarePuff(flare: HTMLElement): void {
  flare.classList.remove("puff");
  void flare.offsetWidth;
  flare.classList.add("puff");
}

// One bright flash-and-pop of the whole seed per press.
function flashSeed(seed: HTMLElement): void {
  seed.classList.remove("flash");
  void seed.offsetWidth;
  seed.classList.add("flash");
}

// A quick scale pop on the stardust counter.
function punch(counter: HTMLElement): void {
  counter.classList.remove("punch");
  void counter.offsetWidth;
  counter.classList.add("punch");
}
