const container = document.getElementById("container");
const loading = document.getElementById("loading");
const searchInput = document.getElementById("search");

const API_KEY = "0bb48dc833ee4bd38a678403a769770a";

let games = [];


async function fetchGames(query = "gta") {
    loading.style.display = "block";
    container.innerHTML = "";

    try {
        const res = await fetch(
            `https://api.rawg.io/api/games?key=${API_KEY}&search=${query}`
        );

        const data = await res.json();
        games = data.results;

        displayGames(games);
    } catch (err) {
        console.log(err);
        container.innerHTML = "❌ Error loading games";
    }

    loading.style.display = "none";
}

// 🎨 Display Games
function displayGames(gamesArray) {
    container.innerHTML = "";

    if (gamesArray.length === 0) {
        container.innerHTML = "No games found";
        return;
    }

    gamesArray.forEach(game => {
        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
      <img src="${game.background_image || "https://via.placeholder.com/300"}" />
      <h3>${game.name}</h3>
      <p>⭐ Rating: ${game.rating}</p>
      <p> Released: ${game.released || "N/A"}</p>
      <button onclick="addToFavorites(${game.id})">❤️ Favorite</button>
    `;

        container.appendChild(div);
    });
}

let timeout;
searchInput.addEventListener("input", () => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
        fetchGames(searchInput.value);
    }, 500);
});

function sortByRating() {
    const sorted = [...games].sort((a, b) => b.rating - a.rating);
    displayGames(sorted);
}


function sortByDate() {
    const sorted = [...games].sort(
        (a, b) => new Date(b.released) - new Date(a.released)
    );
    displayGames(sorted);
}

function addToFavorites(id) {
    const selectedGame = games.find(game => game.id === id);

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    const alreadyExists = favorites.some(game => game.id === id);

    if (!alreadyExists) {
        favorites.push(selectedGame);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        alert("Added to favorites ❤️");
    } else {
        alert("Already in favorites 😅");
    }
}


fetchGames();