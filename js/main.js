// js/main.js — Coordinador: único archivo que toca el DOM
import { obtenerPersonajes } from './api.js';
import {
  transformarEnTarjetas,
  buscarPorId,
  alternarFavorito,
  contarFavoritos,
  filtrarPersonajesCombinado,
  existeConEstado,
  escaparHTML,
  claseEstado
} from './procesadores.js';

// Estado en memoria
let personajesGlobales = [];
let paginaActual = 1;
let totalPaginas = 1;

// Referencias al DOM
const contenedor = document.getElementById('contenedor-tarjetas');
const spinner = document.getElementById('loading');
const alertaError = document.getElementById('alerta-error');
const textoError = document.getElementById('error-mensaje');
const btnCargar = document.getElementById('btn-cargar');
const btnReintentar = document.getElementById('btn-reintentar');
const selectEstado = document.getElementById('select-estado');
const inputBusqueda = document.getElementById('input-busqueda');
const btnAnterior = document.getElementById('btn-anterior');
const btnSiguiente = document.getElementById('btn-siguiente');
const textoPagina = document.getElementById('texto-pagina');
const contadorFavoritos = document.getElementById('contador-favoritos');
const resumen = document.getElementById('resumen');
const avisoEstado = document.getElementById('aviso-estado');
const modalNombre = document.getElementById('modal-nombre');
const modalCuerpo = document.getElementById('modal-cuerpo');

// Estado: cargando
const alternarCarga = (cargando) => {
  if (cargando) {
    spinner.classList.remove('d-none');
    contenedor.innerHTML = '';
    alertaError.classList.add('d-none');
  } else {
    spinner.classList.add('d-none');
  }
};

// Estado: error
const mostrarError = (mensaje) => {
  textoError.textContent = mensaje;
  alertaError.classList.remove('d-none');
  contenedor.innerHTML = '';
};

// Convierte errores técnicos en mensajes claros para el usuario (Reto 3)
const mensajeAmigable = (error) => {
  if (error.message.includes('Failed to fetch')) {
    return 'Sin conexión: revisa tu internet e inténtalo de nuevo.';
  }
  return error.message;
};

// Estado: éxito (o "sin resultados")
const pintarPersonajes = (lista) => {
  alertaError.classList.add('d-none');

  if (lista.length === 0) {
    contenedor.innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="fs-4 text-warning">
          No se encontraron personajes en esta dimensión 🛸
        </p>
      </div>
    `;
    return;
  }

  contenedor.innerHTML = transformarEnTarjetas(lista);
};

const actualizarContadorFavoritos = () => {
  contadorFavoritos.textContent = `⭐ Favoritos: ${contarFavoritos(personajesGlobales)}`;
};

const actualizarPaginacion = () => {
  textoPagina.textContent = `Página ${paginaActual} de ${totalPaginas}`;
  btnAnterior.disabled = paginaActual <= 1;
  btnSiguiente.disabled = paginaActual >= totalPaginas;
};

// Reto 2: un único punto que aplica búsqueda + estado sobre los datos en memoria
const ejecutarFiltros = () => {
  const filtrados = filtrarPersonajesCombinado(
    personajesGlobales,
    inputBusqueda.value,
    selectEstado.value
  );

  pintarPersonajes(filtrados);

  // Resumen "Mostrando X de Y"
  resumen.textContent = `Mostrando ${filtrados.length} de ${personajesGlobales.length}`;

  // Aviso con .some(): el estado elegido no existe en la lista cargada
  const estado = selectEstado.value;
  if (estado !== 'todos' && !existeConEstado(personajesGlobales, estado)) {
    avisoEstado.textContent = `En esta lista no hay personajes con estado ${estado}.`;
    avisoEstado.classList.remove('d-none');
  } else {
    avisoEstado.classList.add('d-none');
  }
};

// Carga una página: pide datos, guarda en memoria, actualiza paginación y pinta
const cargarPagina = async (pagina) => {
  alternarCarga(true);
  try {
    const { info, results } = await obtenerPersonajes(pagina);
    personajesGlobales = results;
    totalPaginas = info.pages;
    paginaActual = pagina;

    actualizarPaginacion();
    actualizarContadorFavoritos();
    ejecutarFiltros();
  } catch (error) {
    mostrarError(mensajeAmigable(error));
  } finally {
    // finally corre SIEMPRE: apaga el spinner con éxito o con fallo
    alternarCarga(false);
  }
};

// Reto 4: abre el modal con la ficha completa del personaje
const abrirModal = (id) => {
  const personaje = buscarPorId(personajesGlobales, id);
  if (!personaje) {
    return;
  }

  const {
    name,
    image,
    status,
    species,
    origin,
    gender = 'Sin dato',
    episode = []
  } = personaje;

  modalNombre.textContent = name;
  modalCuerpo.innerHTML = `
    <img src="${escaparHTML(image)}" class="img-fluid rounded mb-3"
         alt="${escaparHTML(name)}">
    <div class="mb-2">
      <span class="badge ${claseEstado(status)}">${escaparHTML(status)}</span>
      <span class="badge bg-dark border border-secondary">${escaparHTML(species)}</span>
    </div>
    <p class="mb-1"><strong>Origen:</strong> ${escaparHTML(origin.name)}</p>
    <p class="mb-1"><strong>Género:</strong> ${escaparHTML(gender)}</p>
    <p class="mb-0"><strong>Episodios:</strong> ${episode.length}</p>
  `;

  const modal = bootstrap.Modal.getOrCreateInstance(
    document.getElementById('modal-detalle')
  );
  modal.show();
};

// Eventos: recargar, reintentar, paginación, búsqueda y selector
btnCargar.addEventListener('click', () => cargarPagina(paginaActual));
btnReintentar.addEventListener('click', () => cargarPagina(paginaActual));

btnAnterior.addEventListener('click', () => {
  if (paginaActual > 1) {
    cargarPagina(paginaActual - 1);
  }
});

btnSiguiente.addEventListener('click', () => {
  if (paginaActual < totalPaginas) {
    cargarPagina(paginaActual + 1);
  }
});

inputBusqueda.addEventListener('input', ejecutarFiltros);
selectEstado.addEventListener('change', ejecutarFiltros);

// Delegación de eventos: un solo listener en el contenedor (favoritos + ficha)
contenedor.addEventListener('click', (evento) => {
  // Reto 1: favoritos
  const botonFavorito = evento.target.closest('.btn-favorito');
  if (botonFavorito) {
    const tarjeta = botonFavorito.closest('[data-id]');
    if (!tarjeta) {
      return;
    }
    personajesGlobales = alternarFavorito(personajesGlobales, tarjeta.dataset.id);
    actualizarContadorFavoritos();
    ejecutarFiltros();
    return;
  }

  // Reto 4: ficha con modal
  const botonDetalle = evento.target.closest('.btn-detalle');
  if (botonDetalle) {
    const tarjeta = botonDetalle.closest('[data-id]');
    if (!tarjeta) {
      return;
    }
    abrirModal(tarjeta.dataset.id);
    return;
  }

  // Clic en cualquier otra parte de la tarjeta: mostrar en consola
  const tarjeta = evento.target.closest('[data-id]');
  if (!tarjeta) {
    return;
  }
  const personaje = buscarPorId(personajesGlobales, tarjeta.dataset.id);
  console.log('Personaje seleccionado:', personaje);
});

// Arranque: cargar la primera página
cargarPagina(1);
