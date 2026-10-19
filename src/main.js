import './style.css'


document.querySelector('#app').innerHTML = `

<h1>PokeMemory</h1>
<form id="profile-form">
  <label for="username">Nombre de usuario</label>
  <input type="text" id="username" name="username" minlength="3" maxlength="15" required>
  
  <p id="username-error"></p>
  <label for="pokemon-search">Pokémon favorito</label>
  <input type="text" id="pokemon-search" name="pokemon-search">
  <div id="pokemon-suggestions"></div>
  <button type="submit">Crear perfil</button>
  </form>
  
`
const formulario = document.querySelector('#profile-form');

formulario.addEventListener('submit', function(event) {
  event.preventDefault();

  const mensajeError = document.querySelector('#username-error');
  const inputUsername = document.querySelector('#username');
  const nombre = inputUsername.value.trim();

  if (nombre.length < 3 || nombre.length > 15) {
    mensajeError.textContent = 'El nombre debe tener entre 3 y 15 caracteres';
    return;
  }

  mensajeError.textContent = '';
});

let listaPokemon = [];

fetch('https://pokeapi.co/api/v2/pokemon?limit=2000')
  .then(function(respuesta) {
    return respuesta.json();
  })
  .then(function(datos) {
    listaPokemon = datos.results;
    console.log(listaPokemon);
  });

  const buscadorPokemon = document.querySelector('#pokemon-search');
  const contenedorSugerencias = document.querySelector('#pokemon-suggestions');

  buscadorPokemon.addEventListener('input', function(event) {

    const busqueda = event.target.value.toLowerCase().trim();
    contenedorSugerencias.textContent = '';
    if (busqueda.length === 0) {
      return;
    }

    const coincidencias = listaPokemon.filter(function(pokemon) {
      return pokemon.name.startsWith(busqueda);
    }).slice(0, 5);

    console.log(coincidencias);

    
    coincidencias.forEach(function(pokemon){
    
      const parrafo = document.createElement('p');
      parrafo.textContent = pokemon.name;
      contenedorSugerencias.appendChild(parrafo);

    });

  });


