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
