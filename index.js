async function getData(query) {
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
const searchInputEl = document.getElementById("search-input");
const searchButtonEl = document.getElementById("search-button");
const searchResultsEl = document.getElementById("search-results");
const randomButtonEl = document.getElementById("random-button");



searchButtonEl.addEventListener("click", async function (event) {
    const json = await getData(searchInputEl.value)
    if (json.results.length == 0) {
        console.log("No results!")
    } else {
        console.log(json)
        searchResultsEl.innerHTML = "";
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
