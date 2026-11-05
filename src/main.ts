import "./style.css";

const app = document.querySelector<HTMLElement>("#app")!;

type GameState = {
  stardust: number;
  moths: number;
};

const state: GameState = { stardust: 0, moths: 0 };

const CLICK_BASE = 1;
const MOTH_COST = 15;
const MOTH_CLICK_MULTIPLIER = 2;

function clickPower(): number {
  return CLICK_BASE * Math.pow(MOTH_CLICK_MULTIPLIER, state.moths);
}

const heading = document.createElement("h1");
heading.textContent = "Star Gardener";

const tagline = document.createElement("p");
tagline.className = "tagline";
tagline.textContent = "The night sky is a garden gone to seed.";

const stardustCounter = document.createElement("p");
stardustCounter.id = "stardust-counter";

const plantStar = document.createElement("button");
plantStar.type = "button";
plantStar.id = "plant-star";
plantStar.textContent = "Plant a star";
plantStar.addEventListener("click", () => {
  state.stardust += clickPower();
  render();
});

const mothButton = document.createElement("button");
mothButton.type = "button";
mothButton.id = "moth-upgrade";
mothButton.addEventListener("click", () => {
  if (state.stardust < MOTH_COST) return;
  state.stardust -= MOTH_COST;
  state.moths += 1;
  render();
});

function render() {
  stardustCounter.textContent = `${Math.floor(state.stardust)} stardust`;
  mothButton.textContent = `Call a lantern moth (${MOTH_COST} stardust)`;
  mothButton.disabled = state.stardust < MOTH_COST;
}

// The Great Seed sheds light on its own: 1 stardust per second. Growth is
// integrated from elapsed real time, so it does not depend on frame rate.
const PASSIVE_STARDUST_PER_SECOND = 1;

let lastTick = performance.now();

function tick(now: number) {
  const elapsedSeconds = (now - lastTick) / 1000;
  lastTick = now;
  state.stardust += elapsedSeconds * PASSIVE_STARDUST_PER_SECOND;
  render();
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);

app.append(heading, tagline, stardustCounter, plantStar, mothButton);
render();
