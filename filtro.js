function filtrarNoticias(){
  const botonFiltro = document.getElementById("botonFiltro")
  botonFiltro.addEventListener("click", ()=> obtenerNoticiasPorFiltro())
}


async function obtenerNoticiasPorFiltro(){
  const inputContenido = document.getElementById("busquedaContenido");
  const inputFechaDesde = document.getElementById("busquedaFechaDesde");
  const inputFechaHasta = document.getElementById("busquedaFechaHasta");
  const inputTema = document.getElementById("busquedaTema");

  let noticiasFiltradas = []

  if(inputContenido.value != ""){
    noticiasFiltradas = filtrarPorContenido(noticias, inputContenido.value);
  }

  if (inputFechaDesde.value !=""){
    noticiasFiltradas = filtrarPorFecha(noticias, inputFechaDesde.value, true);
  }

  if (inputFechaHasta.value !=""){
    noticiasFiltradas = filtrarPorFecha(noticias, inputFechaHasta.value, false);
  }

  if (inputTema.value != "Seleccionar"){
    noticiasFiltradas = filtrarPorTema(noticias, inputTema.value);
  }

  cargarNoticias(noticiasFiltradas);
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
  
    cargarNoticias(noticias);
    omitirDetalleNoticia();
  });
}