![Logo Kodigo](../../../img/logo-k-dark-bg.png)
<span style="font-size: 20px; font-weight: bold;">Web Fundamentals Frontend</span>
Coach: **Eduardo Calles**
<small>2026-10</small>
# Clase 12 · Desestructuración, módulos, métodos de arreglos y asincronía con fetch

**Guía del Alumno** · Viernes 30 de octubre de 2026

**Proyecto de hoy:** 🛸 Rick & Morty Portal Finder: una aplicación modular que consulta una API real, muestra sus estados de carga y error, y filtra personajes en vivo.

> *"Hasta hoy, tus programas vivían encerrados en su propia memoria. Hoy tu código aprende tres habilidades profesionales: ordenarse en archivos con una responsabilidad clara, transformar colecciones de datos con métodos expresivos y viajar por internet para traer información real sin congelar la pantalla. Es el salto de escribir scripts a construir aplicaciones web."*

---

## 1. Objetivos

Al terminar esta sesión y tu práctica de la semana podrás:

1. Extraer datos de objetos y arreglos con **desestructuración** (alias, anidada, valores por defecto) y crear copias o actualizaciones con **spread** en objetos y en arreglos.
2. Dividir una aplicación en **módulos ES** usando `export` nombrado, `export default`, `import` y `type="module"`.
3. Elegir y aplicar `forEach`, `map`, `filter`, `find` y `some`, y **encadenarlos**.
4. Explicar qué es una **API**, qué es **JSON** y qué es una **promesa**, y por qué `async/await` evita congelar la pantalla.
5. Consumir una API con `fetch`, validando `response.ok` y controlando fallos con `try/catch/finally`.
6. Mostrar en el DOM los tres estados de una petición: **cargando**, **éxito** y **error**.
7. Construir filtros y buscador en vivo que conectan los módulos con el DOM.
8. Terminar por tu cuenta los **4 retos** de la hoja de ruta (sábado a miércoles) usando solo lo que contiene esta guía.

---

## 2. Mapa de la sesión (para ubicarte en la grabación)

| Min | Bloque | Qué haremos |
|---|---|---|
| 00–08 | Rampa y demo | Demo de la aplicación terminada y qué es una API |
| 08–20 | **A. Desestructuración y spread** | Experimentos en consola con un objeto "quemado" |
| 20–31 | **B. Módulos** | `datos.js`, `config.js` (`export default`) y `type="module"` · **Commit 1** |
| 31–55 | **C. Métodos de arreglos** | `forEach`, `map`, `filter`, `find`, `some`, encadenamiento y `procesadores.js` |
| 55–65 | **Descanso** | 10 minutos |
| 65–80 | **D. Asincronía** | Servidor simulado, `async/await`, `try/catch/finally` y `fetch` real en `api.js` · **Commit 2** |
| 80–88 | **E. La API sin formato** | El JSON en la consola y datos simples en párrafos con `<br>` |
| 88–105 | **F. Mini-proyecto** | Tarjetas, estados de carga y error, filtro por estado y clic con `.find` · **Commit 3** |
| 105–117 | Reto Normal | Buscador por nombre en tiempo real |
| 117–120 | Cierre | Ticket de salida, `git push` y hoja de ruta |

---

## 3. Antes de empezar

### Checklist
- [ ] Google Chrome o Edge actualizado (DevTools con `F12`).
- [ ] VS Code con **Auto Save** activado y la extensión **Live Server** instalada.
- [ ] Terminal de Git Bash lista.
- [ ] Conexión a internet estable (consumiremos una API real).

> ⚠️ **Los módulos no funcionan abriendo el archivo con doble clic.** Por seguridad, el navegador bloquea los módulos cuando la página se abre como `file://`. Siempre abre el proyecto con **Live Server** (clic derecho sobre `index.html` → *Open with Live Server*).

### Crear el proyecto (5 min)

```bash
mkdir rick-morty-finder
cd rick-morty-finder
git init
mkdir js
touch index.html js/datos.js js/config.js js/procesadores.js js/api.js js/main.js
code .
```

Estructura final del proyecto:

```text
rick-morty-finder/
├── index.html           # Vista con Bootstrap 5.3
└── js/
    ├── datos.js         # Datos de prueba "quemados"
    ├── config.js        # Configuración (export default)
    ├── procesadores.js  # Funciones puras: map, filter, find, some
    ├── api.js           # Servicio de red: fetch y errores
    └── main.js          # Coordinador: el único que toca el DOM
```

**Copia en `index.html` la interfaz completa:**

