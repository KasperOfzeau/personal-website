window.addEventListener('load', init);

let webserviceURL;
let cardsContainer;
let lastFmURLSong;
let lastFmURLTopArtists;
let song;
let musicWrapper;
let trackName;
let artistName;
let musicCover;
let artistsString;
let artistsHolder;
let linkCurrentlyListening;

function init()
{
    webserviceURL = 'https://gh-pinned-repos-5l2i19um3.vercel.app/?username=kasperofzeau';
    lastFmURLSong = 'https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=kasperofzeau&api_key=LASTFMAPIKEY&format=json';
    lastFmURLTopArtists = 'https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=kasperofzeau&api_key=LASTFMAPIKEY&format=json&limit=10&period=1month';
    cardsContainer = document.querySelector(".cont-2"); // Container for all the cards
    musicWrapper = document.querySelector("#music-wrapper"); // Container music player
    trackName = document.querySelector("#trackName"); // Container track name
    artistName = document.querySelector("#artistName"); // Container track name
    musicCover = document.querySelector("#music-cover"); // Container track name
    artistsHolder = document.querySelector("#artists"); // Container artists
    linkCurrentlyListening = document.querySelector("#linkCurrentlyListening");

    document.addEventListener('scroll', checkScrollPosition);

    getGithubRepos();
    getCurrentlyListening();
    getCurrentlyTopArtists();
    setInterval(getCurrentlyListening, 10 * 1000);
}

// Generic AJAX handler
function ajaxRequest(url, ajaxSuccessHandler)
{
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then(ajaxSuccessHandler)
        .catch(ajaxErrorHandler);
}

// Get data
function getGithubRepos() {
    ajaxRequest(webserviceURL, createRepoCards);
}

function getCurrentlyListening() {
    ajaxRequest(lastFmURLSong, showCurrentlyListening);
}

function getCurrentlyTopArtists() {
    ajaxRequest(lastFmURLTopArtists, showCurrentlyTopArtists);
}

// Display all cards
function createRepoCards(data) {
    // create dom elements per item
    for(let item of data) {
        addCard(item);
    }
}

// Get current song listening
function showCurrentlyListening(data) {
    song = data.recenttracks.track[0];
    if(typeof song["@attr"] !== 'undefined' && window.scrollY < 700) {
        trackName.innerHTML = song.name;
        artistName.innerHTML = song.artist["#text"];
        musicCover.src = song.image[1]["#text"];
        linkCurrentlyListening.href = song.url;
        musicWrapper.classList.add("active");
    } else {
        musicWrapper.classList.remove("active");
    }
}

// Show top artists
function showCurrentlyTopArtists(data){
    let artists = data.topartists.artist;
    let length = artists.length;
    artistsString = '';

    for(let artist of artists) {
        length -= 1;
        if (length === 0) {
            artistsString += artist.name;
        } else if(length === 1) {
            artistsString += artist.name;
            artistsString += " en ";
        }
        else {
            artistsString += artist.name;
            artistsString += ", ";
        }
    }
    artistsHolder.innerHTML = artistsString;
}

function addCard(item) {

    // Create new card
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");

    // Create image for card
    const cardImg = document.createElement("div");
    cardImg.classList.add("bg-img");
    cardImg.style.backgroundImage = "url('https://raw.githubusercontent.com/KasperOfzeau/" + item.repo + "/main/" + item.repo + ".jpg')";

    // Create div title card
    const nameDiv = document.createElement("div");
    nameDiv.classList.add("content");

    // Create title card
    const cardTitle = document.createElement("h4");
    cardTitle.innerText = item.repo;

    // Create language tag
    // const cardLanguageTag = document.createElement("p");
    // cardLanguageTag.innerText = item.language;
    // cardLanguageTag.className = 'languageTag';

    // Create description
    const cardDescription = document.createElement("p");
    cardDescription.innerText = item.description;
    cardDescription.className = 'description';

    // Create button
    const cardButton = document.createElement('a');
    cardButton.href = item.link;
    cardButton.target = "_blank";
    cardButton.className = 'cardButton';
    cardButton.innerHTML = 'Bekijk op Github';

    // ADD ALL IN TO HTML
    cardsContainer.appendChild(cardDiv);
    cardDiv.appendChild(cardImg);
    cardDiv.appendChild(nameDiv);
    nameDiv.appendChild(cardTitle);
    // nameDiv.appendChild(cardLanguageTag);
    nameDiv.appendChild(cardDescription);
    cardDiv.appendChild(cardButton);
}

// Remove song pop up add scroll position
function checkScrollPosition() {
    if(window.scrollY > 700) {
        musicWrapper.classList.remove("active");
    } else if(typeof song["@attr"] !== 'undefined') {
        getCurrentlyListening();
        musicWrapper.classList.add("active");
    }
}

function ajaxErrorHandler(data) {
    console.log(data);
}