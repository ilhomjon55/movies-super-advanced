// Get HTML elements
const elFormSearch = $_('.js-movies__form-search')
const elInputSearch = $_('.js-movies__form-input', elFormSearch)
const elListMovies = $_('.js-movies__list-title')
const elListPagination = $_('.js-pagination')
const elTemplateMovieTitleItem = $_('.movies__title-item-template').content
const elTemplatePaginationItem = $_('.pagination__item-template').content

// Movie info
const elMovieInfoWrapper = $_('.movies__right-wrapper')
const elMovieInfoTemplate = $_('.movie__info-template').content


// My Omdb api id
const API_KEY = '6556da72'
const pageSize = 10
let pageCount;

// Found movies empty 
let foundMovies = []


// Funtion creates movie item by title
let createMovieTitleItem = movie => {
   elNewMovieTitle = elTemplateMovieTitleItem.cloneNode(true)

   $_('.movies__title-text', elNewMovieTitle).textContent = movie.Title
   $_('.movies__info-btn', elNewMovieTitle).dataset.imdbId = movie.imdbID

   return elNewMovieTitle
}


// Function renders movies title
let renderMoviesTitle = movies => {
   elListMovies.innerHTML = ''

   elMoviesTitleFragment = document.createDocumentFragment()

   movies.forEach(movie => {
      elMoviesTitleFragment.appendChild(createMovieTitleItem(movie))
   })

   elListMovies.appendChild(elMoviesTitleFragment)

}

// Funtion renders Pagination items
let renderPaginationItems = moviesNumber => {
   elListPagination.innerHTML = ''

   pageCount = Math.ceil(moviesNumber / pageSize)


   elFragmentPaginationItems = document.createDocumentFragment()

   for (let i = 1; i <= pageCount; i++) {
      let elNewPaginationItem = elTemplatePaginationItem.cloneNode(true)

      $_('.page-link', elNewPaginationItem).textContent = i
      $_('.page-link', elNewPaginationItem).dataset.Id = i

      elFragmentPaginationItems.appendChild(elNewPaginationItem)
   }

   elListPagination.appendChild(elFragmentPaginationItems)
}

// Submit function of elFormSearch
let onElFormSearchSubmit = evt => {
   evt.preventDefault()

   inputSearch = elInputSearch.value.trim()

   fetch(`https://omdbapi.com/?apikey=${API_KEY}&s=${inputSearch}`).then(response => {

      if (!response.ok) {
         throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      return response.json()
   }).then(data => {

      foundMovies = data.Search

      renderMoviesTitle(foundMovies)
      renderPaginationItems(data.totalResults)

   })


   // Little UI
   elInputSearch.value = ''
   elInputSearch.focus()

}

// Add callback
elFormSearch.addEventListener('submit', onElFormSearchSubmit)

// Funtionn renders movie info
let renderMovieInfo = movie => {
   elMovieInfoWrapper.innerHTML = ''
   elNewMovieInfo = elMovieInfoTemplate.cloneNode(true)

   $_('.movie__title', elNewMovieInfo).textContent = movie.Title
   $_('.movie__img-poster', elNewMovieInfo).src = movie.Poster
   $_('.movie__imdbId-inner', elNewMovieInfo).textContent = movie.imdbID
   $_('.movie__type-inner', elNewMovieInfo).textContent = movie.Type
   $_('.movie__released-year-inner', elNewMovieInfo).textContent = movie.Year

   elMovieInfoWrapper.appendChild(elNewMovieInfo)
}


// Function Find movie and renders when info tbn is clicked
let onElListMoviesClick = evt => {

   if (evt.target.matches('.movies__info-btn')) {
      let clickedMovieID = evt.target.dataset.imdbId

      let clickedMovie = foundMovies.find(movie => {
         return clickedMovieID === movie.imdbID
      })

      renderMovieInfo(clickedMovie)
   }
}

// Add callback
elListMovies.addEventListener('click', onElListMoviesClick)


// Function finds movies pages when pagination item is clicked
let onElListPaginationClick = (evt) => {

   if (evt.target.matches('.page-link')) {
      let pageNumber = evt.target.dataset.Id

      fetch(`https://omdbapi.com/?apikey=${API_KEY}&page=${pageNumber}&s=${inputSearch}`)
         .then(response => {

            if (!response.ok) {
               throw new Error(`Error ${response.status}: ${response.statusText}`)
            }

            return response.json()
         }).then(data => {

            foundMovies = data.Search
            renderMoviesTitle(foundMovies)

            renderPaginationItems(data.totalResults)

         })
   }
}

// Add callback
elListPagination.addEventListener('click', onElListPaginationClick)