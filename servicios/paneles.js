//Definicion de rol (Administrador/Visitante)
function definirRol(){
  const btnAdmin = document.getElementById("btnAdmin");
  const btnVisitante = document.getElementById("btnVisitante");
  const btnAñadirNoticia = document.getElementById("btnAñadirNoticia");

  btnAdmin.addEventListener("click", () => {
    btnAñadirNoticia.style.display = "inline-block";
  });

  btnVisitante.addEventListener("click", () => {
    const panel = document.getElementById("panelAñadirNoticia");
    btnAñadirNoticia.style.display = "none";
    limpiarFormularioAñadir();
    panel.classList.remove("visible");
  });
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

//Menu Añadir Noticia
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

  botonHecho.addEventListener("click", () => {
    agregarNoticia();
    limpiarFormularioAñadir();
    panel.classList.remove("visible");
  });
}

function limpiarFormularioAñadir() {
  document.getElementById("tituloNoticia").value = "";
  document.getElementById("textoNoticia").value = "";
  const imgInput = document.getElementById("imagenNoticia");
  if (imgInput) imgInput.value = "";

  const calleInput = document.getElementById("calleNoticia");
  if (calleInput) calleInput.value = "";

  const alturaInput = document.getElementById("alturaNoticia");
  if (alturaInput) alturaInput.value = "";

  const partidoInput = document.getElementById("partidoNoticia");
  if (partidoInput) partidoInput.value = "";
}

