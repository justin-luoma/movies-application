/**
 * es6 modules and imports
 */
/**
 * require style imports
 */
const {getMovies, editMovie, deleteMovie, addMovie} = require('./api.js');

const clickHandler = event => {
    if (event.target.classList.contains('movie-delete-btn')) {
        const id = parseInt(event.target.dataset.target);
        event.target.parentElement.classList.add('hide');
        document.getElementById(`edit-btn-${id}`).classList.add('hide');
        document.getElementById(`delete-load-${id}`).classList.remove('hide');
        deleteMovie(`http://localhost:8080/movies/${event.target.dataset.target}`)
            .then(getMoviesWrapper);
    }
    if (event.target.classList.contains('movie-edit-btn')) {
        const target = event.target.dataset.target;
        if (document.getElementById('modal-switch').checked) {
            const modalInstance = M.Modal.getInstance(document.getElementById(`modal-${target}`));
            modalInstance.open();
        } else {
            for (const elem of document.getElementsByClassName('collapsible-content')) {
                if (elem.id === `collapse-${target}`) {
                    elem.parentElement.parentElement.classList.toggle('hide');
                    elem.style.maxHeight = '63px';
                }
                else {
                    elem.parentElement.parentElement.classList.add('hide');
                    elem.style.maxHeight = '0';
                }
            }
        }
    }
    if (event.target.classList.contains('movie-edit-save-btn')) {
        const id = parseInt(event.target.dataset.target);
        event.target.parentElement.classList.add('hide');
        let titleElem;
        let ratingElem;
        if (event.target.dataset.type === "modal") {
            document.getElementById(`modal-loader-${id}`).classList.remove('hide');
            titleElem = document.getElementById(`modal-edit-movie-title-${id}`);
            ratingElem = document.getElementById(`modal-edit-movie-rating-${id}`);
        } else {
            document.getElementById(`loader-${id}`).classList.remove('hide');
            titleElem = document.getElementById(`edit-movie-title-${id}`);
            ratingElem = document.getElementById(`edit-movie-rating-${id}`);
        }
        titleElem.disabled = true;
        ratingElem.disabled = true;
        const data = {
            "title": titleElem.value,
            "rating": parseInt(ratingElem.value),
        };
        const instance = M.Modal.getInstance(document.getElementById(`modal-${id}`));
        editMovie(`http://localhost:8080/movies/${id}`, JSON.stringify(data))
            .then(getMoviesWrapper)
            .then(() => instance.close());
    }
    if (event.target.classList.contains('movie-add-btn')) {
        // const id = ++maxId;
        const titleInput = document.getElementById('add-movie-title');
        const ratingInput = document.getElementById('add-movie-rating');
        const data = {
            // "id": id.toString(),
            "title": titleInput.value,
            "rating": parseInt(ratingInput.value),
        };
        document.getElementById('add-btn').classList.add("disabled", "hide");
        document.getElementById('add-load').classList.remove('hide');
        titleInput.disabled = true;
        ratingInput.disabled = true;
        addMovie(JSON.stringify(data))
            .then(getMoviesWrapper)
                .then(() => {
                    const titleInput = document.getElementById('add-movie-title');
                    const ratingInput = document.getElementById('add-movie-rating');
                    titleInput.value = "";
                    ratingInput.value = "";
                    titleInput.disabled = false;
                    ratingInput.disabled = false;
                    document.getElementById('add-btn').classList.remove("hide");
                    document.getElementById('add-load').classList.add('hide');
                    M.updateTextFields();
                });
    }
};

const inputHandler = event => {
    const t = event.target;
    if (t.classList.contains('edit-movie')) {
        if (t.value.replace(/\s/g, '').toLowerCase() !== t.dataset.value) document.getElementById(`${t.dataset.id}`).classList.remove('disabled');
        else document.getElementById(`${t.dataset.id}`).classList.add('disabled');
    }
    if (t.classList.contains('add-movie')) {
        const [input1, input2] = document.getElementsByClassName('add-movie');
        const movieTitle = document.getElementById('add-movie-title').value.replace(/\s/g, '').toLowerCase();
        const movieTitleLabel = document.getElementById('add-movie-title-label');
        if (input1.value !== "" && input2.value !== "" && maxId !== -Infinity) {
            if (movieTitles.includes(movieTitle)) {
                movieTitleLabel.innerText = "That movie already exists";
            } else {
                movieTitleLabel.innerText = "Title";
                document.getElementById('add-btn').classList.remove('disabled');
            }
        }
    }
    if (t.classList.contains('modal-toggle')) {
        if (t.checked) {
            for (const elem of document.getElementsByClassName('collapsible-content')) {
                elem.parentElement.parentElement.classList.add('hide');
                elem.style.maxHeight = '0';
            }
        }
    }
};

const keypressHandler = event => {
    const t = event.target;
    const key = event.key;
    if (t.classList.contains('edit-movie') && key === "Enter") {
        const id = t.dataset.id;
        const btn = t.dataset.click;
        if (!document.getElementById(`${id}`).classList.contains('disabled')) {
            document.getElementById(`${btn}`).click();
        }
    }
    if (t.classList.contains('add-movie')) {
        if (!document.getElementById('add-btn').classList.contains('disabled')) {
            document.getElementById('add-btn-i').click();
        }
    }
};

window.maxId = -Infinity;
window.movieTitles = [];

