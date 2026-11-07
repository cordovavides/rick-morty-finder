// js/procesadores.js — Funciones puras: reciben datos y devuelven datos.
// Regla: aquí NO se toca el DOM.

// Convierte texto externo en texto seguro para usar con innerHTML
export const escaparHTML = (texto) => String(texto)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

// Devuelve la clase de color de Bootstrap según el estado
export const claseEstado = (status) => {
  if (status === 'Alive') {
    return 'bg-success';
  } else if (status === 'Dead') {
    return 'bg-danger';
  }
  return 'bg-secondary';
};

// map: transforma cada personaje en el HTML de su tarjeta
export const transformarEnTarjetas = (personajes) => personajes
  .map(({ id, name, status, species, image, origin, favorito = false }) => `
    <div class="col" data-id="${id}">
      <div class="card h-100 bg-secondary bg-opacity-25 border-secondary">
        <img src="${escaparHTML(image)}" class="card-img-top"
             alt="${escaparHTML(name)}" loading="lazy">
        <div class="card-body d-flex flex-column">
          <h2 class="h5 card-title mb-1">${escaparHTML(name)}</h2>
          <div class="mb-2">
            <span class="badge ${claseEstado(status)}">${escaparHTML(status)}</span>
            <span class="badge bg-dark border border-secondary">${escaparHTML(species)}</span>
          </div>
          <p class="card-text text-secondary small mt-auto mb-0">
            <strong>Origen:</strong> ${escaparHTML(origin.name)}
          </p>
          <button class="btn btn-sm btn-outline-warning btn-favorito mt-2">
            ${favorito ? '⭐ Favorito' : '☆ Marcar'}
          </button>
          <button class="btn btn-sm btn-outline-info btn-detalle mt-2">Ver ficha</button>
        </div>
      </div>
    </div>
  `)
  .join('');

// filter: por estado ('todos' devuelve una copia de la lista completa)
export const filtrarPorEstado = (personajes, estado) => {
  if (estado === 'todos') {
    return [...personajes];
  }
  return personajes.filter(({ status }) => status === estado);
};

// filter: por coincidencia en el nombre (sin importar mayúsculas)
export const filtrarPorNombre = (personajes, texto) => {
  const termino = texto.toLowerCase().trim();
  return personajes.filter(({ name }) => name.toLowerCase().includes(termino));
};

// find: un personaje por id (el id puede llegar como texto)
export const buscarPorId = (personajes, id) =>
  personajes.find((personaje) => personaje.id === Number(id));

// some: ¿existe al menos un personaje con ese estado?
export const existeConEstado = (personajes, estado) =>
  personajes.some(({ status }) => status === estado);

// Reto 1: alterna favorito sin mutar la lista (map + spread)
export const alternarFavorito = (personajes, id) =>
  personajes.map((personaje) => {
    if (personaje.id === Number(id)) {
      return { ...personaje, favorito: !personaje.favorito };
    }
    return personaje;
  });

// Reto 1: cuenta cuántos personajes están marcados como favoritos
export const contarFavoritos = (personajes) =>
  personajes.filter(({ favorito }) => favorito).length;

// Reto 2: combina búsqueda por nombre y filtro por estado (dos filter encadenados)
export const filtrarPersonajesCombinado = (lista, texto, estado) => {
  const termino = texto.toLowerCase().trim();
  return lista
    .filter(({ name }) => name.toLowerCase().includes(termino))
    .filter(({ status }) => estado === 'todos' || status === estado);
};
