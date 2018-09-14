module.exports = {
    getMovies: () => {
        return fetch('/api/movies')
            .then(response => response.json());
    },
    editMovie: (url, jsonData) => {
        return fetch(url, {
            method: 'put',
            body: jsonData,
            headers: {"Content-Type": "application/json"},
        });
    },
    deleteMovie: (url) => {
        return fetch(url, {method: 'delete'});
    },
    addMovie: (jsonData) => {
        return fetch('/api/movies', {
            method: 'post',
            body: jsonData,
            headers: {"Content-Type": "application/json"},
        });
    },
};