```html
<!DOCTYPE html>
<html lang="es" data-bs-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rick &amp; Morty Portal Finder</title>
  <!-- Bootstrap 5.3 CDN -->
  <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
</head>
<body class="bg-dark text-light min-vh-100 py-4">

  <main class="container">
    <header class="text-center mb-4">
      <h1 class="display-5 fw-bold text-success">🛸 Rick &amp; Morty Portal Finder</h1>
      <p class="text-secondary">
        Módulos, métodos de arreglos y asincronía con fetch
      </p>
    </header>

    <!-- Controles -->
    <section class="card bg-secondary bg-opacity-10 border-secondary mb-4 p-3">
      <div class="row g-2 align-items-center">
        <div class="col-12 col-md-5">
          <input type="text" id="input-busqueda" class="form-control"
                 placeholder="Buscar por nombre (ej: Rick, Morty)...">
        </div>
        <div class="col-6 col-md-4">
          <select id="select-estado" class="form-select">
            <option value="todos">Todos los estados</option>
            <option value="Alive">Vivos (Alive)</option>
            <option value="Dead">Muertos (Dead)</option>
            <option value="unknown">Desconocidos (unknown)</option>
          </select>
        </div>
        <div class="col-6 col-md-3 d-grid">
          <button id="btn-cargar" class="btn btn-success fw-bold">
            ↻ Recargar datos
          </button>
        </div>
      </div>
    </section>

    <!-- Zona de pruebas: datos sin formato (Bloque E) -->
    <div id="salida-simple" class="mb-4 text-info"></div>

    <!-- Estado 1: cargando -->
    <div id="loading" class="text-center py-5 d-none">
      <div class="spinner-border text-success" role="status"
           style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-2 text-secondary">Sintonizando la frecuencia de la Ciudadela...</p>
    </div>

    <!-- Estado 2: error -->
    <div id="alerta-error" class="alert alert-danger d-none" role="alert">
      <span class="fw-bold">⚠️ Error:</span> <span id="error-mensaje"></span>
    </div>

    <!-- Estado 3: éxito (tarjetas) -->
    <section id="contenedor-tarjetas"
             class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
    </section>
  </main>

  <!-- type="module" habilita import/export en el navegador -->
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

> ⚠️ **Cuidado al copiar enlaces:** deben quedar como URL simples. Si tu editor o el visor de Markdown las convierte en `[https://...](https://...)`, la página perderá sus estilos y las imágenes y la API dejarán de funcionar. Si ves corchetes y paréntesis alrededor de una URL, bórralos.

Abre con Live Server y haz el primer commit:

```bash
git add .
git commit -m "chore: estructura inicial modular del proyecto"
```

---

## 4. Conceptos clave

### 4.1 Desestructuración: sacar piezas de un objeto o de un arreglo

En vez de repetir `personaje.name`, `personaje.status`, **desempacas** lo que necesitas en una línea.

| Qué quieres | Sintaxis | Ejemplo |
|---|---|---|
| Sacar propiedades de un objeto | `const { a, b } = objeto` | `const { name, status } = personaje` |
| Cambiar el nombre (**alias**) | `const { a: otroNombre } = objeto` | `const { species: especie } = personaje` |
| Entrar a un objeto **anidado** | `const { x: { y } } = objeto` | `const { origin: { name: planeta } } = personaje` |
| Valor **por defecto** si no existe | `const { a = valor } = objeto` | `const { gender = 'Sin dato' } = personaje` |
| Sacar elementos de un **arreglo** | `const [a, b] = arreglo` | `const [lider, segundo] = equipo` |
| Primero y **el resto** | `const [a, ...resto] = arreglo` | `const [primero, ...resto] = equipo` |
| En los **parámetros** de una función | `({ a, b }) => ...` | `({ name, status }) => name + status` |

**Dos reglas para no confundirte:**
- En **objetos** importa el **nombre** de la propiedad (el orden no importa).
- En **arreglos** importa la **posición** (el nombre lo eliges tú).

### 4.2 Spread (`...`): copiar y modificar sin tocar el original

| Qué quieres | Ejemplo |
|---|---|
| Copiar un arreglo | `const copia = [...equipo]` |
| Agregar a un arreglo | `const nuevo = [...equipo, 'Beth']` |
| Copiar un objeto | `const copia = { ...personaje }` |
| Copiar un objeto **y cambiar/agregar** algo | `const actualizado = { ...personaje, favorito: true }` |

**El orden importa en objetos:** lo que va **después** sobrescribe lo anterior.

```js
const a = { ...personaje, status: 'Dead' };   // status → 'Dead'  (gana lo último)
const b = { status: 'Dead', ...personaje };   // status → 'Alive' (el objeto pisa)
```

> ⚠️ **El spread hace una copia superficial.** El objeto o arreglo de afuera es nuevo, pero los objetos que van **adentro** se siguen compartiendo (`copia.origin === original.origin` es `true`). Por eso no existe "magia": para cambiar algo anidado hay que copiar también esa capa.

### 4.3 Módulos ES: un archivo, una responsabilidad

Un **módulo** es un archivo con su **propio alcance**: lo que declaras dentro no es visible afuera, salvo lo que **exportes**.

| Tipo | Se escribe así | Se importa así |
|---|---|---|
| Exportación **nombrada** (varias por archivo) | `export const sumar = ...` | `import { sumar } from './archivo.js'` |
| Exportación **por defecto** (una por archivo) | `export default CONFIG` | `import CONFIG from './archivo.js'` |
| **Alias** al importar | — | `import { sumar as suma } from './archivo.js'` |
| Mezcla | — | `import CONFIG, { sumar } from './archivo.js'` |

```js
// matematicas.js
export const PI = 3.1416;               // nombrada
export const sumar = (a, b) => a + b;   // nombrada
const IVA = 0.13;
export default IVA;                     // por defecto

// main.js
import IVA, { PI, sumar } from './matematicas.js';
```

**Reglas del navegador:**
- El `<script>` debe llevar `type="module"`.
- La ruta empieza con `./` (o `../`) y termina con la extensión `.js`.
- Con `{ }` el nombre debe coincidir **exactamente**. Con `default`, el nombre lo eliges tú.
- Se abre con Live Server, no con doble clic.

> 💡 **Más adelante (React con Vite):** allí la extensión `.js` ya no es obligatoria, pero la idea es idéntica: cada componente es un archivo que exporta algo y otro lo importa.

### 4.4 Métodos de arreglos: pensar en "qué quiero obtener"

Todos reciben un **callback** (como el `criterioCallback` que escribiste en la clase de callbacks; `.filter` es su versión oficial) y **ninguno modifica el arreglo original** (inmutabilidad).

| Método | Propósito | Devuelve | Cuándo usarlo |
|---|---|---|---|
| `.forEach()` | **Recorrer** y ejecutar algo por elemento | `undefined` (nada) | Imprimir, efectos sueltos |
| `.map()` | **Transformar** cada elemento | Arreglo nuevo **del mismo largo** | Datos → HTML, extraer una columna |
| `.filter()` | **Seleccionar** los que cumplen | Arreglo nuevo (puede ser `[]`) | Filtros y búsquedas |
| `.find()` | **Localizar** el primero que cumple | El elemento, o `undefined` | Buscar por `id` |
| `.some()` | **Preguntar** si al menos uno cumple | `true` o `false` | Validaciones de existencia |

**¿Cuál uso?**
- ¿Necesito un arreglo nuevo con **todos** transformados? → `map`.
- ¿Necesito **algunos** de ellos? → `filter`.
- ¿Necesito **uno** solo? → `find`.
- ¿Solo necesito un **sí o no**? → `some`.
- ¿Solo quiero recorrer sin devolver nada? → `forEach`.

**Encadenamiento:** como `filter` y `map` devuelven arreglos, puedes seguir llamando métodos sobre el resultado:

```js
personajes
  .filter((p) => p.status === 'Alive')   // 1) me quedo con los vivos
  .map((p) => p.name);                   // 2) de esos, solo los nombres
```

**Dos detalles que usaremos hoy:**
- `.map()` para generar HTML devuelve un **arreglo de textos**. Para pegarlo en pantalla se une con `.join('')`. Sin `.join('')` aparecerían **comas** entre las tarjetas.
- **Actualizar un solo elemento sin mutar** = `map` + spread de objeto:

```js
lista.map((p) => {
  if (p.id === 2) {
    return { ...p, visto: true };   // copia del elemento con el cambio
  }
  return p;                         // los demás pasan igual
});
```

### 4.5 Asincronía: API, JSON, promesas y `async/await`

**¿Qué es una API?** Un servicio en internet al que le **pides datos** a través de una dirección (URL). Hoy usaremos la API pública de Rick & Morty.

**¿Qué es JSON?** El formato de **texto** en el que viajan los datos. Se parece a un objeto de JavaScript, pero es texto: hay que convertirlo (`.json()`).

**¿Qué es HTTP?** El idioma de la petición. Cada respuesta trae un **código de estado**:

| Código | Significa | `response.ok` |
|---|---|---|
| `200` | Todo bien | `true` |
| `404` | No existe lo que pediste | `false` |
| `500` | Falló el servidor | `false` |

**Analogía del restaurante:** pides un plato y el mesero te da un **ticket**. No te quedas congelado frente a la cocina: sigues conversando y, cuando el plato está listo, te lo traen. Ese ticket es una **promesa**.

**Síncrono vs. asíncrono:**
- **Síncrono:** una instrucción espera a que termine la anterior. Si una tarea tarda, todo se congela.
- **Asíncrono:** la tarea lenta (pedir datos por internet) se lanza y el programa **sigue**; el resultado llega después.

**Una promesa** (`Promise`) representa un valor que **llegará en el futuro** y tiene tres estados:

| Estado | Significa |
|---|---|
| `pending` | Todavía esperando |
| `fulfilled` | Se cumplió: ya hay un valor |
| `rejected` | Falló: hay un error |

**Cómo se consume una promesa:**

```js
// Forma antigua: .then / .catch (la verás en muchos tutoriales)
pedirDatos().then((datos) => console.log(datos));

// Forma moderna: async / await (la que usaremos)
const mostrar = async () => {
  const datos = await pedirDatos();
  console.log(datos);
};
```

- `async` marca una función para que **siempre devuelva una promesa**.
- `await` solo funciona **dentro de una función `async`** (o en el nivel superior de un módulo). Pausa **esa función** hasta que la promesa se resuelva; el resto de la página sigue viva.

**`try / catch / finally`:**

```js
try {
  // intenta esto
} catch (error) {
  // si algo falla, llegas aquí con el error
} finally {
  // se ejecuta SIEMPRE, haya éxito o fallo
}
```

**`fetch` falla de dos maneras distintas:**

| Qué pasó | ¿Salta al `catch`? | Cómo lo detectas |
|---|---|---|
| Sin internet / URL imposible | **Sí** (`TypeError: Failed to fetch`) | El `catch` |
| El servidor respondió 404 o 500 | **No** | `if (!respuesta.ok)` |

Por eso siempre se revisa `response.ok`. Además, `.json()` **también es asíncrono**: lleva su propio `await`.

### 4.6 Los tres estados de una pantalla con datos remotos

Mientras esperas datos, tu interfaz debe estar siempre en **uno** de estos estados:

| Estado | Qué ve el usuario |
|---|---|
| **Cargando** | Un spinner |
| **Éxito** | Los datos (o un mensaje "sin resultados") |
| **Error** | Un mensaje claro de qué falló |

### 4.7 Eventos en elementos que se crean con JavaScript

Las tarjetas se **crean después** de cargar la página, así que no puedes ponerle un listener a cada botón al inicio. La solución es la **delegación de eventos**: un solo listener en el **contenedor** que detecta de dónde vino el clic.

| Pieza | Para qué sirve |
|---|---|
| `evento.target` | El elemento exacto donde hiciste clic |
| `.closest('selector')` | Sube por los padres hasta encontrar el que coincide (o `null`) |
| `data-id="5"` en el HTML | Guarda un dato dentro del elemento |
| `elemento.dataset.id` | Lee ese dato en JavaScript (siempre como **texto**) |

```js
contenedor.addEventListener('click', (evento) => {
  const tarjeta = evento.target.closest('[data-id]');
  if (!tarjeta) {
    return;                    // el clic no fue dentro de una tarjeta
  }
  console.log(tarjeta.dataset.id);
});
```

### 4.8 Seguridad: los datos externos no son de confianza

Todo texto que **no escribiste tú** (un formulario o una API) y que pegues con `innerHTML` debe pasar primero por `escaparHTML`, que convierte `<`, `>`, `&` y `"` en versiones inofensivas. Hoy la usaremos en las tarjetas. *(No necesitas memorizar las expresiones entre `/ /`; solo saber qué hace la función.)*

---

## 5. Práctica guiada paso a paso

### Bloque A · Desestructuración y spread (min 8–20)

Solo consola. Abre `js/main.js` y escribe este laboratorio:

```js
// js/main.js — Laboratorio: desestructuración y spread (solo consola)

const personaje = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  origin: { name: 'Earth (C-137)' }
};

// 0. Sin desestructuración: repetimos "personaje." cada vez
const nombreViejo = personaje.name;
const estadoViejo = personaje.status;
console.log('0.', nombreViejo, estadoViejo);

// 1. Con desestructuración: varias propiedades en una sola línea
const { name, status } = personaje;
console.log('1.', name, status);

// 2. Alias: guardamos la propiedad con otro nombre
const { species: especie } = personaje;
console.log('2.', especie);

// 3. Objeto anidado: entramos a origin y sacamos su name con alias
const { origin: { name: planeta } } = personaje;
console.log('3.', planeta);

// 4. Valor por defecto: solo se usa si la propiedad NO existe
const { gender = 'Sin dato' } = personaje;
console.log('4.', gender);

// 5. Arreglos: importa la POSICIÓN, no el nombre
const equipo = ['Rick', 'Morty', 'Summer', 'Jerry'];
const [lider, segundo] = equipo;
const [primero, ...resto] = equipo;
console.log('5.', lider, segundo);
console.log('6.', primero, resto.length);

// 6. En los parámetros de una función
const presentar = ({ name, status }) => `${name} está ${status}`;
console.log('7.', presentar(personaje));

// 7. Spread en objetos: copia + cambio, sin tocar el original
const conFavorito = { ...personaje, favorito: true };
const rickMuerto = { ...personaje, status: 'Dead' };
console.log('8.', conFavorito.favorito);
console.log('9.', personaje.status, rickMuerto.status);

// 8. El orden importa: lo que va DESPUÉS sobrescribe
const sobrescrito = { status: 'Dead', ...personaje };
console.log('10.', sobrescrito.status);

// 9. Es una copia superficial: lo anidado se comparte
console.log('11.', conFavorito === personaje);
console.log('12.', conFavorito.origin === personaje.origin);

// 10. Spread en arreglos
const equipoNuevo = [...equipo, 'Beth'];
console.log('13.', equipo.length, equipoNuevo.length);
```

> 🔮 **Predice antes de ejecutar:** ¿qué imprimen las líneas `9.`, `10.`, `11.` y `12.`?

**Resultado esperado en consola:**
```text
0. Rick Sanchez Alive
1. Rick Sanchez Alive
2. Human
3. Earth (C-137)
4. Sin dato
5. Rick Morty
6. Rick 3
7. Rick Sanchez está Alive
8. true
9. Alive Dead
10. Alive
11. false
12. true
13. 4 5
```

**Qué significa:**
- `9.` y `11.`: el original **no cambió** y la copia es **otro objeto** (`false`).
- `10.`: como `...personaje` va **después**, pisa el `status: 'Dead'` anterior.
- `12.`: la copia es superficial; `origin` es **el mismo** objeto en ambos.

---

### Bloque B · Módulos: separar datos de lógica (min 20–31)

**Paso 1 · Los datos en su propio archivo.** Escribe `js/datos.js`:

```js
// js/datos.js — Datos de prueba "quemados": simulan lo que luego dará la API
export const personajesPrueba = [
  { id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human',
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    origin: { name: 'Earth (C-137)' } },
  { id: 2, name: 'Morty Smith', status: 'Alive', species: 'Human',
    image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
    origin: { name: 'Earth (C-137)' } },
  { id: 7, name: 'Abradolf Lincler', status: 'unknown', species: 'Human',
    image: 'https://rickandmortyapi.com/api/character/avatar/7.jpeg',
    origin: { name: 'Earth (Replacement Dimension)' } },
  { id: 8, name: 'Adjudicator Rick', status: 'Dead', species: 'Human',
    image: 'https://rickandmortyapi.com/api/character/avatar/8.jpeg',
    origin: { name: 'Citadel of Ricks' } }
];
```

**Paso 2 · La configuración con `export default`.** Escribe `js/config.js`:

```js
// js/config.js — Un único valor principal por archivo: export default
const CONFIG = {
  urlApi: 'https://rickandmortyapi.com/api/character'
};

export default CONFIG;
```

**Paso 3 · Importarlos en `js/main.js`** (reemplaza todo el contenido):

```js
// js/main.js
import { personajesPrueba } from './datos.js';   // nombrada: entre llaves
import CONFIG from './config.js';                // por defecto: sin llaves

console.log('Personajes importados:', personajesPrueba.length);
console.log('URL de la API:', CONFIG.urlApi);
```

**Resultado esperado en consola:**
```text
Personajes importados: 4
URL de la API: https://rickandmortyapi.com/api/character
```

> 🔮 **Experimentos de 1 minuto (luego deshaz cada cambio):**
> 1. Quita `type="module"` del `<script>` de `index.html`. ¿Qué error aparece?
> 2. Escribe `from './datos'` sin `.js`. ¿Qué pasa?
> 3. Cambia `{ personajesPrueba }` por `{ personajes }`. ¿Qué error aparece?
>
> Los síntomas están en la tabla de la sección 6.

**Commit 1:**
```bash
git add .
git commit -m "feat: datos y configuracion como modulos es"
```

---

### Bloque C · Métodos de arreglos (min 31–55)

**Paso 1 · Los cinco métodos, uno por uno (consola).** Reemplaza `js/main.js`:

```js
// js/main.js — Laboratorio: métodos de arreglos (solo consola)
import { personajesPrueba } from './datos.js';

// forEach: recorre y ejecuta algo por elemento. No devuelve nada nuevo.
personajesPrueba.forEach((personaje) => {
  console.log(`#${personaje.id} ${personaje.name}`);
});

