let currentpokemon;
let pokemons = [];
let offset = 0;
let limit = 50;
let allPokemons = [];
let notSaved = [];
let loadingAnimation = true;
let loadmorePokemon = false;
let scrollLoad = true;

// load function


function onReady(callback) {
    var intervalId = window.setInterval(function() {
        if (document.getElementsByTagName('body')[0] !== undefined) {
            window.clearInterval(intervalId);
            callback.call(this);
        }
    }, 1000);
}

function setVisible(selector, visible) {
    document.querySelector(selector).style.display = visible ? 'block' : 'none';
}



// till here 
//load all pokemons from API
async function loadAllPokemons() {
    let response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1118&offset=0');
    let responseasJson = await response.json();
    allPokemons = responseasJson['results'];
    for (let a = 0; a < allPokemons.length; a++) {
        const names = allPokemons[a];
        let pokemonName = await fetch(names['url']);
        let pokemonNameasJson = await pokemonName.json();
        allPokemons.push(pokemonNameasJson);
    }
}

async function waitForOffset() {
    limit += 10;
    offset += limit;
    await loadPokemon();
    hideLoadingAnimation();
}

// Pokemons details from API
async function loadPokemon() {
    let Url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    let response = await fetch(Url);
    let responseasJson = await response.json();
    let mainSeite = responseasJson['results'];
    for (let i = 0; i < mainSeite.length; i++) {
        let Poki = mainSeite[i];
        await loadPokemonbyUrl(Poki['url'], i);
        renderPokemon(currentpokemon);
    }
    loadmorePokemon = false;
    loadingAnimation = false;
    scrollLoad = true;
    hideLoadingAnimation();
}

function hideLoadingAnimation() {
    if (!loadingAnimation) {
        onReady(function() {
            setVisible('.page', true);
            setVisible('#loading', false);
        });
    }
}


function renderPokemon(pokemon) {
    let container = document.getElementById('allPokemons');
    container.innerHTML += pokemonTemplate(pokemon);

}


async function loadPokemonbyUrl(url, i) {
    let response = await fetch(url);
    currentpokemon = await response.json();
    pokemons.push(currentpokemon);

}

function pokemonTemplate(pokemon) {
    let type = pokemon['types'][0]['type']['name'];
    return `<div class="pokemons-card  ${type}" id="${pokemon.name}" onclick='showPokemondeatilas("${pokemon.name}")'>
                          <div id="pokiname${pokemon.name}">
                               <h2 class="pokimon_name">${pokemon.name}</h2>
                         </div>
                        
                         <div class="poki_id" id="poki_id${pokemon.name}">
                               <h3><b>ID #00${pokemon.id}</b></h3>
                         </div>
                         <div class="poki_type" id="poki_type${pokemon.name}">
                               ${pokemon['types'][0]['type']['name']}
                        </div>
                         <div id="poki_images${pokemon.name}">
                                <img class="pokemon_img" src="${pokemon['sprites']['other']['home']['front_default']}">
                        </div>

            </div>`;
}


// show and pokemons Pokemondetails 
function showPokemondeatilas(pokemonName) {
    let pokemon = pokemons.find(p => p.name === pokemonName); // to filter array to show pokemon from pokemons array
    let pokemonHeader = document.getElementById('show_pokemon_details');
    let pokemonDeatials = document.getElementById('pokemon_details');
    pokemonHeader.innerHTML = '';
    pokemonDeatials.innerHTML = '';
    pokemonHeader.innerHTML = pokemonHeaderdetails(pokemon);
    pokemonDeatials.innerHTML = pokemonDetailsETC(pokemon)
    document.getElementById('show_details').classList.remove('d-none');
    document.getElementById('containertodo').classList.add('overflow_cont');
}



