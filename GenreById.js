const genreUrl = 'https://api.themoviedb.org/3/genre/movie/list?language=en';
const genreOptions = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmOTJiMTQ2MjM0NDM4ODI1YmI4MmFmYTZkMmYxNmQ5MCIsIm5iZiI6MTc0Nzc1NjM1OS42MTksInN1YiI6IjY4MmNhNTQ3OWMzOTJjMWU2MWY1NjQxOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Bf_LqZV9-xm47RN742pMgMDNXy7k248VfkQeYIFham4'
    }
};

const genres = {}

fetch(genreUrl, genreOptions)
    .then(res => res.json())
    .then(json => {
        for (const g of json.genres) {
            genres[g.id] = g.name;
        }
        console.log(genres)
    })
    .catch(err => console.error(err));