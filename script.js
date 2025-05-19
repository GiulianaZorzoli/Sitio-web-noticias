document.addEventListener("DOMContentLoaded", main);

let noticias = [];

async function main() {
  definirRol();
  abrirPanelFiltro();
  abrirPanelAñadirNoticia();
/*
  const response = await fetch("noticia.json");
  const noticias = await response.json();
*/
  const response = await fetch("noticia.json");
  noticias = await response.json();
  cargarNoticias(noticias);

  filtrarNoticias();
  limpiarFiltros();
}


//Definicion de rol (Administrador/Visitante)
function definirRol(){
  const btnAdmin = document.getElementById("btnAdmin");
  const btnVisitante = document.getElementById("btnVisitante");
  const btnAñadirNoticia = document.getElementById("btnAñadirNoticia");

  btnAdmin.addEventListener("click", () => {
    btnAñadirNoticia.style.display = "inline-block";
  });

  btnVisitante.addEventListener("click", () => {
    btnAñadirNoticia.style.display = "none";
  });
}

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
    /* Pendiente para cargar imagen de noticias en portal
    if (noticia.imagen) {
     div.innerHTML += `<img src="${noticia.imagen}" alt="Imagen de la noticia">`;
    }*/

    div.addEventListener("click", () => {
      const detalle = document.getElementById("detalle_noticia");
        mostrarDetalleNoticia(noticia);
    });

    contenedorNoticias.appendChild(div);
  });
}


function agregarNoticia() {
  const titulo = document.getElementById("tituloNoticia").value;
  const descripcion = document.getElementById("textoNoticia").value;
  const ubicacion = document.getElementById("ubicacionNoticia").value;

  if (titulo === "" || descripcion === "") {
    alert("Los campos Título y Texto son obligatorios.");
    return;
  }

  const nuevaNoticia = {
    id_noticia: noticias.length + 1,
    titulo: titulo,
    descripcion: descripcion,
    calle: ubicacion !== "" ? ubicacion : "",
    altura: "",
    partido: "",
    coordenada_x: "",
    coordenada_y: "",
    tema: "Sin tema",
    fecha: new Date().toISOString().split("T")[0]
  };

  noticias.push(nuevaNoticia);      
  cargarNoticias(noticias);           
  limpiarFormularioAñadir();          
  document.getElementById("panelAñadirNoticia").classList.remove("visible"); // ocultamos panel
}


function mostrarDetalleNoticia(noticia) {
  const contenedor = document.getElementById("detalle_noticia");
  contenedor.innerHTML = ""; 

  const card = document.createElement("div");
  card.classList.add("detalle");

  card.innerHTML = `
    <h3>${noticia.titulo}</h3>
    <p>${noticia.descripcion}</p>
    <p>${noticia.tema}</p>
    <p><strong>Fecha:</strong> ${noticia.fecha}</p>
  `;

  //Aca estaria bueno llamar a otra funcion que normalice la direccion y la guarde en la noticia correspondiente en el json
  //Lo debería hacer la carga de noticia, la direccion ya quedaría en el JSON
//  const dir = normalizarDireccion({
//    calle: noticia.calle,
//    altura: noticia.altura,
//    partido: noticia.partido,
//  });

// Se podria definir que las noticias solo las registramos con calle y numeracion, no con dos entre calles.
// Si no se registro una calle para la noticia, dicha noticia no posee una localizacion geografica.
    if (noticia.calle != ''){
      const mapaDiv = obtenerMapa(
      noticia.coordenada_x,
      noticia.coordenada_y
    );

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

//Menu añadir noticias
function abrirPanelAñadirNoticia() {
  const botonAñadir = document.getElementById("btnAñadirNoticia");
  const panel = document.getElementById("panelAñadirNoticia");
  const botonCancelar = document.getElementById("cancelarAñadir");
  const contenedorFiltros = document.getElementById("contenedorFiltros");
  const botonHecho = document.getElementById("publicarNoticia");

  botonAñadir.addEventListener("click", () => {
    panel.classList.toggle("visible");
    contenedorFiltros.classList.remove("visible");
  });

  botonCancelar.addEventListener("click", () => {
    limpiarFormularioAñadir();
    panel.classList.remove("visible");
  });

  botonHecho.addEventListener("click",agregarNoticia);
}

function limpiarFormularioAñadir() {
  document.getElementById("tituloNoticia").value = "";
  document.getElementById("textoNoticia").value = "";
  document.getElementById("imagenNoticia").value = "";
  document.getElementById("ubicacionNoticia").value = "";
}


//Filtro de noticias
function abrirPanelFiltro() {
  const botonFiltro = document.getElementById("toggleFiltros");
  const contenedorFiltros = document.getElementById("contenedorFiltros");
  const panelAñadirNoticia = document.getElementById("panelAñadirNoticia")

  botonFiltro.addEventListener("click", () => {
    contenedorFiltros.classList.toggle("visible");
    panelAñadirNoticia.classList.remove("visible");
  });
}


function filtrarNoticias(){
  const botonFiltro = document.getElementById("botonFiltro")
  botonFiltro.addEventListener("click", ()=> obtenerNoticiasPorFiltro())
}


async function obtenerNoticiasPorFiltro(){
  const inputContenido = document.getElementById("busquedaContenido");
  const inputFechaDesde = document.getElementById("busquedaFechaDesde");
  const inputFechaHasta = document.getElementById("busquedaFechaHasta");
  const inputTema = document.getElementById("busquedaTema");

  const response = await fetch("noticia.json");
  let noticias = await response.json();

  if(inputContenido.value != ""){
    noticias = filtrarPorContenido(noticias, inputContenido.value);
  }

  if (inputFechaDesde.value !=""){
    noticias = filtrarPorFecha(noticias, inputFechaDesde.value, true);
  }

  if (inputFechaHasta.value !=""){
    noticias = filtrarPorFecha(noticias, inputFechaHasta.value, false);
  }

  if (inputTema.value != "Seleccionar"){
    noticias = filtrarPorTema(noticias, inputTema.value);
  }

  cargarNoticias(noticias);
  omitirDetalleNoticia();
}


function filtrarPorContenido(noticias, contenido){
  const contenidoEnMinuscula = contenido.toLowerCase();

  return noticias.filter(noticia => 
    noticia.titulo.toLowerCase().includes(contenidoEnMinuscula) || 
    noticia.descripcion.toLowerCase().includes(contenidoEnMinuscula)
  );
}


function filtrarPorFecha(noticias, fecha, esFechaDesde){
  const fechaObj = new Date(fecha);

  return noticias.filter(noticia => {
    const fechaNoticia = new Date(noticia.fecha);
    if(esFechaDesde){
      return fechaNoticia >= fechaObj;
    }else{
      return fechaNoticia <= fechaObj;
    }
  }
  )
}

function filtrarPorTema(noticias, tema){
  return noticias.filter(noticia => noticia.tema == tema);
}


function limpiarFiltros(){
  const botonLimpiar = document.getElementById("botonLimpiar");

  botonLimpiar.addEventListener("click", async () => {

    document.getElementById("busquedaContenido").value = "";
    document.getElementById("busquedaFechaDesde").value = "";
    document.getElementById("busquedaFechaHasta").value = "";
    document.getElementById("busquedaTema").value = "Seleccionar"; // o el valor por defecto


    const response = await fetch("noticia.json");
    const noticias = await response.json();
    cargarNoticias(noticias);
    omitirDetalleNoticia();
  });
}
