const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const registroPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual;

document.addEventListener('DOMContentLoaded', () => {
  formulario.addEventListener('submit', validarFormulario);
});

function validarFormulario(e) {
  e.preventDefault();

  const terminoBusqueda = document.querySelector('#termino').value;

  if (terminoBusqueda === '') {
    alertMessage('Agrega un termino de busqueda');

    return;
  }

  buscarImagenes();
}

function alertMessage(mensaje) {
  const alerta = document.createElement('P');
  const alerMessage = document.querySelector('.alerMessage');

  if (!alerMessage) {
    alerta.classList.add(
      'bg-red-300',
      'border-red-400',
      'text-red-900',
      'px-4',
      'py-3',
      'rounded',
      'mx-w-lg',
      'mx-auto',
      'mt-6',
      'text-center',
      'alerMessage'
    );

    alerta.innerHTML = `
      <strong class="font-bold">Error!</strong><br>
      <span class="block sm:inline">${mensaje}</span>
    `;

    formulario.appendChild(alerta);

    setTimeout(() => {
      alerta.remove();
    }, 2000);
  }
}

function buscarImagenes() {
  const termino = document.querySelector('#termino').value;

  const key = '34238556-8de2c5ca682fb2214a9dcea1e';
  const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registroPorPagina}&page=${paginaActual}`;

  fetch(url)
    .then((respuesta) => {
      return respuesta.json();
    })
    .then((resultado) => {
      totalPaginas = calcularPaginas(resultado.totalHits);
      mostratImagenes(resultado.hits);
    });
}

//! GENERADOR DE PAGINAS

function* crearPaginador(total) {
  for (let i = 1; i < total; i++) {
    yield i;
  }
}

function calcularPaginas(total) {
  return parseInt(Math.ceil(total / registroPorPagina));
}

function mostratImagenes(imagenes) {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }

  //* ITERAR EN EL ARREGLO

  imagenes.forEach((imagen) => {
    const { previewURL, likes, views, largeImageURL } = imagen;

    resultado.innerHTML += `
    <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
        <div class="bg-white">
            <img class ="w-full" src="${previewURL}">

             <div class="p-4">
                <p class="font-bold">${likes} <span  class="font-light">Me gusta</span></p>
                <p class="font-bold">${views} <span  class="font-light">Vistas</span></p>

                <a
                class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1" 
                href="${largeImageURL}"
                target="_blank"
                rel="noopener noreferrer">Ver Imagen</a>
             </div>
        </div>
    </div>
    `;
  });

  while (paginacionDiv.firstChild) {
    paginacionDiv.removeChild(paginacionDiv.firstChild);
  }

  imprimirPaginador();
}

function imprimirPaginador() {
  iterador = crearPaginador(totalPaginas);

  while (true) {
    const { value, done } = iterador.next();
    if (done) {
      return;
    }

    const boton = document.createElement('A');

    boton.href = '#';
    boton.dataset.pagina = value;
    boton.textContent = value;
    boton.classList.add(
      'siguiente',
      'bg-green-500',
      'px-4',
      'py-1',
      'mr-2',
      'font-bold',
      'mb-10',
      'text-white',
      'uppercase',
      'rounded'
    );

    boton.onclick = () => {
      paginaActual = value;

      buscarImagenes();
    };

    paginacionDiv.appendChild(boton);
  }
}
