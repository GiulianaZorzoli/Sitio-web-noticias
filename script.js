document.addEventListener("DOMContentLoaded", main);

function main() {
  abrirPanelFiltro();
  cargarNoticias();
}


function abrirPanelFiltro() {
  let botonFiltro = document.getElementById("toggleFiltros");
  let contenedorFiltros = document.getElementById("contenedorFiltros");

  botonFiltro.addEventListener("click", () =>
    contenedorFiltros.classList.toggle("visible")
  );
}



async function cargarNoticias() {
  const response = await fetch("noticia.json");
  const noticias = await response.json();

  const contenedorNoticias = document.getElementById("lista_noticias");

  noticias.forEach((noticia) => {
    const div = document.createElement("div");
    div.classList.add("noticia");
    div.innerHTML = `
      <h3>${noticia.titulo}</h3>
      <p>${noticia.descripcion}</p>
      <p><strong>Fecha:</strong> 2025-05-10</p>
    `;

    div.addEventListener("click", () => {
    const detalle = document.getElementById("detalle_noticia");

    // Si ya está visible, ocultar
    if (detalle.classList.contains("visible")) {
        detalle.classList.remove("visible");
        detalle.innerHTML = ""; // Opcional: vaciar contenido
    } else {
        mostrarDetalleNoticia(noticia);
    }
    });

    contenedorNoticias.appendChild(div);
  
  });
}



function mostrarDetalleNoticia(noticia) {
  const contenedor = document.getElementById("detalle_noticia");
  contenedor.innerHTML = ""; // limpiar contenido anterior

  const card = document.createElement("div");
  card.classList.add("detalle");

  card.innerHTML = `
    <h3>${noticia.titulo}</h3>
    <p>${noticia.descripcion}</p>
    <p><strong>Fecha:</strong> 2025-05-10</p>
  `;

  //Aca estaria bueno llamar a otra funcion que normalice la direccion y la guarde en la noticia correspondiente en el json
    const dir = normalizarDireccion({
    calle: noticia.calle,
    altura: noticia.altura,
    partido: noticia.partido,
    });

    dir.then((resultado) => {
    const mapaDiv = obtenerMapa(resultado.coordenadas.x, resultado.coordenadas.y)
    card.appendChild(mapaDiv);
    contenedor.appendChild(card);
    contenedor.classList.add("visible");
});
}



function obtenerMapa(coordenada_x, coordenada_y) {
  const mapDiv = document.createElement("div");
  mapDiv.style.width = "300px";
  mapDiv.style.height = "200px";
  mapDiv.classList.add("map");

  setTimeout(() => {
    const map = L.map(mapDiv).setView([coordenada_y, coordenada_x], 17);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    L.marker([coordenada_y, coordenada_x]).addTo(map);
  }, 10); // pequeño delay para asegurar que el div esté en el DOM

  return mapDiv;
}



function normalizarDireccion(json_direccion) {
  /// Esta función recibe un JSON con el formato:
  /// {calle: nombre_calle, altura: altura, partido: partido}
  /// Devuelve la dirección normalizada o error

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
      if (data.length > 1) {
        throw new Error(
          "Se obtuvieron múltiples resultados en la normalización."
        );
      }
      return data[0];
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
}
