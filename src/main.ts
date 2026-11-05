import "./style.css";
// Vite turns this import into a production-safe URL. Keep it as a file so
// the Great Seed is a separately deployed asset.
// @deno-types="./asset-url.d.ts"
import greatStarUrl from "./assets/great-star.svg?no-inline";

const app = document.querySelector<HTMLElement>("#app")!;

type Upgrade = {
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

// The garden's residents. Passive helpers (dew, comets) grow stardust over
// time; the moth carries light to the seed on each click.
const upgrades: Upgrade[] = [
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
];

type GameState = {
  stardust: number;
};

const state: GameState = { stardust: 0 };

const CLICK_BASE = 1;
// The Great Seed sheds its own light even before anything is planted.
const SEED_BASE_PER_SECOND = 1;

// Each copy of an upgrade makes the next one more expensive, so the
// garden's growth must be planned rather than spammed.
const COST_GROWTH = 1.35;

function upgradeCost(upgrade: Upgrade): number {
  return Math.ceil(upgrade.baseCost * Math.pow(COST_GROWTH, upgrade.owned));
}

function clickPower(): number {
  return (
    CLICK_BASE +
    upgrades.reduce(
      (total, upgrade) => total + upgrade.stardustPerClick * upgrade.owned,
      0,
    )
  );
}

function stardustPerSecond(): number {
  return (
    SEED_BASE_PER_SECOND +
    upgrades.reduce(
      (total, upgrade) => total + upgrade.stardustPerSecond * upgrade.owned,
      0,
    )
  );
}

function formatStardust(value: number): string {
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
greatSeed.addEventListener("click", (event) => {
  const harvest = clickPower();
  state.stardust += harvest;
  floatHarvest(event, harvest);
  render();
});

const seedImage = document.createElement("img");
seedImage.src = greatStarUrl;
seedImage.alt = "The Great Seed, a dim star waiting to be woken";
seedImage.draggable = false;

const shop = document.createElement("div");
shop.id = "shop";

const shopCards = new Map<string, HTMLButtonElement>();
for (const upgrade of upgrades) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "shop-card";
  card.dataset.upgradeId = upgrade.id;
  card.addEventListener("click", () => {
    const cost = upgradeCost(upgrade);
    if (state.stardust < cost) return;
    state.stardust -= cost;
    upgrade.owned += 1;
    render();
  });
  shop.append(card);
  shopCards.set(upgrade.id, card);
}

function floatHarvest(event: MouseEvent, harvest: number) {
  const seedRect = greatSeed.getBoundingClientRect();
  const mote = document.createElement("span");
  mote.className = "harvest-mote";
  mote.textContent = `+${formatStardust(harvest)}`;
  mote.style.left = `${event.clientX - seedRect.left}px`;
  mote.style.top = `${event.clientY - seedRect.top}px`;
  mote.addEventListener("animationend", () => mote.remove());
  greatSeed.append(mote);
}

function render() {
  stardustCounter.textContent = `✦ ${formatStardust(state.stardust)} stardust`;
  const rate = stardustPerSecond();
  rateLine.textContent = rate > SEED_BASE_PER_SECOND
    ? `${rate} stardust per second`
    : "The seed sheds its own light: 1 stardust per second";
  for (const upgrade of upgrades) {
    const card = shopCards.get(upgrade.id)!;
    const cost = upgradeCost(upgrade);
    const affordable = state.stardust >= cost;
    const effect = upgrade.stardustPerClick > 0
      ? `+${upgrade.stardustPerClick} per click`
      : `+${upgrade.stardustPerSecond} per second`;
    card.innerHTML = "";
    const name = document.createElement("span");
    name.className = "shop-name";
    name.textContent = upgrade.name;
    const meta = document.createElement("span");
    meta.className = "shop-meta";
    meta.textContent = `costs ${formatStardust(cost)} — owned ${upgrade.owned}`;
    const detail = document.createElement("span");
    detail.className = "shop-detail";
    detail.textContent = `${upgrade.description} ${effect}.`;
    card.append(name, meta, detail);
    card.disabled = !affordable;
  }
}

// A field of background stars, each twinkling on its own rhythm.
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

// Growth is integrated from elapsed real time, so it does not depend on
// frame rate.
let lastTick = performance.now();

function tick(now: number) {
  const elapsedSeconds = (now - lastTick) / 1000;
  lastTick = now;
  state.stardust += elapsedSeconds * stardustPerSecond();
  render();
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);

greatSeed.append(seedImage);
app.append(
  sky,
  heading,
  tagline,
  stardustCounter,
  rateLine,
  greatSeed,
  shop,
);
render();
