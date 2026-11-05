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

function render() {
  stardustCounter.textContent = `${state.stardust} stardust`;
}

app.append(heading, tagline, stardustCounter, plantStar);
render();
