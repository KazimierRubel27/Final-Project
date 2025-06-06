async function getData(query) {
    await fillGenres();
    const url = "https://api.themoviedb.org/3/search/movie?query=" + query.replaceAll(" ", "+");
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmOTJiMTQ2MjM0NDM4ODI1YmI4MmFmYTZkMmYxNmQ5MCIsIm5iZiI6MTc0Nzc1NjM1OS42MTksInN1YiI6IjY4MmNhNTQ3OWMzOTJjMWU2MWY1NjQxOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Bf_LqZV9-xm47RN742pMgMDNXy7k248VfkQeYIFham4",
            }
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error.message);
    }
}
async function getRandomMovie() {
    await fillGenres();
    const url = "https://api.themoviedb.org/3/movie/popular?page=" + Math.floor(Math.random() * 20 + 1);
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmOTJiMTQ2MjM0NDM4ODI1YmI4MmFmYTZkMmYxNmQ5MCIsIm5iZiI6MTc0Nzc1NjM1OS42MTksInN1YiI6IjY4MmNhNTQ3OWMzOTJjMWU2MWY1NjQxOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Bf_LqZV9-xm47RN742pMgMDNXy7k248VfkQeYIFham4",
            }
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        const results = json.results;
        return results[Math.floor(Math.random() * results.length)];
    } catch (error) {
        console.error(error.message);
    }
}
async function getMovieByGenre(genre = 'action') {
    await fillGenres();
    let found_genre_id = -1
    for (const [genre_id, genre_name] of Object.entries(genres)) {
        if (genre.toLowerCase() == genre_name.toLowerCase()) {
            found_genre_id = genre_id;
        }
    }
    // found_genre_id = Object.entries(genres).find(([k,v]) => v == genre)[0]
    const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${found_genre_id}`;
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmOTJiMTQ2MjM0NDM4ODI1YmI4MmFmYTZkMmYxNmQ5MCIsIm5iZiI6MTc0Nzc1NjM1OS42MTksInN1YiI6IjY4MmNhNTQ3OWMzOTJjMWU2MWY1NjQxOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Bf_LqZV9-xm47RN742pMgMDNXy7k248VfkQeYIFham4",
            }
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        const results = json.results;
        const randomInt = Math.abs(Math.random() * results.length - 20);
        return results.slice(randomInt, randomInt + 20);
    } catch (error) {
        console.error(error.message);
    }
}
async function loadGenreList() {
    await fillGenres();
    searchResultsEl.innerHTML = "";
    randomResultsEl.innerHTML = "";
    genresDisplayEl.innerHTML = "<p>Available Genres</p>";
    const ul = document.createElement("ul");
    for (const [genre_id, genre_name] of Object.entries(genres)) {
        const li = document.createElement("li");
        li.textContent = `genre Name: ${genre_name} genre Id: ${genre_id}`;
        ul.appendChild(li);
    }
    genresDisplayEl.appendChild(ul);
};


const searchInputEl = document.getElementById("search-input");
const searchButtonEl = document.getElementById("search-button");
const searchResultsEl = document.getElementById("search-results");
const randomButtonEl = document.getElementById("random-button");
const randomResultsEl = document.getElementById("random-results");
const genreInputEl = document.getElementById("genre-input");
const genreButtonEl = document.getElementById("genre-button");
const showGenresButtonEl = document.getElementById("show-genres");
const genresDisplayEl = document.getElementById("genres-list");
loadGenreList();

searchButtonEl.addEventListener("click", async function (event) {
    const json = await getData(searchInputEl.value)
    if (json.results.length == 0) {
        console.log("No results!")
    } else {
        console.log(json)
        searchResultsEl.innerHTML = "";
        randomResultsEl.innerHTML = "";
        for (const result of json.results) {
            const resultEl = document.createElement("div");
            const imgEl = document.createElement("img");
            imgEl.src = "https://image.tmdb.org/t/p/original/" + result.poster_path;
            imgEl.width = "100";
            imgEl.style.border = "1px solid red";
            resultEl.textContent = result.title + " Genres: " + result["genre_ids"].map(id => genres[id]).join(", ");
            resultEl.appendChild(imgEl);
            searchResultsEl.appendChild(resultEl);
        }
    }
});
randomButtonEl.addEventListener("click", async function (event) {
    const randomMovie = await getRandomMovie();
    searchResultsEl.innerHTML = "";
    randomResultsEl.innerHTML = "";
    const resultEl = document.createElement("div");
    const imgEl = document.createElement("img");
    imgEl.src = "https://image.tmdb.org/t/p/original/" + randomMovie.poster_path;
    imgEl.width = "100";

    resultEl.innerHTML = randomMovie.title + "<br> Genre: " + randomMovie["genre_ids"].map(id => genres[id]).join(", ")
    resultEl.appendChild(imgEl);
    randomResultsEl.appendChild(resultEl);
});
genreButtonEl.addEventListener("click", async function (event) {
    const rand = await getMovieByGenre(genreInputEl.value || undefined)
    if (rand.length == 0) {
        console.log("No movies in that genre")
    } else {
        console.log(rand)
        searchResultsEl.innerHTML = "";
        randomResultsEl.innerHTML = "";
        for (const result of rand) {
            const resultEl = document.createElement("div");
            const imgEl = document.createElement("img");
            imgEl.src = "https://image.tmdb.org/t/p/original/" + result.poster_path;
            imgEl.width = "100";
            resultEl.textContent = result.title + " Genres: " + result["genre_ids"].map(id => genres[id]).join(", ");
            resultEl.appendChild(imgEl);
            searchResultsEl.appendChild(resultEl);
        }
    }
});
showGenresButtonEl.addEventListener("click", async function () {
    // loadGenreList();
    searchResultsEl.innerHTML = "";
    randomResultsEl.innerHTML = "";
    const info = document.getElementById("genres-list");
    info.classList.toggle("hidden");
}
);