// map: transforma CADA elemento → arreglo nuevo del mismo largo
const nombres = personajesPrueba.map((personaje) => personaje.name);
console.log('map:', nombres);

// filter: se queda con los que cumplen la condición
const vivos = personajesPrueba.filter((personaje) => personaje.status === 'Alive');
console.log('filter (vivos):', vivos.length);

// find: devuelve el PRIMERO que cumple (o undefined si ninguno)
const morty = personajesPrueba.find((personaje) => personaje.id === 2);
const nadie = personajesPrueba.find((personaje) => personaje.id === 99);
console.log('find:', morty.name, '|', nadie);

// some: ¿al menos uno cumple? → true / false
const hayMuertos = personajesPrueba.some((personaje) => personaje.status === 'Dead');
console.log('some:', hayMuertos);

// Encadenamiento: filter y luego map
const nombresVivos = personajesPrueba
  .filter((personaje) => personaje.status === 'Alive')
  .map((personaje) => personaje.name);
console.log('encadenado:', nombresVivos);
```

> 🔮 **Predice:** ¿cuántos elementos tiene `nombres`? ¿Y `vivos`? ¿Qué imprime `find` cuando el id no existe?

**Resultado esperado:** primero cuatro líneas `#1 Rick Sanchez`, `#2 Morty Smith`, `#7 Abradolf Lincler` y `#8 Adjudicator Rick`; luego `filter (vivos): 2`, `find: Morty Smith | undefined`, `some: true`, y en `map:` y `encadenado:` los arreglos de nombres.

