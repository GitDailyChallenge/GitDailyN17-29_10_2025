const checkGuessButton = document.getElementById("checkGuess");
checkGuessButton.addEventListener("click", checkGuess);
const result = document.getElementById("result");
let randomPokemon = null;
let failedAttempts = 0;
let numberOfAttempts = 0;
const attemptsDisplay = document.getElementById("attempts");
const darkModeButton = document.getElementById("dark-mode");
const pokemonImage = document.getElementById("pokemon-image");

darkModeButton.addEventListener("click", () => {
  console.log("toggled");
  pokemonImage.classList.toggle("dark-mode");
});

async function getAllFrenchPokemon() {
  const pokemons = [];

  for (let i = 1; i <= 151; i++) {
    const [pokemonRes, speciesRes] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${i}`),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${i}`),
    ]);

    const pokemon = await pokemonRes.json();
    const species = await speciesRes.json();
    const frenchName = species.names.find((n) => n.language.name === "fr").name;

    pokemons.push({
      id: i,
      name: frenchName,
      image: pokemon.sprites.other["official-artwork"].front_default,
    });
  }
  return pokemons;
}

function displayPokemon() {
  result.textContent = "";
  document.getElementById("guess").value = "";
  const pokemons = [];
  getAllFrenchPokemon().then((data) => {
    data.forEach((pokemon) => {
      pokemons.push(pokemon);
    });
    randomPokemon = pokemons[Math.floor(Math.random() * pokemons.length)];
    console.log(randomPokemon.name);
    document.getElementById("pokemon-image").src = randomPokemon.image;
  });
}

function checkGuess() {
  attemptsDisplay.style.display = "block";
  const guess = document.getElementById("guess").value.toLowerCase();
  const normGuess = normalizeName(guess);
  const normPokemonName = normalizeName(randomPokemon.name);
  if (normGuess === normPokemonName) {
    result.textContent = "✅ Correct!";
  } else {
    result.textContent = `❌ Nope, it was ${randomPokemon.name}`;
    failedAttempts++;
  }
  numberOfAttempts++;
  attemptsDisplay.textContent = `Attempts: ${numberOfAttempts}, Failed: ${failedAttempts}`;

  setTimeout(displayPokemon, 2000);
}
function normalizeName(name) {
  return name
    .toLowerCase()
    .normalize("NFD") // separate accents from letters
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z]/g, ""); // keep only letters a–z
}

displayPokemon();
