let elWrapper = document.querySelector("#wrapper");
let elForm = document.querySelector("#form");
var elSearchInput = document.querySelector("#search_input")
let elCategorySelect = document.querySelector("#category-select");
let elRating = document.querySelector("#rating");
let elSort = document.querySelector("#rating_sort");
let elBtn = document.querySelector("#btn");
let elTitle = document.querySelector("#search-result");
let elTemplate = document.querySelector("#movie_card").content;

let slicedMovies = movies.slice(0, 3767);

var normolizedMovieList = slicedMovies.map((movieItem, index) => {
    return {
        id: index + 1,
        title: movieItem.Title.toString(),
        year: movieItem.movie_year,
        categories: movieItem.Categories,
        rating: movieItem.imdb_rating,
        imageLink: `https://i.ytimg.com/vi/${movieItem.ytid}/mqdefault.jpg`,
        youtubeLink: `https://www.youtube.com/watch?v=${movieItem.ytid}`  
    }
})

function renderMovies(movieArray, wrapper){
    wrapper.innerHTML = null;
    let elFragment = document.createDocumentFragment()
    
    movieArray.forEach(movie => {
        let templateDiv = elTemplate.cloneNode(true)
        
        templateDiv.querySelector(".card-img-top").src = movie.imageLink
        templateDiv.querySelector(".card-title").textContent = movie.title
        templateDiv.querySelector(".card-categories").textContent = movie.categories.split("|").join(", ")
        templateDiv.querySelector(".card-year").textContent = movie.year
        templateDiv.querySelector(".card-rate").textContent = movie.rating
        templateDiv.querySelector(".card-link").href = movie.youtubeLink
        
        elFragment.appendChild(templateDiv);
    });
    wrapper.appendChild(elFragment)
    
    elTitle.textContent = movieArray.length;
}

function generateCategories(movieArray) {
    let categoryList = []
    
    movieArray.forEach(function(item) {
        let splittedCategories = item.categories.split("|");
        
        splittedCategories.forEach(function (item) {
            if (!categoryList.includes(item)) {
                categoryList.push(item)
            }
        })
    })

    categoryList.sort()
    
    let categoryFragment = document.createDocumentFragment()

    categoryList.forEach(function (item) {
        let categoryOption = document.createElement("option");
        categoryOption.value = item
        categoryOption.textContent = item
        categoryFragment.appendChild(categoryOption)
    })
   
    
    elCategorySelect.appendChild(categoryFragment)
}
generateCategories(normolizedMovieList)



renderMovies(normolizedMovieList, elWrapper);

var findMovies = function (movie_title, minRating, genre) {
    
    return normolizedMovieList.filter(function (movie) {
        var doesMatchCategory = genre === 'All' || movie.categories.split("|").includes(genre);
        
        return movie.title.match(movie_title) && movie.rating >= minRating && doesMatchCategory;
    });
};


elForm.addEventListener("input", function(evt) {
    evt.preventDefault()

    let searchInput = elSearchInput.value.trim()
    let ratingInput = elRating.value.trim()
    let selectOption = elCategorySelect.value
    let sortingType = elSort.value
    
    let pattern = new RegExp(searchInput, "gi")
    let resultArray = findMovies(pattern, ratingInput, selectOption)

    if (sortingType === "high") {
        resultArray.sort((b, a) => a.rating - b.rating)
    }

    if (sortingType === "low") {
        resultArray.sort((a, b) => a.rating - b.rating)
    }

    renderMovies(resultArray , elWrapper);
})