**Paso 2 · `map` para fabricar HTML (y por qué existe `.join`).** Agrega al final:

```js
const items = personajesPrueba.map((personaje) => `<li>${personaje.name}</li>`);

console.log(String(items));   // un arreglo convertido a texto: ¡trae comas!
console.log(items.join(''));  // unido sin separador: HTML limpio
```

**Paso 3 · Actualizar un solo elemento sin mutar (`map` + spread).** Agrega:

```js
const marcarVisto = (lista, id) => {
  return lista.map((personaje) => {
    if (personaje.id === id) {
      return { ...personaje, visto: true };   // copia con el cambio
    }
    return personaje;                          // los demás pasan igual
  });
};

const conVisto = marcarVisto(personajesPrueba, 2);
console.log('original:', personajesPrueba[1].visto);   // undefined
console.log('nuevo:', conVisto[1].visto);              // true
console.log('¿misma lista?', conVisto === personajesPrueba);   // false
```

**Paso 4 · Mismo código, ahora en un módulo.** Las funciones que sirven para toda la app van en `js/procesadores.js`. Escríbelo con **desestructuración en los parámetros**:

```js
// js/procesadores.js — Funciones puras: reciben datos y devuelven datos.
// Regla: aquí NO se toca el DOM.

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
```

**Paso 5 · Probarlo desde `main.js`** (reemplaza su contenido):

```js
// js/main.js
import { personajesPrueba } from './datos.js';
import {
  filtrarPorEstado,
  filtrarPorNombre,
  buscarPorId,
  existeConEstado
} from './procesadores.js';

console.log('Vivos:', filtrarPorEstado(personajesPrueba, 'Alive').length);
console.log('Todos:', filtrarPorEstado(personajesPrueba, 'todos').length);
console.log('Con "rick":', filtrarPorNombre(personajesPrueba, 'rick').length);
console.log('Id 2:', buscarPorId(personajesPrueba, 2).name);
console.log('Id "7" (texto):', buscarPorId(personajesPrueba, '7').name);
console.log('¿Hay Dead?', existeConEstado(personajesPrueba, 'Dead'));
```

**Resultado esperado en consola:**
```text
Vivos: 2
Todos: 4
Con "rick": 2
Id 2: Morty Smith
Id "7" (texto): Abradolf Lincler
¿Hay Dead? true
```

---

### ⏸ Descanso (min 55–65)

10 minutos. Ya tienes datos, configuración y funciones de procesamiento en módulos separados. Después del descanso los conectamos con internet.

---

### Bloque D · Asincronía: promesas, `async/await` y `fetch` (min 65–80)

**Paso 1 · Un servidor simulado (sin internet todavía).** Primero entendemos la lógica con un "servidor" falso que tarda un poco. Reemplaza `js/main.js`:

```js
// js/main.js — Laboratorio: asincronía con un servidor simulado

// esperar(ms) devuelve una promesa que se cumple pasados "ms" milisegundos
const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 1. El orden de ejecución NO es el orden en que lees el código
console.log('1. Pido los datos...');
esperar(1500).then(() => console.log('3. ¡Llegaron los datos!'));
console.log('2. Mientras tanto, sigo trabajando');
```

> 🔮 **Predice:** ¿en qué orden saldrán los números `1`, `2` y `3`?

**Resultado esperado:** `1. Pido los datos...`, luego `2. Mientras tanto, sigo trabajando` y, un segundo y medio después, `3. ¡Llegaron los datos!`. La página **no se congeló** esperando.

**Paso 2 · El mismo ejemplo con `async/await` y errores.** Reemplaza el contenido de `js/main.js`:

```js
// js/main.js — Servidor simulado con éxito o fallo
const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Si "falla" es true, la promesa se rechaza (throw dentro de async)
const simularServidor = async (falla) => {
  await esperar(1000);
  if (falla) {
    throw new Error('El servidor no respondió');
  }
  return ['Rick', 'Morty'];
};

const probar = async (falla) => {
  try {
    console.log('Cargando...');
    const datos = await simularServidor(falla);
    console.log('Datos recibidos:', datos);
  } catch (error) {
    console.log('Error:', error.message);
  } finally {
    console.log('Fin de la petición (finally corre SIEMPRE)');
  }
};

probar(false);
```

Ejecuta primero con `probar(false)` y luego cambia a `probar(true)`.

**Resultado esperado:**
- Con `false`: `Cargando...`, `Datos recibidos: ['Rick', 'Morty']` y `Fin de la petición ...`.
- Con `true`: `Cargando...`, `Error: El servidor no respondió` y `Fin de la petición ...`.

**Paso 3 · El fallo de olvidar el `await` con `fetch` real.** Reemplaza `js/main.js` **temporalmente**:

```js
// INTENTO ERRÓNEO: sin await
const respuesta = fetch('https://rickandmortyapi.com/api/character');
console.log('Respuesta directa de fetch:', respuesta);

const datos = respuesta.json();
console.log('Datos:', datos);
```

> 🔮 **Predice:** ¿verás la lista de personajes?

**Resultado en consola:** `Promise {<pending>}` y luego un error en rojo: `TypeError: respuesta.json is not a function`. `fetch` no entrega los datos al instante: entrega un **ticket** (una promesa).

**Paso 4 · El servicio de red.** Escribe `js/api.js`:

```js
// js/api.js — Servicio de red: solo habla con el servidor
import CONFIG from './config.js';

export const obtenerPersonajes = async () => {
  try {
    // 1. await pausa ESTA función hasta que el servidor responda
    const respuesta = await fetch(CONFIG.urlApi);

    // 2. fetch solo falla por red caída: un 404 o 500 se revisa a mano
    if (!respuesta.ok) {
      throw new Error(
        `El servidor respondió con error (código ${respuesta.status})`
      );
    }

    // 3. .json() convierte el texto JSON en un objeto (también es async)
    const datos = await respuesta.json();

    // 4. Desestructuramos: solo nos interesa el arreglo "results"
    const { results } = datos;
    return results;
  } catch (error) {
    console.error('Error en obtenerPersonajes:', error.message);
    throw error;   // se relanza para que main.js muestre el error
  }
};
```