const createTable = movies => {
    const tBody = document.getElementById('movie-tbl');
    let tBodyHtml = `<thead>
                    <tr>
                        <th>Title</th>
                        <th>Rating</th>
                        <th class="w-75px"></th>
                    </tr>
                    </thead>`;
    let modalContent = "";
    for (const {title, rating, id} of movies) {
        if (id > maxId) maxId = id;
        movieTitles.push(title.replace(/\s/g, '').toLowerCase());
        tBodyHtml += `<tbody>
                            <tr>
                                <td class="pl-1">${title}</td>
                                <td class="pl-1">${rating}</td>
                                <td class="pr-1 right w-100px">
                                    <a class="btn-floating btn-small waves-effect waves-light orange" id="edit-btn-${id}">
                                        <i data-target="${id}" class="material-icons movie-edit-btn">edit</i>
                                    </a>
                                    <div class="d-inlineBlock">
                                        <a class="btn-floating btn-small waves-effect waves-light red" id="delete-btn-${id}">
                                            <i data-target="${id}" class="material-icons movie-delete-btn">delete</i>
                                        </a>
                                        <div class="preloader-wrapper smaller active hide" id="delete-load-${id}">
                                            <div class="spinner-layer spinner-blue-only">
                                                <div class="circle-clipper left">
                                                    <div class="circle"></div>
                                                </div>
                                                <div class="gap-patch">
                                                    <div class="circle"></div>
                                                </div>
                                                <div class="circle-clipper right">
                                                    <div class="circle"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td> 
                            </tr>
                            <tr class="hide">
                                <td colspan="4">
                                    <div class="collapsible-content" id="collapse-${id}">
                                        <form class="col s12">
                                            <div class="row pos-rel">
                                                <div class="input-field col s9">
                                                    <input id="edit-movie-title-${id}" type="text" data-id="save-${id}"
                                                        data-value="${title.replace(/\s/g, '').toLowerCase()}"
                                                        data-click="save-btn-${id}"
                                                        class="validate edit-movie" value="${title}">
                                                    <label for="edit-movie-title-${id}">Title</label>
                                                </div>
                                                <div class="input-field col s2">
                                                    <input id="edit-movie-rating-${id}" type="number" max="5" min="0"
                                                        data-id="save-${id}" data-click="save-btn-${id}"
                                                        data-value="${rating}" class="validate edit-movie"
                                                        value="${rating}">
                                                    <label for="edit-movie-rating-${id}">Rating</label>
                                                </div>
                                                <div class="input-field col s1">
                                                    <a class="btn-floating btn-small waves-effect waves-light green disabled"
                                                        id="save-${id}">
                                                            <i data-target="${id}" data-type="collapse" id="save-btn-${id}"
                                                            class="material-icons movie-edit-save-btn">save</i>
                                                    </a>
                                                    
                                                    <div class="preloader-wrapper small active hide" id="loader-${id}">
                                                    <div class="spinner-layer spinner-blue">
                                                      <div class="circle-clipper left">
                                                        <div class="circle"></div>
                                                      </div><div class="gap-patch">
                                                        <div class="circle"></div>
                                                      </div><div class="circle-clipper right">
                                                        <div class="circle"></div>
                                                      </div>
                                                    </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                    </tbody>`
        modalContent += `
            <div id="modal-${id}" class="modal">
                <div class="modal-content">
                    <form class="col s12">
                        <div class="row">
                            <div class="input-field col s10">
                                <input id="modal-edit-movie-title-${id}" type="text" data-id="modal-save-${id}"
                                data-value="${title.replace(/\\s/g, '').toLowerCase()}" data-click="modal-save-btn-${id}"
                                class="validate edit-movie" value="${title}">
                                <label for="modal-edit-movie-title-${id}">Title</label>
                            </div>
                            <div class="input-field col s2">
                                <input id="modal-edit-movie-rating-${id}" type="number" max="5" min="0"
                                data-id="modal-save-${id}" data-value="${rating}" data-click="modal-save-btn-${id}"
                                class="validate edit-movie" value="${rating}">
                                <label for="modal-edit-movie-rating-${id}">Rating</label>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <a class="btn-floating btn-small waves-effect waves-light green disabled mr-05"
                        id="modal-save-${id}">
                        <i data-target="${id}" data-type="modal" id="modal-save-btn-${id}"
                        class="material-icons movie-edit-save-btn">save</i>
                    </a>
                    
                    <div class="preloader-wrapper small active mr-05 hide" id="modal-loader-${id}">
                        <div class="spinner-layer spinner-blue-only">
                            <div class="circle-clipper left">
                                <div class="circle"></div>
                            </div>
                            <div class="gap-patch">
                                <div class="circle"></div>
                            </div>
                            <div class="circle-clipper right">
                                <div class="circle"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
    tBody.innerHTML = tBodyHtml;
    document.getElementById('modalContent').innerHTML = modalContent;
    document.getElementById('loading').classList.add('hide');
    document.getElementById('movies').classList.remove('hide');
    let elems = document.querySelectorAll('.modal');
    M.Modal.init(elems, {"opacity": 0.75});
    M.updateTextFields();
};

document.addEventListener('click', clickHandler);

document.addEventListener('input', inputHandler);

document.addEventListener('keypress', keypressHandler);

window.onload = () => getMoviesWrapper();

function getMoviesWrapper() {
    window.maxId = -Infinity;
    window.movieTitles = [];
    return getMovies().then(createTable).catch((error) => {
        console.log(error);
    });
}
