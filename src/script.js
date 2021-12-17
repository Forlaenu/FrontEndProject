// this function is used to search games
function searchGames(games){
    const url = `https://api.rawg.io/api/games?key=b278a78a94004a1cb2cfd9da075eb514&search=${games}`;
    fetch(url)
    .then((res) => {
        return res.json()
    })
    .then((jsonData) => {
        console.log(jsonData.results)
    })  
}

window.onload = () => {
    const searchBarElement = document.getElementById("searchBar");
    searchBarElement.onkeyup = (event) => {
        searchGames(searchBarElement.value);
    }
}

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

fetchData();
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
