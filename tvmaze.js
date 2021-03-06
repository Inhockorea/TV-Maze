/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */


async function searchShows(query) {
  
  let searchData = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);

  let list = searchData.data.map( key => ({
    id: key.show.id,
    name: key.show.name,
    summary: key.show.summary,
    image: key.show.image ? key.show.image.medium : "https://tinyurl.com/tv-missing"
  }))

  return list;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
           <img class="card-img-top" src="${show.image}">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class=episode-button id=${show.id}> Episodes </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  let episodeData = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  
  // return episodeData.data;
  let episodeList = episodeData.data.map( key => ({
    id: key.id,
    name: key.name,
    season: key.season,
    number: key.number
  }))

  return episodeList;
}

function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();

  for (let episode of episodes) {
    let $item = $(
      `<li> ${episode.name} (season ${episode.season}, number ${episode.number})</li>`
    );

    $episodesList.append($item);
    // $("#episodes-area").show();
    $("#episodes-area").css("display", "block");
  }
}

$(".container").on("click",".episode-button", addEpisodes);

async function addEpisodes (evt) {
 
    let showId =  evt.target.id

    console.log(showId);
    let episodes = await getEpisodes(showId);
  
    populateEpisodes(episodes);
  }