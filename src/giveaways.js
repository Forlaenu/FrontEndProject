document.addEventListener('DOMContentLoaded', runGiveawayPage)
let giveawayList;

function giveawayAPI(){
    return fetch("https://gamerpower.p.rapidapi.com/api/giveaways", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "gamerpower.p.rapidapi.com",
		"x-rapidapi-key": "0ab7351ce0msh9514978fff57a32p185df1jsnd04089c93f75"
	}
})
.then(response => {
	var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",response.url,false);
    Httpreq.send(null);
    return Httpreq.responseText;
})
.then(giveAwayList => {
    giveawayList = JSON.parse(giveAwayList);
    return giveawayList;
})
.catch(err => {
	console.error(err);
});
}

function renderSearchResults(listOfGames){
    const img = listOfGames.map(game => {
        return `<div class="col mb-4" id="gameDisplay">                
        <img class="border" src="${game.thumbnail}" width="300"/>
            <div class="row">
                <div class="col align-self-center">
                    <p>Name: ${game.title}<br></p>
                    <div id="moreInfo">
                    <p>Avail: ${game.platforms}<br>
                    <a href="${game.open_giveaway_url}" target="_blank">Click here for more info!</a></p>
                    </div>
                </div>
            </div>
        </div>
        `;                
    }).join("");            
    document.querySelector("#giveAwayList").insertAdjacentHTML("afterbegin", img);
}

function runGiveawayPage(){
    giveawayAPI().then(value => {
        renderSearchResults(value)})
}