**Commit 2:**
```bash
git add .
git commit -m "feat: servicio de red con fetch, async/await y manejo de errores"
```

---

### Bloque E · La API sin formato (min 80–88)

Antes de dibujar tarjetas, hay que **ver qué llega**. Reemplaza `js/main.js`:

```js
// js/main.js — Ver los datos reales SIN formato
import { obtenerPersonajes } from './api.js';

const salida = document.getElementById('salida-simple');

const mostrarSinFormato = async () => {
  const personajes = await obtenerPersonajes();

  // 1. Mira la estructura real en la consola
  console.log('Cantidad recibida:', personajes.length);
  console.log('Primer personaje:', personajes[0]);

  // 2. Un solo dato dentro de un párrafo
  const { name, status } = personajes[0];
  salida.innerHTML = `<p>${name} está ${status}</p>`;
};

mostrarSinFormato();
```

**Resultado esperado:** en la consola aparecen `Cantidad recibida: 20` y el objeto del primer personaje (abre sus propiedades: `name`, `status`, `species`, `image`, `origin`, `episode`...). En pantalla: un párrafo con `Rick Sanchez está Alive`.

**Ahora los 20 nombres.** Reemplaza, **dentro de la función**, el bloque `// 2.` por este:

```js
  // 2. Todos los nombres, separados por saltos de línea
  const nombres = personajes.map(({ name }) => name);
  salida.innerHTML = `<p>${nombres.join('<br>')}</p>`;
```

**Y ahora un párrafo por personaje, con varios datos.** Cambia el bloque `// 2.` por:

```js
  // 2. Un párrafo por personaje: nombre · estado · especie
  const parrafos = personajes.map(({ name, status, species }) =>
    `<p>${name} · ${status} · ${species}</p>`
  );
  salida.innerHTML = parrafos.join('');
```

> 💡 Este paso es solo para **ver** los datos. En las tarjetas finales usaremos `escaparHTML`, como indica la sección 4.8.

---

### Bloque F · Mini-proyecto: tarjetas, estados y filtros (min 88–105)

Ahora unimos todo. Primero completamos `js/procesadores.js` con la parte visual.

**Paso 1 · La tarjeta (agrega al INICIO de `js/procesadores.js`):**

```js
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
  .map(({ id, name, status, species, image, origin }) => `
    <div class="col" data-id="${id}">
      <div class="card h-100 bg-secondary bg-opacity-25 border-secondary">
        <img src="${escaparHTML(image)}" class="card-img-top"
             alt="${escaparHTML(name)}" loading="lazy">
        <div class="card-body d-flex flex-column">
          <h2 class="h5 card-title mb-1">${escaparHTML(name)}</h2>
          <div class="mb-2">
            <span class="badge ${claseEstado(status)}">
              ${escaparHTML(status)}
            </span>
            <span class="badge bg-dark border border-secondary">
              ${escaparHTML(species)}
            </span>
          </div>
          <p class="card-text text-secondary small mt-auto mb-0">
            <strong>Origen:</strong> ${escaparHTML(origin.name)}
          </p>
        </div>
      </div>
    </div>
  `)
  .join('');
```

**Paso 2 · El coordinador con los tres estados.** Reemplaza `js/main.js`:

```js
// js/main.js — Coordinador: único archivo que toca el DOM
import { obtenerPersonajes } from './api.js';
import {
  transformarEnTarjetas,
  filtrarPorEstado,
  buscarPorId
} from './procesadores.js';

// Estado en memoria: los datos recibidos de la API
let personajesGlobales = [];

// Referencias al DOM
const contenedor = document.getElementById('contenedor-tarjetas');
const spinner = document.getElementById('loading');
const alertaError = document.getElementById('alerta-error');
const textoError = document.getElementById('error-mensaje');
const btnCargar = document.getElementById('btn-cargar');
const selectEstado = document.getElementById('select-estado');
const inputBusqueda = document.getElementById('input-busqueda');

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

// Orquesta la carga: pide datos, guarda en memoria y pinta
const cargarApp = async () => {
  alternarCarga(true);
  try {
    personajesGlobales = await obtenerPersonajes();
    pintarPersonajes(personajesGlobales);
  } catch (error) {
    mostrarError(error.message);
  } finally {
    // finally corre SIEMPRE: apaga el spinner con éxito o con fallo
    alternarCarga(false);
  }
};

btnCargar.addEventListener('click', cargarApp);
cargarApp();
```

**Resultado esperado:** un instante de spinner y luego **20 tarjetas** con imagen, estado, especie y origen.

**Paso 3 · Filtro por estado (agrega al final de `main.js`):**

```js
// Filtro por estado, trabajando sobre los datos en memoria
selectEstado.addEventListener('change', () => {
  const filtrados = filtrarPorEstado(personajesGlobales, selectEstado.value);
  pintarPersonajes(filtrados);
});
```

**Resultado esperado:** al elegir "Muertos (Dead)" quedan solo los muertos, sin recargar la página. Si eliges un estado sin coincidencias, aparece el mensaje "No se encontraron personajes".

**Paso 4 · Clic en una tarjeta con `.find` (delegación de eventos).** Agrega al final de `main.js`:

```js
// Un solo listener en el contenedor (las tarjetas se crean con JavaScript)
contenedor.addEventListener('click', (evento) => {
  const tarjeta = evento.target.closest('[data-id]');
  if (!tarjeta) {
    return;
  }

  const personaje = buscarPorId(personajesGlobales, tarjeta.dataset.id);
  console.log('Personaje seleccionado:', personaje);
});
```

**Resultado esperado:** al hacer clic en cualquier tarjeta, la consola muestra el objeto completo de ese personaje.

> 🧠 Fíjate en el reparto de responsabilidades: `procesadores.js` **piensa** (funciones puras), `api.js` **habla con internet** y `main.js` **muestra y coordina**. Esa separación es la que mantiene ordenado un proyecto grande.

**Commit 3:**
```bash
git add .
git commit -m "feat: tarjetas, estados de carga y error, filtro y seleccion"
```

---

### Código completo de referencia

**`js/procesadores.js`:**

```js
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
  .map(({ id, name, status, species, image, origin }) => `
    <div class="col" data-id="${id}">
      <div class="card h-100 bg-secondary bg-opacity-25 border-secondary">
        <img src="${escaparHTML(image)}" class="card-img-top"
             alt="${escaparHTML(name)}" loading="lazy">
        <div class="card-body d-flex flex-column">
          <h2 class="h5 card-title mb-1">${escaparHTML(name)}</h2>
          <div class="mb-2">
            <span class="badge ${claseEstado(status)}">
              ${escaparHTML(status)}
            </span>
            <span class="badge bg-dark border border-secondary">
              ${escaparHTML(species)}
            </span>
          </div>
          <p class="card-text text-secondary small mt-auto mb-0">
            <strong>Origen:</strong> ${escaparHTML(origin.name)}
          </p>
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
```

**`js/main.js`** (versión final del mini-proyecto):

```js
// js/main.js — Coordinador: único archivo que toca el DOM
import { obtenerPersonajes } from './api.js';
import {
  transformarEnTarjetas,
  filtrarPorEstado,
  buscarPorId
} from './procesadores.js';

// Estado en memoria: los datos recibidos de la API
let personajesGlobales = [];

