import "./style.css";

const app = document.querySelector<HTMLElement>("#app")!;

const heading = document.createElement("h1");
heading.textContent = "Star Gardener";

const tagline = document.createElement("p");
tagline.className = "tagline";
tagline.textContent = "The night sky is a garden gone to seed.";

const plantStar = document.createElement("button");
plantStar.type = "button";
plantStar.id = "plant-star";
plantStar.textContent = "Plant a star";
plantStar.addEventListener("click", () => {
  console.log("Planted a star.");
});

app.append(heading, tagline, plantStar);
