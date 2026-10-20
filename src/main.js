
import './style.css'

// 1. Crear el formulario del perfil
document.querySelector('#app').innerHTML = `

<h1>PokeMemory</h1>
<form id="profile-form">
  <label for="username">Nombre de usuario</label>
  <input type="text" id="username" name="username" minlength="3" maxlength="15" required>

  <p id="username-error"></p>
  <label for="pokemon-search">Pokémon favorito</label>
  <input type="text" id="pokemon-search" name="pokemon-search">
  <div id="pokemon-suggestions"></div>
  <img id="pokemon-image" alt="Pokémon favorito" hidden>
  <p id="pokemon-error"></p>
  <button type="submit">Crear perfil</button>
</form>

`

// 2. Validar el nombre de usuario y el Pokémon seleccionado
const formulario = document.querySelector('#profile-form');

formulario.addEventListener('submit', function (event) {
  event.preventDefault();

  const mensajeError = document.querySelector('#username-error');
  const inputUsername = document.querySelector('#username');
  const nombre = inputUsername.value.trim();

  if (nombre.length < 3 || nombre.length > 15) {
    mensajeError.textContent = 'El nombre debe tener entre 3 y 15 caracteres';
    return;
  }

  mensajeError.textContent = '';
  const mensajePokemonError = document.querySelector('#pokemon-error');

  if (pokemonSeleccionado === null) {
    mensajePokemonError.textContent = 'Debes seleccionar un Pokémon de la lista';
    return;
  }

  mensajePokemonError.textContent = '';
});

// 3. Preparar las variables
let listaPokemon = [];
let pokemonSeleccionado = null;

// 4. Obtener la lista de Pokémon desde PokeAPI
fetch(`https://pokeapi.co/api/v2/pokemon?limit=2000`)
  .then(function (respuesta) {
    return respuesta.json();
  })
  .then(function (datos) {
    listaPokemon = datos.results;
    console.log(listaPokemon);
  });

// 5. Preparar el buscador y las sugerencias
const buscadorPokemon = document.querySelector('#pokemon-search');
const contenedorSugerencias = document.querySelector('#pokemon-suggestions');

// 6. Filtrar los Pokémon según el texto introducido
buscadorPokemon.addEventListener('input', function (event) {

  const busqueda = event.target.value.toLowerCase().trim();
  contenedorSugerencias.textContent = '';

  if (busqueda.length === 0) {
    return;
  }

  // 7. Mostrar un máximo de cinco sugerencias
  const coincidencias = listaPokemon.filter(function (pokemon) {
    return pokemon.name.startsWith(busqueda);
  }).slice(0, 5);

  console.log(coincidencias);

  coincidencias.forEach(function (pokemon) {

    const parrafo = document.createElement('p');
    parrafo.textContent = pokemon.name;

    // 8. Seleccionar el Pokémon favorito
    parrafo.addEventListener('click', function () {
      buscadorPokemon.value = pokemon.name;
      contenedorSugerencias.textContent = '';

      // 9. Consultar sus datos en PokeAPI
      fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
        .then(function (respuesta) {
          return respuesta.json();
        })
        .then(function (datos) {

          // 10. Mostrar su imagen
          const imagenPokemon = document.querySelector('#pokemon-image');

          imagenPokemon.src = datos.sprites.front_default;
          imagenPokemon.hidden = false;

          // 11. Guardar los datos del Pokémon seleccionado en una variable
          pokemonSeleccionado = {
            id: datos.id,
            nombre: datos.name,
            imagen: datos.sprites.front_default
          };

          console.log(pokemonSeleccionado);
        });

      console.log('Has seleccionado:', pokemon.name);
    });

    contenedorSugerencias.appendChild(parrafo);
  });

});