// Referencias al DOM
const contenedor = document.getElementById('contenedor-tarjetas');
const spinner = document.getElementById('loading');
const alertaError = document.getElementById('alerta-error');
const textoError = document.getElementById('error-mensaje');
const btnCargar = document.getElementById('btn-cargar');
const selectEstado = document.getElementById('select-estado');
const inputBusqueda = document.getElementById('input-busqueda');

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

// Orquesta la carga: pide datos, guarda en memoria y pinta
const cargarApp = async () => {
  alternarCarga(true);
  try {
    personajesGlobales = await obtenerPersonajes();
    pintarPersonajes(personajesGlobales);
  } catch (error) {
    mostrarError(error.message);
  } finally {
    // finally corre SIEMPRE: apaga el spinner con éxito o con fallo
    alternarCarga(false);
  }
};

btnCargar.addEventListener('click', cargarApp);
cargarApp();

// Filtro por estado, trabajando sobre los datos en memoria
selectEstado.addEventListener('change', () => {
  const filtrados = filtrarPorEstado(personajesGlobales, selectEstado.value);
  pintarPersonajes(filtrados);
});

// Un solo listener en el contenedor (las tarjetas se crean con JavaScript)
contenedor.addEventListener('click', (evento) => {
  const tarjeta = evento.target.closest('[data-id]');
  if (!tarjeta) {
    return;
  }

  const personaje = buscarPorId(personajesGlobales, tarjeta.dataset.id);
  console.log('Personaje seleccionado:', personaje);
});
```

---

## 6. Laboratorio de errores

| Síntoma | Causa probable | Solución |
|---|---|---|
| `Cannot use import statement outside a module` | El `<script>` no tiene `type="module"` | `<script type="module" src="js/main.js"></script>` |
| `Failed to resolve module specifier "datos.js"... must start with "/", "./" or "../"` | Falta el `./` al inicio de la ruta | `from './datos.js'` |
| `404` en la consola y la app no carga | Falta la extensión: `from './datos'` | En el navegador la extensión `.js` es obligatoria |
| `The requested module './x.js' does not provide an export named 'y'` | El nombre del `import` no coincide con el `export`, o falta el `export` | Revisa mayúsculas y que la función tenga `export` |
| `Access to script ... has been blocked by CORS policy` | Abriste `index.html` con doble clic (`file://`) | Ábrelo con **Live Server** |
| `Promise {<pending>}` en consola | Olvidaste `await` | Usa `await` dentro de una función `async` |
| `respuesta.json is not a function` | `respuesta` es una promesa: faltó `await` antes de `fetch` | `const respuesta = await fetch(...)` |
| `personajes.map is not a function` | `personajes` es una promesa, no un arreglo (faltó `await`) | `const personajes = await obtenerPersonajes()` |
| `await is only valid in async functions` | Usaste `await` en una función normal | Agrega `async` a la función |
| `TypeError: Failed to fetch` | Sin internet o URL imposible | Revisa tu conexión y la URL; mira la pestaña **Network** |
| El error 404/500 no aparece en pantalla | Falta `if (!respuesta.ok)` | Valida `response.ok` y lanza un `Error` |
| El spinner no desaparece | Falta `finally` o no llamas `alternarCarga(false)` | Apágalo siempre dentro de `finally` |
| Entre las tarjetas aparecen comas | Falta `.join('')` después de `.map()` | `personajes.map(...).join('')` |
| La tarjeta muestra `undefined` | Nombre de propiedad mal escrito al desestructurar | Las propiedades son `name`, `status`, `species`, `image`, `origin` |
| `Cannot read properties of undefined (reading 'name')` | `.find()` no encontró nada y usaste el resultado sin revisar | `if (personaje) { ... }` antes de usarlo |
| Imágenes rotas o `fetch` que no responde | La URL quedó como `[https://...](https://...)` por copiar mal | Deja solo la URL simple entre comillas |
| El buscador y el selector se "pisan" entre sí | Cada uno filtra por separado sobre la lista completa | Es esperado por ahora: lo resuelve el **Reto del lunes** |

---

## 7. Buenas prácticas

- **Un archivo, una responsabilidad:** `datos.js` guarda datos, `procesadores.js` calcula, `api.js` se comunica y `main.js` coordina el DOM.
- **Funciones puras en `procesadores.js`:** reciben datos, devuelven datos nuevos y **nunca** tocan el DOM ni modifican lo que reciben.
- **Prefiere los métodos que no mutan:** `map`, `filter`, `find`, `some` y spread. Evita `.push()`, `.pop()` y `.splice()` sobre datos compartidos.
- **Revisa siempre `response.ok`** y atiende los tres estados de la pantalla: cargando, éxito y error.
- **`finally` para limpiar:** lo que debe ocurrir pase lo que pase (apagar el spinner) va ahí.
- **Escapa lo que no escribiste tú:** datos de una API o de un formulario pasan por `escaparHTML` antes de `innerHTML`.
- **Nombres de callbacks con intención:** `({ status }) => status === estado` se lee casi como una frase.
- **Commits pequeños y frecuentes:** uno por cada avance verificable.
- **Hacia React:** `map` para dibujar listas, `filter` para buscar y spread para actualizar estado son los tres patrones que más escribirás.

---

## 8. Retos

Todo el proyecto terminado, con los cuatro retos, es una **actividad evaluada**. El **miércoles 4 de noviembre a las 6:00 p. m.** arrancamos con React, y antes de comenzar tu instructor verificará que hayas terminado.

> 🗓️ **Plan de estudio sin saturación.** El lunes 2 de noviembre es feriado (Día de los Difuntos), así que tienes varios días para avanzar a tu propio ritmo.

| Día | Reto | Tema que practicas | Tiempo estimado |
|---|---|---|---|
| **Hoy (en clase)** | Reto Normal: buscador por nombre | Evento `input`, módulos | 10 a 12 min |
| **Sábado 31 Oct** | Reto 1: Favoritos ⭐ | Spread en objetos, `map`, delegación | 40 min |
| **Lunes 2 Nov** | Reto 2: Filtros combinados | `filter` encadenado, `some` | 40 min |
| **Martes 3 Nov** | Reto 3: Páginas y errores | `async/await`, `fetch`, `try/catch` | 45 min |
| **Miércoles 4 Nov** (mañana) | Reto 4: Ficha con modal | `.find`, desestructuración con defaults | 40 min |

Cada reto **suma a tu mismo proyecto** `rick-morty-finder` y trae su propia **caja de herramientas** con todo lo que necesitas. Haz **un commit por reto**.

---

### 🟢 Reto Normal (en clase · 10 a 12 min): Buscador por nombre en tiempo real 🔍

Conecta el campo `#input-busqueda` para que filtre las tarjetas **mientras el usuario escribe**, usando `filtrarPorNombre` de `procesadores.js`.

**Flujo:** `evento input` ➔ `leer el texto` ➔ `filtrarPorNombre` ➔ `pintarPersonajes`

**Plantilla (en `js/main.js`, ya tienes la referencia `inputBusqueda`):**

```js
// 1. Agrega filtrarPorNombre a la lista de imports de ./procesadores.js

const manejarBusqueda = (evento) => {
  // a) Capturar el texto escrito
  // b) Filtrar personajesGlobales con filtrarPorNombre
  // c) Pintar el resultado con pintarPersonajes
};

// inputBusqueda.addEventListener('input', manejarBusqueda);
```

<details>
<summary>Pistas (de menor a mayor ayuda)</summary>

1. El texto actual está en `evento.target.value`.
2. `const filtrados = filtrarPorNombre(personajesGlobales, evento.target.value);`
3. Termina con `pintarPersonajes(filtrados);` y descomenta el `addEventListener`.
</details>

