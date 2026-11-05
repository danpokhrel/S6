import "./style.css";

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

const heading = document.createElement("h1");
heading.textContent = "Star Gardener";

const tagline = document.createElement("p");
tagline.className = "tagline";
tagline.textContent = "The night sky is a garden gone to seed.";

const stardustCounter = document.createElement("p");
stardustCounter.id = "stardust-counter";

const rateLine = document.createElement("p");
rateLine.id = "rate-line";

const plantStar = document.createElement("button");
plantStar.type = "button";
plantStar.id = "plant-star";
plantStar.textContent = "Plant a star";
plantStar.addEventListener("click", () => {
  state.stardust += clickPower();
  render();
});

const shop = document.createElement("div");
shop.id = "shop";

const shopButtons = new Map<string, HTMLButtonElement>();
for (const upgrade of upgrades) {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.upgradeId = upgrade.id;
  button.addEventListener("click", () => {
    if (state.stardust < upgrade.baseCost) return;
    state.stardust -= upgrade.baseCost;
    upgrade.owned += 1;
    render();
  });
  shop.append(button);
  shopButtons.set(upgrade.id, button);
}

function render() {
  stardustCounter.textContent = `${Math.floor(state.stardust)} stardust`;
  const rate = stardustPerSecond();
  rateLine.textContent = rate > SEED_BASE_PER_SECOND
    ? `${rate} stardust per second`
    : "The seed sheds its own light: 1 stardust per second";
  for (const upgrade of upgrades) {
    const button = shopButtons.get(upgrade.id)!;
    button.textContent =
      `${upgrade.name} (${upgrade.baseCost}) — owned ${upgrade.owned}`;
    button.disabled = state.stardust < upgrade.baseCost;
    button.title = upgrade.description;
  }
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

app.append(heading, tagline, stardustCounter, rateLine, plantStar, shop);
render();
