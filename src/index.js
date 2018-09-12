/**
 * es6 modules and imports
 */
/**
 * require style imports
 */
const {getMovies} = require('./api.js');

const clickHandler = event => {
    if (event.target.classList.contains('movie-delete-btn')) {
        console.log(event.target.dataset.target);
    }
};

const createTable = movies => {
    const tBody = document.getElementById('movie-tbl');
    let tBodyHtml = "";
    for(const {title, rating, id} of movies) {
        tBodyHtml +=`<tr>
                        <td class="pl-1">${title}</td>
                        <td class="pl-1">${rating}</td>
                        <td class="pr-1">
                            <a class="btn-floating btn-small waves-effect waves-light red right">
                                <i data-target="${id}" class="material-icons movie-delete-btn">delete</i>
                            </a>
                        </td>
                    </tr>`
    }
    tBody.innerHTML = tBodyHtml;
    document.getElementById('loading').classList.add('hide');
    document.getElementById('movies').classList.remove('hide');
};

getMovies().then(createTable).catch((error) => {
    console.log(error);
});

document.addEventListener('click', clickHandler);
