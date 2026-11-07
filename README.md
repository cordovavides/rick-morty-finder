# 🛸 Rick & Morty Portal Finder

Aplicación web modular que consulta la [API pública de Rick and Morty](https://rickandmortyapi.com/), muestra personajes en tarjetas y permite buscarlos, filtrarlos y marcarlos como favoritos.

Proyecto del curso **Web Fundamentals Frontend** (Clase 12): desestructuración, módulos ES, métodos de arreglos y asincronía con `fetch`.

---

## ✨ Funcionalidades

- 🔍 **Buscador en tiempo real** por nombre (evento `input`).
- 🎚️ **Filtro por estado** (`Alive`, `Dead`, `unknown`) combinable con la búsqueda.
- ⭐ **Favoritos**: marca/desmarca personajes con un contador, sin mutar los datos (inmutabilidad).
- 📄 **Paginación**: navegación entre páginas con botones Anterior / Siguiente.
- 🪟 **Ficha de personaje** en un modal (imagen, estado, especie, origen, género y nº de episodios).
- ⏳ **Tres estados de pantalla**: cargando (spinner), éxito (tarjetas) y error (mensaje + reintentar).
- 🛡️ **Manejo de errores**: validación de `response.ok`, `try/catch/finally` y mensajes amigables.
- 🔐 **Seguridad**: escape de texto externo con `escaparHTML` antes de usar `innerHTML`.

---

## 🧰 Tecnologías

- **HTML5** + **Bootstrap 5.3** (CDN, tema oscuro).
- **JavaScript ES Modules** (`import` / `export`, `<script type="module">`).
- **`fetch`** + **`async`/`await`** contra la API de Rick and Morty.

---

## 📁 Estructura del proyecto

```text
rick-morty-finder/
├── index.html           # Vista con Bootstrap 5.3 (controles, tarjetas, modal)
├── README.md            # Este archivo
├── GUIA_ALUMNO_S12.md   # Guía de la clase (conceptos, práctica y retos)
└── js/
    ├── config.js        # Configuración (URL de la API) — export default
    ├── datos.js         # Datos de prueba "quemados" para los laboratorios
    ├── api.js           # Servicio de red: fetch, errores y paginación
    ├── procesadores.js  # Funciones puras: filtrar, buscar, favoritos, tarjetas
    └── main.js          # Coordinador: el único archivo que toca el DOM
```

Cada archivo tiene **una responsabilidad clara**:

| Archivo | Responsabilidad |
|---|---|
| `config.js` | Guarda la configuración (URL de la API). |
| `datos.js` | Datos de prueba usados en los laboratorios de clase. |
| `api.js` | Habla con internet (`fetch`) y valida la respuesta. |
| `procesadores.js` | Funciones puras que reciben datos y devuelven datos nuevos. No tocan el DOM. |
| `main.js` | Coordina el DOM, el estado en memoria y los eventos. |

---

## 🚀 Cómo ejecutarlo

> ⚠️ **Importante:** los módulos ES **no funcionan** abriendo `index.html` con doble clic (el navegador bloquea los módulos en `file://`). Debes servir el proyecto con un servidor local.

### Opción recomendada: Live Server (VS Code)

1. Instala la extensión **Live Server** en VS Code.
2. Haz clic derecho sobre `index.html`.
3. Selecciona **Open with Live Server**.

### Alternativa con Python

```bash
# Dentro de la carpeta del proyecto
python -m http.server 8000
```

Luego abre `http://localhost:8000` en tu navegador.

---

## 🌐 API utilizada

- **Endpoint:** `https://rickandmortyapi.com/api/character`
- **Paginación:** `?page=N`
- **Respuesta:** objeto con `info` (incluye `pages`) y `results` (arreglo de personajes).

Cada personaje incluye, entre otros: `id`, `name`, `status`, `species`, `image`, `origin`, `gender` y `episode`.

---

## 🧠 Conceptos aplicados

- **Desestructuración** de objetos y arreglos (alias, anidada, valores por defecto).
- **Spread (`...`)** para copiar y actualizar sin mutar.
- **Módulos ES**: `export` nombrado, `export default`, `import` y `type="module"`.
- **Métodos de arreglos**: `forEach`, `map`, `filter`, `find`, `some` y encadenamiento.
- **Asincronía**: promesas, `async`/`await`, `try/catch/finally` y `fetch`.
- **Delegación de eventos** con `closest()` y `data-*` (`dataset`).
- **Inmutabilidad**: nunca se muta la lista original; se crean listas nuevas.

---

## 📝 Notas

- Los favoritos y el estado de cada página viven en memoria; al recargar o cambiar de página se reinician (es lo esperado en esta práctica).
- El buscador y el filtro por estado actúan sobre la página cargada actualmente.
