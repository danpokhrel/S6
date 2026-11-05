import "./style.css";

const app = document.querySelector<HTMLElement>("#app")!;

type GameState = {
  stardust: number;
};

const state: GameState = { stardust: 0 };

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
  state.stardust += 1;
  render();
});

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

function render() {
  stardustCounter.textContent = `${Math.floor(state.stardust)} stardust`;
}

app.append(heading, tagline, stardustCounter, plantStar);
render();
