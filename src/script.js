// search form listener for each games page
const pcSearchForm = document.getElementById("searchPC")
const consoleSearchForm = document.getElementById("searchConsole")
const mobileSearchForm = document.getElementById("searchMobile")
const userInput = document.getElementById("searchBar");
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

//PC SEARCH FORM
try{
    pcSearchForm.addEventListener('submit', function(event){
        event.preventDefault();
        //send the searchGames function the input from searchBar
        // problem is (for now), this returns a promise Object
        // searchGames(input).then(value => (){renderGamesFunction(value)})
        searchGames(userInput.value, "pc")
        .then(function(value){
            // renderFunction(value)
            console.log(value)
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
            // renderFunction(value)
            console.log(value)
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
            console.log(value)
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
    if(platform == "pc"){platformID = platforms.computers}
    if(platform == "console"){platformID = platforms.consoles}
    if(platform == "mobile"){platformID = platforms.mobiles}
    return fetch(`${apiURL}games?${caydensKey}&${pageSize}&platforms=${platformID}&${searchType[0]}=${searchTerm}`)
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
        return `                
        <img src="${getBackgroundIMG(user)}" width="505"/>
        <div style="background-color:black">
            <p>Name: ${getName(user)}<br>
            Released: ${getReleasedDate(user)}<br>
            Platforms: ${getPlatform(user)}<br>
            Genres: ${getGenres(user)}<br>
            </p>
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

// getPlatform returns a list of gameObject's release platforms, as strings. ie: "xboxOne", "PC" 
// [{
//     "platform": {
//     "id": 4,
//     "name": "PC",
//     "slug": "pc"
//     }
// },]
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

// getRatings will return the RAWG version of gameObject's user rating... haven't decided how just yet
function getRatings(gameObject){
    // "ratings": [
    //     {
    //     "id": 5,
    //     "title": "exceptional",
    //     "count": 847,
    //     "percent": 59.99
    //     },
    //     {
    //     "id": 4,
    //     "title": "recommended",
    //     "count": 361,
    //     "percent": 25.57
    //     },
    //     {
    //     "id": 3,
    //     "title": "meh",
    //     "count": 140,
    //     "percent": 9.92
    //     },
    //     {
    //     "id": 1,
    //     "title": "skip",
    //     "count": 64,
    //     "percent": 4.53
    //     }
    //     ],
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

// getESRB returns the string ESRB rating. Want to spice it up with the age recommendation that's not provided via just gameObject.esrb_rating
// {
//     "id": 4,
//     "name": "Mature",
//     "slug": "mature",
//     "name_en": "Mature",
//     "name_ru": "С 17 лет"
// },
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

// getScreenshots will return a list of the screenshots posted on RAWG
// [{
//     "id": -1,
//     "image": "https://media.rawg.io/media/games/2ad/2ad87a4a69b1104f02435c14c5196095.jpg"
// },]
// from what i can tell, [0] always has an id of -1 (ive totally used this before as a way to get a "default" value, in this case, a background image)
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

// this function is used to search games
// function searchGames(games){
//     const url = `https://api.rawg.io/api/games?key=b278a78a94004a1cb2cfd9da075eb514&search=${games}`;
//     fetch(url)
//     .then((res) => {
//         return res.json()
//     })
//     .then((jsonData) => {
//         console.log(jsonData.results)
//     })  
// }

// window.onload = () => {
//     const searchBarElement = document.getElementById("searchBar");
//     searchBarElement.onkeyup = (event) => {
//         searchGames(searchBarElement.value);
//     }
// }

// This function returns following images with <p> info
function fetchData(){
    fetch("https://api.rawg.io/api/games?key=b278a78a94004a1cb2cfd9da075eb514&dates=2021-01-01,2021-12-12&ordering=-added")
        
        .then(res => {
            return res.json();
        })
        .then(data => {           
            const img = data.results.map(user => {
                return `                
                <img src="${user.background_image}" width="505"/>
                <p>Name: ${user.name}</p>
                <p>Released: ${user.released}</p>
                `;                
            }).join("");            
            document.querySelector("#gameList").insertAdjacentHTML("afterbegin", img);
        }).catch(error => {
            
        });

}

// fetchData();
let popular = fetch("https://api.rawg.io/api/games?key=b278a78a94004a1cb2cfd9da075eb514&dates=2021-01-01,2021-12-12&ordering=-added")
    .then(response => response.json())
    .then(data => {
        carousel(data.results)
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