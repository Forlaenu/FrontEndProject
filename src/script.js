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

