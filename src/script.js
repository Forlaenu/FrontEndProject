// search form listener for each games page
const pcSearchForm = document.getElementById("searchPC")
const consoleSearchForm = document.getElementById("searchConsole")
const mobileSearchForm = document.getElementById("searchMobile")
const userInput = document.getElementById("searchBar");
const mainSearchForm = document.getElementById("searchForm")

// API KEY, key=${caydensKey}
const apiURL = "https://api.rawg.io/api/"
const gameAPIurl = `${apiURL}games/`
const caydensKey = "key=ceb0a7023e6f466bacf471f8695bb3f1";
// PLATFORM ID's for API: &platforms=${platformPC}
const platforms = {
    pc: 4,
    mac: 5,
    linux: 6,
    console: {
        xboxOne: 1,
        playstation4: 18,
        nintendoSwitch: 7,
        playstation5: 187,
        xboxSeriesX: 186,
        xbox360: 14,
        playstation3: 16,
    },
    mobile: {
        iOS: 3,
        android: 21,
    },
    computers: "4,5,6", // a combination of them all
    mobiles: "3,21",
    consoles: "1,18,7,187,186,14,16",
}
// STORE ID's for API 
const store = {
    steam: 1,
    playstationStore: 3,
    nintendoStore: 6,
    xbox360Store: 7,
}
// # OF ITEMS TO RETURN, &page_size=${page_size}
const pageSizeInt = 20;
const pageSize = `page_size=${pageSizeInt}`;
// FOR SEARCHES, &${searchType[0]}=${searchBar.value} 
// [0] being basic search, [1] being "Disable fuzziness for the search query", [2] being strict search
const searchType = ["search", "search_precise", "search_exact"]

// Main page search form
try{
    mainSearchForm.addEventListener('submit', function(event){
        event.preventDefault();
        //send the searchGames function the input from searchBar
        // problem is (for now), this returns a promise Object
        // searchGames(input).then(value => (){renderGamesFunction(value)})
        searchGames(userInput.value, "all")
        .then(function(value){
            renderSearchResults(value)
            carousel(value)
        })
    })
} catch(error){console.log("Page error caught. Not on Main page")}
//PC SEARCH FORM
try{
    pcSearchForm.addEventListener('submit', function(event){
        event.preventDefault();
        //send the searchGames function the input from searchBar
        // problem is (for now), this returns a promise Object
        // searchGames(input).then(value => (){renderGamesFunction(value)})
        searchGames(userInput.value, "pc")
        .then(function(value){
            renderSearchResults(value)
            carousel(value)
        })
    })
} catch(error){console.log("Page error caught. Not on PC page")}
// CONSOLE SEARCH FORMS
try{
    consoleSearchForm.addEventListener('submit', function(event){
        event.preventDefault();
        //send the searchGames function the input from searchBar
        // problem is (for now), this returns a promise Object
        // searchGames(input).then(value => (){renderGamesFunction(value)})
        searchGames(userInput.value, "console")
        .then(function(value){
            renderSearchResults(value)
            carousel(value)
        })
    })
} catch(error){console.log("Page error caught. Not on Console page")}
//MOBILE SEARCH FORM
try{
    mobileSearchForm.addEventListener('submit', function(event){
        event.preventDefault();
        //send the searchGames function the input from searchBar
        // problem is (for now), this returns a promise Object
        // searchGames(input).then(value => (){renderGamesFunction(value)})
        searchGames(userInput.value, "mobile")
        .then(function(value){
            renderSearchResults(value)
            carousel(value)
        })
    })
}
catch(error){console.log("Page error caught. Not on Mobile page")}

// setting up a function to call in browser that doesn't run every page load
// then appending results to localStorage for playing around with
// Modify this 12/19 to accept a platform as an argument 
function searchGames(searchTerm, platform){
    let platformID = "";
    if(platform == "pc"){platformID = `&platforms=${platforms.computers}`}
    if(platform == "console"){platformID = `&platforms=${platforms.consoles}`}
    if(platform == "mobile"){platformID = `&platforms=${platforms.mobiles}`}
    return fetch(`${apiURL}games?${caydensKey}&${pageSize}${platformID}&${searchType[0]}=${searchTerm}`)
    .then(response => response.json())
    .then(function(data){
        const requests = data.results.map((game)=>{
            return getGameData(game)
        })
        return Promise.all(requests)
    })
}

function renderSearchResults(listOfGames){
    // Using Justin's code here
    const img = listOfGames.map(user => {
        return `<div class="col-12 mb-4" id="gameDisplay">                
        <img class="border" src="${getBackgroundIMG(user)}" width="450"/>
            <div class="row">
                <div class="col align-self-center">
                    <p>Name: ${getName(user)}<br>
                    Released: ${getReleasedDate(user)}<br>
                    <div id="moreInfo">
                    Platforms: ${getPlatform(user)}<br>
                    <div>${getDescription(user)}</div>
                    </p>
                    </div>
                </div>
            </div>
        </div>
        `;                
    }).join("");            
    document.querySelector("#gameList").insertAdjacentHTML("afterbegin", img);
}



