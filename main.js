document.addEventListener("DOMContentLoaded", main);

let noticias = [];

async function main() {
  definirRol();
  abrirPanelFiltro();
  abrirPanelAñadirNoticia();
  filtrarNoticias();
  limpiarFiltros();

  const response = await fetch("noticias.json");
  noticias = await response.json();
  cargarNoticias(noticias);
}


