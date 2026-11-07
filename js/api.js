// js/api.js — Servicio de red: solo habla con el servidor
import CONFIG from './config.js';

// pagina = 1 por defecto: la API devuelve { info, results }
export const obtenerPersonajes = async (pagina = 1) => {
  try {
    // 1. await pausa ESTA función hasta que el servidor responda
    const respuesta = await fetch(`${CONFIG.urlApi}?page=${pagina}`);

    // 2. fetch solo falla por red caída: un 404 o 500 se revisa a mano
    if (!respuesta.ok) {
      throw new Error(
        `El servidor respondió con error (código ${respuesta.status})`
      );
    }

    // 3. .json() convierte el texto JSON en un objeto (también es async)
    const datos = await respuesta.json();

    // 4. Devolvemos el objeto completo: { info, results }
    return datos;
  } catch (error) {
    console.error('Error en obtenerPersonajes:', error.message);
    throw error;   // se relanza para que main.js muestre el error
  }
};