**Resultado esperado:** al escribir `rick` quedan solo los personajes cuyo nombre contiene "rick". Al borrar el texto, vuelven todos. *(Si cambias el selector de estado, el buscador "se olvida": es normal; lo resuelve el Reto 2.)*

---

### 🟡 Reto 1 · Sábado 31 Oct: Favoritos ⭐

**Consigna:** cada tarjeta tiene un botón que marca o desmarca el personaje como favorito. El botón muestra `☆ Marcar` o `⭐ Favorito`, y arriba de las tarjetas aparece un contador **"⭐ Favoritos: N"**. Los datos **nunca se mutan**: cada clic crea un arreglo nuevo.

**Flujo:** `clic en el botón` ➔ `closest()` + `dataset.id` ➔ `alternarFavorito` (crea lista nueva) ➔ `repintar` ➔ `actualizar contador`

**🧰 Caja de herramientas:**

1. **Botón dentro de la tarjeta.** En `transformarEnTarjetas`, desestructura `favorito` **con valor por defecto** y agrega el botón dentro del `card-body`:

```js
// En los parámetros: ({ id, name, status, species, image, origin, favorito = false })
```
```html
<button class="btn btn-sm btn-outline-warning btn-favorito mt-2">
  ${favorito ? '⭐ Favorito' : '☆ Marcar'}
</button>
```

2. **Actualizar un elemento sin mutar:** es el patrón de `marcarVisto` del Bloque C (`map` + `{ ...personaje, campo: valor }`). Aquí en vez de `true` fijo, **invierte** el valor actual con `!personaje.favorito`.

3. **Detectar el botón con delegación** (como en el Bloque F, pero buscando el botón):

```js
const boton = evento.target.closest('.btn-favorito');
if (!boton) {
  return;
}
const id = boton.closest('[data-id]').dataset.id;
```

**Firmas a completar:**

```js
// En js/procesadores.js
export const alternarFavorito = (personajes, id) => {
  // map + spread: devuelve una lista NUEVA con ese personaje invertido
};

export const contarFavoritos = (personajes) => {
  // filter + length
};
```

```html
<!-- En index.html, justo encima de las tarjetas -->
<p id="contador-favoritos" class="text-warning fw-bold">⭐ Favoritos: 0</p>
```

<details>
<summary>Pistas (de menor a mayor ayuda)</summary>

1. En `alternarFavorito`, compara con `personaje.id === Number(id)` (el `id` llega como texto).
2. Dentro del `if`: `return { ...personaje, favorito: !personaje.favorito };`. Fuera: `return personaje;`.
3. En `main.js`: `personajesGlobales = alternarFavorito(personajesGlobales, id);` y luego `pintarPersonajes(personajesGlobales)`.
4. `contarFavoritos` es `personajes.filter(({ favorito }) => favorito).length`. Actualiza el contador con `textContent`.
5. Comprobación de inmutabilidad: guarda `const anterior = personajesGlobales;` antes de alternar y verifica en consola que `anterior !== personajesGlobales`.
</details>

**Resultado esperado:** al hacer clic en `☆ Marcar` pasa a `⭐ Favorito` y el contador sube. Un segundo clic lo revierte. Por ahora, tras marcar, se repinta la lista completa (el Reto 2 hará que respete los filtros).

---

### 🟠 Reto 2 · Lunes 2 Nov: Filtros combinados y aviso inteligente 🎛️

**Problema actual:** si eliges "Dead" y luego escribes en el buscador, un filtro **pisa** al otro.

**Consigna:**
1. Una sola función `filtrarPersonajesCombinado(lista, texto, estado)` que respete **ambos** criterios a la vez, **encadenando dos `.filter()`**.
2. Una sola función en `main.js`, `ejecutarFiltros()`, conectada al `input` **y** al `change` del selector (borra los dos listeners anteriores).
3. Un texto **"Mostrando X de Y"** con la cantidad filtrada y la total.
4. Un **aviso con `.some()`**: si el estado elegido no existe en ningún personaje de la lista cargada, muestra un mensaje en ese lugar (por ejemplo, *"En esta lista no hay personajes con estado Dead"*).
5. Haz que tu botón ⭐ del Reto 1 llame a `ejecutarFiltros()` en vez de repintar todo, para no perder el filtro.

**Flujo:** `leer input + select` ➔ `filtrarPersonajesCombinado` ➔ `pintarPersonajes` ➔ `actualizar "Mostrando X de Y"` ➔ `.some()` para el aviso

**🧰 Caja de herramientas:**

```js
// Encadenar dos filtros: el segundo trabaja sobre el resultado del primero
lista
  .filter(({ name }) => name.toLowerCase().includes(termino))
  .filter(({ status }) => estado === 'todos' || status === estado);
```

```js
// En js/procesadores.js
export const filtrarPersonajesCombinado = (lista, texto, estado) => {
  // 1. normaliza el texto: toLowerCase().trim()
  // 2. encadena los dos filter
};
```

```html
<!-- En index.html, junto al contador de favoritos -->
<p id="resumen" class="text-secondary small mb-1"></p>
```

<details>
<summary>Pistas (de menor a mayor ayuda)</summary>

1. `ejecutarFiltros` lee `inputBusqueda.value` y `selectEstado.value`, y se los pasa a la función combinada.
2. `existeConEstado` (ya la tienes) responde si hay **algún** personaje con ese estado en `personajesGlobales`.
3. Solo muestra el aviso si el estado elegido **no es** `'todos'` y `existeConEstado` devuelve `false`.
4. Para el resumen: `` `Mostrando ${filtrados.length} de ${personajesGlobales.length}` ``.
</details>

**Resultado esperado:** con "Alive" y el texto `rick` ves solo los vivos cuyo nombre incluye "rick". El resumen se actualiza en cada tecla. Marcar un ⭐ no te saca del filtro.

---

### 🔴 Reto 3 · Martes 3 Nov: Páginas y errores bajo control 🛰️

**Consigna:**
1. Agrega los botones **"← Anterior"** y **"Siguiente →"** con el texto **"Página X de Y"**.
2. Desactiva "Anterior" en la primera página y "Siguiente" en la última.
3. Muestra **mensajes de error claros**: uno para "sin conexión" y otro para "error del servidor", cada uno con un botón **"Reintentar"**.
4. Provoca los errores a propósito y comprueba que tu pantalla los muestra bien.

**Flujo:** `clic en Siguiente` ➔ `obtenerPersonajes(pagina)` ➔ `await fetch` ➔ `{ info, results }` ➔ `pintar` + `actualizar "Página X de Y"` (o `mostrarError` + `Reintentar`)

**🧰 Caja de herramientas:**

1. **La API trabaja por páginas.** Cada respuesta trae dos partes:

```json
{
  "info": { "count": 826, "pages": 42, "next": "...?page=2", "prev": null },
  "results": [ { "id": 1, "name": "Rick Sanchez" } ]
}
```

2. **Pedir una página concreta:** agrega el número en la URL:

```js
const respuesta = await fetch(`${CONFIG.urlApi}?page=${pagina}`);
```

3. **Cambios en `api.js`:** haz que la función reciba `pagina = 1` (valor por defecto) y devuelva **`datos` completo** (con `info` y `results`) en vez de solo `results`. Desestructúralo en `main.js`:

```js
const { info, results } = await obtenerPersonajes(paginaActual);
```

4. **Desactivar un botón:** `btnSiguiente.disabled = true;` (y `false` para activarlo).

5. **Mensajes por tipo de error:**

