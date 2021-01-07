// API Key : 184723ca
// data request: http://www.omdbapi.com/?apikey=[yourkey]&s=movietosearch
// using Axios to fetch data from the API
const fetchData = async (searchTerm) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    //axios automatically sends request with the paramenters set
    params: {
      apikey: '184723ca',
      s: searchTerm,
    }
  });
  //the api gives an error on incomplete words
  //if the api sends back an Error, return an empty array
  if (response.data.Error) {
    return [];
  }
  return response.data.Search;
};

//Instead of hardcoding the dropdown into HTML, we make a reusable element
//classes are from Bulma framework
const root = document.querySelector('.autocomplete')
root.innerHTML = `
  <label><b>Search For a Movie</b></label>
  <input class='input'>
  <div class='dropdown'>
    <div class='dropdown-menu'>
      <div class='dropdown-content results'></div>
    </div>
  </div>
`;

const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

//fetchData is an async function. It will return a promise
//to get the data instead, we have to make onInput an async function as well
const onInput = async (event) => {
  const movies = await fetchData(event.target.value);
  //close the dropdown if input is empty
  if (!movies.length) {
    dropdown.classList.remove('is-active');
    return;
  }
  //reset the dropdown on every search
  resultsWrapper.innerHTML = '';
  // create the dropdown options
  dropdown.classList.add('is-active');
  for (let movie of movies) {
    //Bulma uses anchor to create options in a dropdown menu
    const option = document.createElement('a');
    //check for missing images
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster

    //create movie anchors in the dropdown
    option.classList.add('dropdown-item');
    option.innerHTML = `
      <img src="${movie.Poster}"/>
      ${movie.Title}
    `;
    //on click on an option, get movie info
    option.addEventListener('click', ()=>{
      dropdown.classList.remove('is-active');
      input.value = movie.Title;
      onMovieSelect(movie);
    })
    //append all the options to the dropdown
    resultsWrapper.appendChild(option)
  }
};

//debounce function found in utils.js
input.addEventListener('input', debounce(onInput,1000));
document.addEventListener('click', event => {
  if (!root.contains(event.target)) {
    dropdown.classList.remove('is-active')
  }
})

//use axios to get movie details, function similar to fetchData
const onMovieSelect = async (movie) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: '184723ca',
      i: movie.imdbID,
    }
  });
  document.querySelector('.summary').innerHTML = movieTemplate(response.data)
};

const movieTemplate = (movieDetail) => {
  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}"
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
}
