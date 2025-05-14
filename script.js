document.addEventListener("DOMContentLoaded", main);

function main() {
  abrirPanelFiltro();
}

function abrirPanelFiltro() {
  let botonFiltro = document.getElementById("toggleFiltros");
  let contenedorFiltros = document.getElementById("contenedorFiltros");

  botonFiltro.addEventListener("click", () =>
    contenedorFiltros.classList.toggle("visible")
  );
}

function normalizarDireccion(json_direccion) {
///Esta función recibe un JSON con el siguiente formato:
///{calle:nombre_calle, altura:altura, partido:partido}
/// Devuelve la dirección normalizada o el error
  const direccion_completa = `${json_direccion.calle} ${json_direccion.altura}, ${json_direccion.partido}&geocodificar=TRUE`;

  const baseURL = "https://servicios.usig.buenosaires.gob.ar/normalizar/";
  const url = `${baseURL}?direccion=${direccion_completa}`;

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Error ${response.status} en la solicitud: ${response.statusText}`
        );
      }
      return response.json(); 
    })
    .then((data) => {
      console.log("Resultado de la normalización", data);
      data = data.direccionesNormalizadas;
      if (data.length > 1){
        throw new Error(
            `Se obtuvieron múltiples resultados en la normalización.`
          );
      }
      return data[0]
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
}

function obtenerMapa(coordenada_x, coordenada_y){
    ///Esta funcion recibe las coordenadas x e y de una direccion y genera un div con el mapa.
    ///Devuelve el div con el mapa.
    var mapDiv = document.createElement('div');
    mapDiv.classList.add("map")

    const contenedorMapas = document.getElementById("contenedor_mapas")
    contenedorMapas.appendChild(mapDiv)

    var map = L.map(mapDiv).setView([coordenada_y, coordenada_x], 17);
    var marker = L.marker([coordenada_y, coordenada_x]).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
  
    return mapDiv;

}

//Ejemplo

const dir = normalizarDireccion({
  calle: "Cerrito",
  altura: "618",
  partido: "CABA",
});



dir.then((resultado) => {
  console.log(resultado);
    obtenerMapa(resultado.coordenadas.x, resultado.coordenadas.y)
});
