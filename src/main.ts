import "./style.css";
import { buildUi } from "./game/render.ts";
import {
  buyUpgrade,
  createGameState,
  growStardust,
  plantSeed,
} from "./game/state.ts";

const app = document.querySelector<HTMLElement>("#app")!;
const state = createGameState();

const render = buildUi(app, {
  onPlant: () => {
    const harvest = plantSeed(state);
    render(state);
    return harvest;
  },
  onBuy: (upgrade) => {
    const bought = buyUpgrade(state, upgrade);
    if (bought) render(state);
    return bought;
  },
});

// Passive growth is integrated from elapsed real time every frame, so it
// does not depend on frame rate.
let lastTick = performance.now();

function tick(now: number) {
  const elapsedSeconds = (now - lastTick) / 1000;
  lastTick = now;
  growStardust(state, elapsedSeconds);
  render(state);
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
render(state);
