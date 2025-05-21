//Carga y visualizacion de noticias
async function cargarNoticias(noticias) {
  const contenedorNoticias = document.getElementById("lista_noticias");

  contenedorNoticias.innerHTML = "";

  noticias.forEach((noticia) => {
    const div = document.createElement("div");
    div.classList.add("noticia");
    div.innerHTML = `
      <h3>${noticia.titulo}</h3>
      <p>${noticia.descripcion}</p>
      <p><strong>Fecha:</strong> ${noticia.fecha}</p>
    `;
    div.addEventListener("click", () => {
      const detalle = document.getElementById("detalle_noticia");
      mostrarDetalleNoticia(noticia);
    });

    contenedorNoticias.appendChild(div);
  });
}

function mostrarDetalleNoticia(noticia) {
  const contenedor = document.getElementById("detalle_noticia");
  contenedor.innerHTML = "";

  const card = document.createElement("div");
  card.classList.add("detalle");

  const encabezado = document.createElement("div");
  encabezado.innerHTML = `
    <p><strong>${noticia.tema}</strong></p>
    <h3>${noticia.titulo}</h3>
  `;
  card.appendChild(encabezado);

  VisualizarCarruselImagenes(noticia, card);

  const cuerpo = document.createElement("div");
  cuerpo.innerHTML = `
    <p>${noticia.descripcion}</p>
    <p><strong>Fecha:</strong> ${noticia.fecha}</p>
  `;
  card.appendChild(cuerpo);

  if (noticia.coordenada_x && noticia.coordenada_y) {
    const mapaDiv = obtenerMapa(noticia.coordenada_x, noticia.coordenada_y);

    card.appendChild(mapaDiv);
  }

  contenedor.appendChild(card);
  contenedor.classList.add("visible");
}

function omitirDetalleNoticia() {
  const contenedor = document.getElementById("detalle_noticia");
  contenedor.innerHTML = "";
  contenedor.classList.remove("visible");
}

async function agregarNoticia() {
  const titulo = document.getElementById("tituloNoticia").value.trim();
  const descripcion = document.getElementById("textoNoticia").value.trim();
  const calle = document.getElementById("calleNoticia").value.trim();
  const altura = document.getElementById("alturaNoticia").value.trim();
  const partido = document.getElementById("partidoNoticia").value.trim();
  const tema = document.getElementById("SeleccionTema").value.trim();

  // Validación básica
  if (titulo == "" || descripcion == "" || tema == "Seleccionar") {
    alert("Los campos Título, Texto y Tema son obligatorios.");
    return;
  }

  const inputImagen = document.getElementById("imagenNoticia");
  const archivosImagen = Array.from(inputImagen.files);

  let imagenes;
  if (archivosImagen.length > 0) {
    console.log(archivosImagen)
    imagenes = archivosImagen.map((file) => URL.createObjectURL(file));
  }

  let x = "";
  let y = "";

  if (calle != "" || altura != "" || partido != "") {

    const ubi = { calle, altura, partido };

    const coordenadasDireccion = await obtenerCoordenadas(ubi);

    // Validar que se hayan podido obtener las coordenadas
    if (coordenadasDireccion === null) {
      if (calle == "") {
        alert(
          "No se pudo geolocalizar la dirección ingresada. Por favor, ingrese una calle."
        );
        return;
      }
  
      if (altura == "") {
        alert(
          "No se pudo geolocalizar la dirección ingresada. Por favor, ingrese una altura."
        );
        return;
      }
      if (partido == "") {
        alert(
          "No se pudo geolocalizar la dirección ingresada. Por favor, ingrese un partido."
        );
        return;
      }
      alert("No se pudo geolocalizar la dirección ingresada. Por favor, revise los datos e intente nuevamente.");
      return;
    } else {
      x = coordenadasDireccion.x;
      y = coordenadasDireccion.y;
    }
  }

  const nuevaNoticia = {
    id_noticia: noticias.length + 1,
    titulo: titulo,
    descripcion: descripcion,
    calle: calle,
    altura: altura,
    partido: partido,
    coordenada_x: x || "",
    coordenada_y: y || "",
    tema: tema,
    fecha: new Date().toISOString().split("T")[0],
    imagenes: imagenes,
  };

  console.log(nuevaNoticia)

  noticias.push(nuevaNoticia);
  cargarNoticias(noticias);
  filtrarNoticias();
  limpiarFormularioAñadir();
  document.getElementById("panelAñadirNoticia").classList.remove("visible");
}

function VisualizarCarruselImagenes(noticia, card) {
  if (noticia.imagenes && noticia.imagenes.length > 0) {
    const carruselDiv = document.createElement("div");
    carruselDiv.classList.add("carrusel");

    const img = document.createElement("img");
    img.src = noticia.imagenes[0];
    img.alt = "Imagen de la noticia";
    img.classList.add("img-carrusel");
    carruselDiv.appendChild(img);

    let index = 0;

    const btnPrev = document.createElement("button");
    btnPrev.textContent = "◀";
    btnPrev.addEventListener("click", () => {
      index = (index - 1 + noticia.imagenes.length) % noticia.imagenes.length;
      img.src = noticia.imagenes[index];
    });

    const btnNext = document.createElement("button");
    btnNext.textContent = "▶";
    btnNext.addEventListener("click", () => {
      index = (index + 1) % noticia.imagenes.length;
      img.src = noticia.imagenes[index];
    });

    carruselDiv.prepend(btnPrev);
    carruselDiv.appendChild(btnNext);

    card.appendChild(carruselDiv);
  }
}
