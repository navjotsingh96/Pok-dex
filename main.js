let currentpokemon;
let pokemons = [];
let offset = 0;
let allPokemons = [];

async function loadallPokemons() {
    let response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1118&offset=0');
    let responseasJson = await response.json();
    allPokemons = responseasJson['results'];
    for (let a = 0; a < allPokemons.length; a++) {
        const names = allPokemons[a];

        let pokemonName = await fetch(names['url']);
        let pokemonNameasJson = await pokemonName.json();
        allPokemons.push(pokemonNameasJson);

        console.log(pokemonNameasJson);

    }

    console.log(allPokemons);
}

async function loadPokemon() {

    let Url = `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`;

    let response = await fetch(Url);
    let responseasJson = await response.json();
    let mainSeite = responseasJson['results'];

    for (let i = 0; i < mainSeite.length; i++) {
        let Poki = mainSeite[i];
        await loadPokemonbyUrl(Poki['url']);


        renderPokemon(currentpokemon);
    }
    offset += 20;
}

function renderPokemon(pokemon) {

    let container = document.getElementById('allPokemons');
    container.innerHTML += pokemonTemplate(pokemon);


}

async function loadPokemonbyUrl(url) {
    let response = await fetch(url);
    currentpokemon = await response.json();
    pokemons.push(currentpokemon);
}


function pokemonTemplate(pokemon) {
    return `<div class="pokemons-card" id="${pokemon.name}" onclick='showPokemondeatilas("${pokemon.name}")'>
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



function showPokemondeatilas(pokemonName) {
    let pokemon = pokemons.find(p => p.name === pokemonName); // to filter array to show pokemon from pokemons array

    let pokemonHeader = document.getElementById('pokemon_headeer');
    let pokemonDeatials = document.getElementById('pokemon_details');

    pokemonHeader.innerHTML = '';
    pokemonDeatials.innerHTML = '';
    pokemonHeader.innerHTML = pokemonHeaderdetails(pokemon);
    pokemonDeatials.innerHTML = pokemonDetailsETC(pokemon)
    document.getElementById('show_details').classList.remove('d-none');
    document.getElementById('containertodo').classList.add('overflow_cont');

}



function pokemonHeaderdetails(pokemon) {
    return `<div class="pokemon-name" id="${pokemon.name}">
    <h1>${pokemon.name}</h1>
</div>
<div class="details_image" id="${pokemon.name}">
   <img class="pokemon_img pokemon-absolute" src="${pokemon['sprites']['other']['official-artwork']['front_default']}">
</div>
   <div class="pokemon-id" id="${pokemon.name}">
       <b>ID #00${pokemon.id}</b>
</div>
<div class="pokemon-type" id="${pokemon.name}">
<b>Type ${pokemon.types[0]['type']['name']} &</b>
</div>`;
}

function pokemonDetailsETC(pokemon) {
    return `<div class="pokemon-deatils-card">

            <div class="display-flex" id="${pokemon.name}">
                <h3> Height:</h3> <span class="m-left-20"> ${pokemon.height}</span>
            </div>
             <div class="display-flex" id="${pokemon.name}">
                 <h3> Weight :</h3> <span class="m-left-20"> ${pokemon.weight}</span>
            </div>
             <div class="display-flex" id="${pokemon.name}">
                 <h3> Abilities:</h3> <span class="m-left-20"> ${pokemon.abilities[0]['ability']['name']},
                         ${pokemon.abilities[1]['ability']['name']} </span>
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

function loadmorePokemon() {
    loadPokemon();

}

//Search function
function searchPokemon(pokemonName) {
    document.getElementById('allPokemons').classList.add('d-none');
    let search = document.getElementById('input_feld').value;
    search = search.toLowerCase();

    let find = pokemons.filter(p => p.name.startsWith(search));
    let notFindPokemons = allPokemons.filter(a => a.name.startsWith(search));
    console.log(notFindPokemons);
    renderSearchPokemons(find);
    renderNotfindPokemons(notFindPokemons);
}

function renderSearchPokemons(pokemons) {
    let findContainer = document.getElementById('findPokemon');
    findContainer.innerHTML = '';
    for (let n = 0; n < pokemons.length; n++) {
        findContainer.innerHTML += pokemonTemplate(pokemons[n]);
    }
}

function renderNotfindPokemons(allPokemons) {
    let findContainer = document.getElementById('findPokemon');
    findContainer.innerHTML = '';
    for (let z = 0; z < allPokemons.length; z++) {
        findContainer.innerHTML += pokemonTemplate(allPokemons[z]);

    }
}

function hidecontainer() {
    document.getElementById('show_details').classList.add('d-none');
    document.getElementById('containertodo').classList.remove('overflow_cont');

}