// THESE MAY ONLY WORK WHEN USING "&search= " API parameter
// THIS RETURNS 1 GAME OBJECT'S ATTRIBUTES, DOES NOT WORK ON A LIST
// USE IN A LOOP OVER A LIST, CALLING getGenres() on one dictionary result ie. data.results[i] <- i being important here. data.results is a list
// getGenres returns a list of the gameObject's genres, as strings. A list because there's usually more than one ie: "action", "adventure"
function getGenres(gameObject){
    const genreList = [];
    for(i=0; i<gameObject.genres.length;i++){
        genreList.push(gameObject.genres[i].name)
    }
    return genreList.join(", ");
}
// getDeveloper returns the game's developer
function getDeveloper(gameObject){
    if(gameObject.developers.length < 2){
        return gameObject.developers[0].name;
    }
    else{
        let devs = [];
        for(i=0;i<gameObject.developers.length;i++){
            devs.push(gameObject.developers[i].name)
        }
        return devs.join(", ");
    }
}
// getDescription returns the description given by RAWG
function getDescription(gameObject){
    return gameObject.description_raw;
}

function getPlatform(gameObject){
    const platformList = [];
    for(i=0; i<gameObject.platforms.length;i++){
        platformList.push(gameObject.platforms[i].platform.name)
    }
    return platformList.join(", ");
}

// getBackgroundIMG returns a string URL of the designated "background image" for the gameObject
function getBackgroundIMG(gameObject){
    return gameObject.background_image;
}

// getReleasedDate returns a string of the gameObject's release date in year-month-day notation
function getReleasedDate(gameObject){
    return gameObject.released;
}

// getName returns the string of the object's display name, already capitalized 
function getName(gameObject){
    return gameObject.name;
}

// getMetaScore returns the integer metascore rating 
function getMetaScore(gameObject){
    return gameObject.metacritic;
}

function getESRB(gameObject){
    // SWITCH CASE maybe?
    // switch(gameObject.esrb_rating)
    // case("Mature")
    // return "17+ Mature"
    // etc
    return gameObject.esrb_rating.name;
}
// getGameID will grab RAWG's unique id for the game that will be used to grab more particular data 
function getGameID(gameObject){
    return gameObject.id;
}

function getScreenshots(gameObject){
    const screenshotList = [];
    for(i=0;i<gameObject.short_screenshots.length;i++){
        if(gameObject.short_screenshots[i].id != -1){
            screenshotList.push(gameObject.short_screenshots[i].image)
        }
    }
    return screenshotList;
}

// getGameDescription first gets ID from original list, then sends an API call for game specific details. Returns HTML ie <p>Text Text Text</p>
function getGameData(gameObject){
    let gameID = getGameID(gameObject);
    // const newDiv = document.createElement("div")
    return fetch(`${gameAPIurl}${gameID}?${caydensKey}`)
    .then(res => res.json())
    .then(function(data){
        // gameDescription = data.description;
        // newDiv.innerHTML = gameDescription;
        // document.body.appendChild(newDiv)
        return Object.assign({},gameObject,data);
    })
}

let popList = [];

let popular = fetch("https://api.rawg.io/api/games?key=b278a78a94004a1cb2cfd9da075eb514&dates=2021-01-01,2021-12-12&ordering=-added")
    .then(response => response.json())
    .then(data => {
        const requests = data.results.map((game)=>{
            return getGameData(game)
        })
        return Promise.all(requests)
        .then(resultsList => {
            popList = resultsList;
            carousel(resultsList)
            renderSearchResults(resultsList)
        })
    })

function carousel(popular) {
    const popularGames = popular.map(function (currentGame, index) {
        return `<div class="carousel-item ${index === 0 ? 'active' : ''}" >
                <img src="${currentGame.background_image}" class="d-block w-100" alt="Game background image" " />
                <div class="carousel-caption d-none d-md-block">
                <h5>${currentGame.name}</h5>
                
</div>
</div>`})
    const carousel = document.querySelector(".carousel-inner")
    carousel.innerHTML = popularGames
}

let programmingQuotes = fetch("https://programming-quotes-api.herokuapp.com/quotes/random")
// console.log(freeGames)
    .then(response => response.json())
    .then(data => {
    // console.log(data)
    // console.log(data.author)
    // console.log(data.en)
    randomQuote(data)
})

function randomQuote(programmingQuotes) {
    const quote = document.querySelector(".quote")
    quote.innerHTML = 
                `<div class="details">
                    <div class="author"><h4>Author: ${programmingQuotes.author}</h4></div>
                    <div class="actualQuote"><p> ${programmingQuotes.en}</p></div>
                </div>`}