```js
const mensajeAmigable = (error) => {
  if (error.message.includes('Failed to fetch')) {
    return 'Sin conexión: revisa tu internet e inténtalo de nuevo.';
  }
  return error.message;   // ya viene claro desde api.js (código HTTP)
};
```

6. **Cómo provocar los errores (para probar):**

| Quieres simular | Cómo |
|---|---|
| Sin conexión | DevTools → pestaña **Network** → cambia *No throttling* a **Offline** |
| Error 404 | Pide una página que no existe: `?page=9999` |

7. **Reintentar:** el botón vuelve a llamar a la función que carga la página actual.

<details>
<summary>Pistas (de menor a mayor ayuda)</summary>

1. Guarda en `main.js` dos variables: `let paginaActual = 1;` y `let totalPaginas = 1;` (este último sale de `info.pages`).
2. Haz una función `cargarPagina(pagina)` que haga todo: `alternarCarga`, `try/catch/finally`, actualizar `paginaActual` solo si **la petición tuvo éxito**.
3. Al hacer clic en "Siguiente": `cargarPagina(paginaActual + 1)`.
4. Para el botón "Reintentar": inclúyelo en el HTML de la alerta de error y reutiliza la delegación de eventos.
5. Si olvidas `finally`, el spinner se quedará girando tras un error.
</details>

**Resultado esperado:** navegas entre páginas con el contador correcto; los botones se desactivan en los extremos; en modo Offline ves el mensaje de "sin conexión" con "Reintentar", y al volver a conectar y reintentar la página carga.

---

### 🟣 Reto 4 · Miércoles 4 Nov (mañana): Ficha técnica con modal 🪐

**Consigna:** cada tarjeta tiene un botón **"Ver ficha"** que abre un modal de Bootstrap con la imagen, el nombre, el estado, la especie, el origen, el **género** y la **cantidad de episodios** del personaje, localizado con `.find()`.

**Flujo:** `clic en Ver ficha` ➔ `closest` + `dataset.id` ➔ `buscarPorId` (find) ➔ `desestructurar con defaults` ➔ `inyectar en el modal` ➔ `mostrar modal`

**🧰 Caja de herramientas:**

1. **El HTML del modal** (en `index.html`, antes del `<script type="module">`), junto con el JavaScript de Bootstrap:

```html
<div class="modal fade" id="modal-detalle" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content bg-dark text-light border-secondary">
      <div class="modal-header border-secondary">
        <h3 class="modal-title h5" id="modal-nombre"></h3>
        <button type="button" class="btn-close btn-close-white"
                data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body" id="modal-cuerpo"></div>
    </div>
  </div>
</div>

<script
  src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js">
</script>
```

2. **El botón dentro de la tarjeta** (en `transformarEnTarjetas`):

```html
<button class="btn btn-sm btn-outline-info btn-detalle mt-2">Ver ficha</button>
```

3. **Abrir el modal desde JavaScript:**

```js
const modal = bootstrap.Modal.getOrCreateInstance(
  document.getElementById('modal-detalle')
);
modal.show();
```

4. **Desestructurar con valores por defecto** (los datos reales traen `gender` y `episode`; los de prueba no):

```js
const { name, image, gender = 'Sin dato', episode = [] } = personaje;
// episode.length → cantidad de episodios
```

5. **Si `.find()` no encuentra nada** devuelve `undefined`: revisa con `if (!personaje) { return; }`.

<details>
<summary>Pistas (de menor a mayor ayuda)</summary>

1. Reutiliza la delegación: `evento.target.closest('.btn-detalle')` y luego `boton.closest('[data-id]').dataset.id`.
2. Llena `#modal-nombre` con `textContent` y `#modal-cuerpo` con `innerHTML` (pasando cada dato por `escaparHTML`).
3. Importa `escaparHTML` desde `./procesadores.js` en `main.js`.
4. Si el Reto 1 y el Reto 4 comparten el listener del contenedor, decide primero qué botón fue (`.btn-favorito` o `.btn-detalle`) y actúa en consecuencia.
</details>

**Resultado esperado:** al pulsar "Ver ficha" se abre el modal con los datos correctos; al cerrarlo y abrir otro personaje, muestra los de ese personaje.

---

### ✅ Checklist de entrega (verificación del miércoles, 6:00 p. m.)

Antes de comenzar la clase de React, tu instructor comprobará estos puntos en tu proyecto:

| ✔ | Qué se revisa |
|---|---|
| ☐ | La app carga 20 personajes reales, con spinner y manejo de error |
| ☐ | Estructura modular: `datos`, `config`, `procesadores`, `api` y `main` (sin lógica del DOM en `procesadores.js`) |
| ☐ | **Buscador** por nombre en vivo |
| ☐ | **Favoritos** con contador, sin mutar los datos |
| ☐ | **Filtros combinados**, "Mostrando X de Y" y aviso con `.some()` |
| ☐ | **Paginación**, botones desactivados en los extremos y errores con "Reintentar" |
| ☐ | **Modal** con la ficha del personaje usando `.find()` |
| ☐ | La consola no muestra errores en rojo |
| ☐ | Al menos **un commit por reto** y el proyecto subido a GitHub (`git push`) |

---

## 9. Ticket de salida (autoevaluación)

Respóndete estas 3 preguntas. Si dudas en alguna, anótala para resolverla al inicio de la próxima clase:

1. ¿Por qué `fetch` no salta al bloque `catch` cuando el servidor responde con un 404 o un 500, y cómo lo detectas?
2. ¿Por qué `{ ...personaje, favorito: true }` no modifica el objeto `personaje` original, y qué significa que sea una copia *superficial*?
3. ¿En qué se diferencia `.find()` de `.filter()`, y cuál devuelve `undefined` cuando no hay coincidencias?

**Antes de cerrar la sesión:**

```bash
git add .
git commit -m "feat: clase 12 completada con modulos, metodos de arreglos y fetch"
git push
```

**Adelanto:** el miércoles damos el salto a **React con Vite**. Todo lo de hoy es su base: componentes que son **funciones**, listas dibujadas con `map`, datos que llegan con `fetch`, archivos que se conectan con `import` / `export` y estado que se actualiza **sin mutar**, con spread.

---

## 10. Autoestudio (30 a 45 min, opcional)

1. **Mecánico 1:** escribe desde cero una función `async` que consuma `https://rickandmortyapi.com/api/character/1`, valide `response.ok` y desestructure `{ name, status, species }`.
2. **Mecánico 2:** dado `[{ nombre, precio, stock }]`, usa `.filter()` para quedarte con los que tienen stock y encadena un `.map()` que devuelva textos con el formato `"[nombre] vale $[precio]"`.
3. **Mecánico 3:** escribe un módulo `utilidades.js` con dos exportaciones nombradas y una `export default`, e impórtalas en otro archivo usando un alias.
4. **Mecánico 4:** con la API, prueba `https://rickandmortyapi.com/api/character/?name=morty` y muestra los resultados sin formato.

---

## 11. Recursos oficiales

- MDN: [Desestructuración](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
- MDN: [Sintaxis Spread](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
- MDN: [Módulos en JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Modules)
- MDN: [Array.prototype.map()](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- MDN: [Array.prototype.filter()](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- MDN: [Array.prototype.find()](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
- MDN: [Promise](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- MDN: [Funciones asíncronas (`async/await`)](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/async_function)
- MDN: [Uso de Fetch API](https://developer.mozilla.org/es/docs/Web/API/Fetch_API/Using_Fetch)
- Bootstrap: [Componente Modal 5.3](https://getbootstrap.com/docs/5.3/components/modal/)
- Documentación de la API: [rickandmortyapi.com](https://rickandmortyapi.com/documentation)
