document.addEventListener("DOMContentLoaded",main);

function main (){
    abrirPanelFiltro();
    mostrarNoticias();
}

function abrirPanelFiltro(){
    let botonFiltro = document.getElementById("toggleFiltros");
    let contenedorFiltros = document.getElementById("contenedorFiltros");

    botonFiltro.addEventListener("click", () =>
    contenedorFiltros.classList.toggle("visible"));
}


async function mostrarNoticias() {
    try {
        const response = await fetch('noticias.json');
        if (!response.ok) throw new Error('Error al cargar las noticias');
        
        const noticias = await response.json();

        const contenedor = document.querySelector("main");

        contenedor.innerHTML = '';

        noticias.forEach(noticia => {
            const card = document.createElement('div');
            card.classList.add('noticia');

            const titulo = document.createElement('h2');
            titulo.textContent = noticia.titulo;

            const descripcion = document.createElement('p');
            descripcion.textContent = noticia.descripcion;

            const fecha = document.createElement('span');
            fecha.textContent = `Fecha: ${noticia.fecha}`;

            card.appendChild(titulo);
            card.appendChild(descripcion);
            card.appendChild(fecha);

            contenedor.appendChild(card);
        });
    } catch (error) {
        console.error(error.message);
    }
}