function pokemonHeaderdetails(pokemon) {
    return `
         <div class="${pokemon.types[0]['type']['name']} pokemon-header" id="myTry">
    <div class="click"> Click anywere to close Pokemon</div>

            <div class="pokemon-name" id="${pokemon.name}">
                <h1>${pokemon.name}</h1>
            </div>
            <div class="details_image" id="${pokemon.name}">
                <img class="pokemon_img pokemon-absolute" src="${pokemon['sprites']['other']['official-artwork']['front_default']}">
            </div>
            <div class="pokemon-id" id="${pokemon.name}">
                 <b>ID <span class="color-white">#00${pokemon.id}</span></b>
            </div>
            <div class="pokemon-type" id="${pokemon.name}">
                <b>Type <span class="color-white">${pokemon.types[0]['type']['name']}</span></b>
            </div>
        </div>`;
}


function pokemonDetailsETC(pokemon) {
    return `
    <div class="pokemon-deatils-card">
    
        <div class="display-flex" id="${pokemon.name}">
            <h3> Height:</h3> <span class="m-left-20"> ${pokemon.height}</span>
        </div>

        <div class="display-flex" id="${pokemon.name}">
            <h3> Weight :</h3> <span class="m-left-20"> ${pokemon.weight}</span>
        </div>

        <div class="display-flex" id="${pokemon.name}">
            <h3> Abilities:</h3> <span class="m-left-20"> ${pokemon?.abilities[0]['ability']['name']},
                 ${pokemon?.abilities[1]['ability']['name']} </span>
        </div>

        <div class="display-flex" id="${pokemon.name}">
            <h3> Baseexperience:</h3> <span class="m-left-20"> ${pokemon.base_experience}</span>
        </div>

        <div class="display-flex">
            <h3> HP:</h3> <span class="m-left-20"> ${pokemon.stats[0]['base_stat']}</span>
        </div>

        <div class="display-flex">
            <h3> Attack:</h3> <span class="m-left-20"> ${pokemon.stats[1]['base_stat']}</span>
        </div>

         <div class="display-flex">
            <h3> Defense:</h3> <span class="m-left-20"> ${pokemon.stats[2]['base_stat']}</span>
            </div>

         <div class="display-flex">
            <h3> Special-Attack:</h3> <span class="m-left-20"> ${pokemon.stats[3]['base_stat']}</span>
            </div>

        <div class="display-flex">
            <h3> Special-Defense:</h3> <span class="m-left-20"> ${pokemon.stats[4]['base_stat']}</span>
        </div>
                    
        <div class="display-flex">          
            <h3> Speed:</h3> <span class="m-left-20"> ${pokemon.stats[5]['base_stat']}</span>
        </div>
     </div>
         `;
}


//Search function
function searchPokemon(pokemonName) {
    let container = document.getElementById('allPokemons');
    let search = document.getElementById('input_feld').value;
    search = search.toLowerCase();
    container.innerHTML = '';
    let find = pokemons.filter(p => p.name.includes(search));
    let notFindPokemons = allPokemons.filter(a => a.name.includes(search));
    if (find == '') {
        downlaodNotFound(notFindPokemons);
    } else
        for (let i = 0; i < find.length; i++) {
            const findMy = find[i];
            container.innerHTML += pokemonTemplate(findMy);
        }

}

// download not find pokemons from allPOkemmons array and pushed to pokemon array
async function downlaodNotFound(download) {
    let url = download[0]['url']
    let container = document.getElementById('allPokemons');
    container.innerHTML = '';
    let response = await fetch(url);
    let responseasJson = await response.json();
    notSaved = responseasJson;
    pokemons.push(notSaved);
    container.innerHTML += pokemonTemplate(notSaved);

}
window.addEventListener('scroll', infiniteScroll);

// to Load pokemons on Scroll
async function infiniteScroll() {
    let contianer = document.getElementById('allPokemons')
    if (Math.floor(window.innerHeight + window.scrollY - 300) > (contianer.offsetHeight - 800) && scrollLoad) {
        scrollLoad = false;
        await waitForOffset();
        console.log('Lauft');
    }
}


function hidecontainer() {
    document.getElementById('show_details').classList.add('d-none');
    document.getElementById('containertodo').classList.remove('overflow_cont');
}