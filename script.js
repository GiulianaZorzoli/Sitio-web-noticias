document.addEventListener("DOMContentLoaded",main);

function main (){
    abrirPanelFiltro();
}

function abrirPanelFiltro(){
    let botonFiltro = document.getElementById("toggleFiltros");
    let contenedorFiltros = document.getElementById("contenedorFiltros");

    botonFiltro.addEventListener("click", () =>
    contenedorFiltros.classList.toggle("visible"));
}