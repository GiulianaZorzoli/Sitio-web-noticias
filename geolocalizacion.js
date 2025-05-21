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
      if (data.length > 1 || data[0].tipo != "calle_altura") {
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


async function obtenerCoordenadas(ubi) {
  const direccionNormalizada = await normalizarDireccion(ubi);
  if (direccionNormalizada && direccionNormalizada.coordenadas) {
    const coordenadas = {
      x: direccionNormalizada.coordenadas.x,
      y: direccionNormalizada.coordenadas.y,
    }
    return coordenadas;
  } else {
    console.error("No se pudo obtener las coordenadas.");
    return null;
  }
}

//Normalizacion de direccion de una noticia y obtencion de mapa
function obtenerMapa(coordenada_x, coordenada_y) {
  const mapDiv = document.createElement("div");
  mapDiv.style.width = "300px";
  mapDiv.style.height = "200px";
  mapDiv.classList.add("map");

  setTimeout(() => {
    const map = L.map(mapDiv).setView([coordenada_y, coordenada_x], 17);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    L.marker([coordenada_y, coordenada_x]).addTo(map);
  }, 10); // pequeño delay para asegurar que el div esté en el DOM

  return mapDiv;
}


