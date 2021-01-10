// API Key : 184723ca
// data request: http://www.omdbapi.com/?apikey=[yourkey]&s=movietosearch
//function from autocomplete.js
const autoCompleteConfig = {
  renderOption: (movie)=>{
    //check for missing images
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster
    return `
      <img src="${movie.Poster}"/>
      ${movie.Title} (${movie.Year})
    `;
  },
  inputValue(movie) {
    return movie.Title
  },
  // using Axios to fetch data from the API
  async fetchData(searchTerm) {
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
  }
};

createAutoComplete({
  //destructure autocompleteconfig inside the createautocomplete function.
  //the only variable changing is the root
  //onOptionSelect here to get movieTemplate for both columns
  ...autoCompleteConfig,
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect(movie) {
    //hide the tutorial bar on selecting the movie
    //.is-hidden is a bulma class
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
  },
});

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
  },
});

//create variables for each movie to compare them later
let leftMovie;
let rightMovie;
//use axios to get movie details, function similar to fetchData
const onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: '184723ca',
      i: movie.imdbID,
    }
  });
  //create movie detail templates inside html
  summaryElement.innerHTML = movieTemplate(response.data);
  //check the side of the search and compare the movies
  //runComparison helper function defined later
  if (side==='left') {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }
  //runComparison will run only when both movies have been chosen
  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = () => {
  const leftSideStats = document.querySelectorAll('#left-summary .notification');
  const rightSideStats = document.querySelectorAll('#right-summary .notification');

leftSideStats.forEach((leftStat, index)=> {
  const rightStat = rightSideStats[index];
  //dataset.value to retrieve the data-value
  const leftSideValue = parseInt(leftStat.dataset.value);
  const rightSideValue = parseInt(rightStat.dataset.value);

  if (rightSideValue > leftSideValue) {
    leftStat.classList.remove('is-primary');
    leftStat.classList.add('is-warning');
  } else {
    rightStat.classList.remove('is-primary');
    rightStat.classList.add('is-warning');
  }
  });
};

const movieTemplate = (movieDetail) => {
  const dollars = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '')
  );
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
  // let count = 0;
  //can use forEach instead of reduce, the latter is a refactor
  const awards = movieDetail.Awards.split(' ').reduce((prev, word)=>{
    //parseInt on a string not number will return NaN
    const value = parseInt(word);
    //isNaN() is a built in function in the browser
    if (isNaN(value)) {
      return prev;
    } else {
      return prev + value;
    };
  });
  //for every element in the details we add a 'data-value' property
  //use the property to compare the two movies
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
    <article data-value=${awards} class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${metascore} class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
}
