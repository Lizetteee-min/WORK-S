/* LOGO */
const LOGO = "../images/logo-works.png";
document.querySelectorAll("[data-logo]").forEach(img => img.src = LOGO); // le pone el logo a todas las imágenes marcadas con data-logo
document.getElementById("favicon").href = LOGO; // y también al iconito de la pestaña

/* AVISO DE ERROR: si algo falla, aparece un cuadro rojo con el motivo */
addEventListener("error", e => {
  const a = document.getElementById("aviso");
  a.hidden = false; // muestra el cuadro rojo
  a.textContent = `Error en la página: ${e.message} (línea ${e.lineno})`; // dice qué falló y en qué línea
});

/* ATAJOS */
const $ = id => document.getElementById(id); // atajo para buscar un elemento por su id
const mostrar = x => ["landing", "login", "app"].forEach(i => $(i).hidden = i !== x); // muestra una pantalla y esconde las otras dos

/* CUENTAS DE PRUEBA (el sistema detecta el rol por la cuenta) */
const USUARIOS = [
  {correo:"admin@works.com",      clave:"123456", rol:"administrador", nombre:"Theodoro Carrion"},
  {correo:"supervisor@works.com", clave:"123456", rol:"supervisor",    nombre:"Luis Ramírez"},
];
const ROLES = {administrador:"Administrador", supervisor:"Supervisor"}; // para escribir el rol bonito con mayúscula

/* DATOS DE MUESTRA (fijos, solo para presentar) */
// cada fila: folio, fecha, tipo, área, descripción, gravedad, estado
const FILAS = [
  ["#0148","04/10/2026","Falla de maquinaria","Mantenimiento","Montacargas con frenos débiles","Alta","Pendiente"],
  ["#0147","03/10/2026","Riesgo","Almacén","Estantes sin anclar en pasillo 3","Alta","En revisión"],
  ["#0146","02/10/2026","Accidente","Producción","Corte leve en mano al operar prensa","Media","En revisión"],
  ["#0145","02/10/2026","Incidente","Logística","Casi colisión entre montacargas y peatón","Media","Pendiente"],
  ["#0144","30/09/2026","Riesgo","Soldadura","Falta de careta en estación 2","Baja","Atendido"],
];
// para la gráfica: área, cantidad de reportes, porcentaje de la barra
const AREAS = [["Producción",14,100],["Almacén",11,79],["Mantenimiento",10,71],["Logística",8,57],["Soldadura",5,36]];
// los tipos de reporte que se pueden elegir, con su explicación
const TIPOS = [
  ["Riesgo","Podría provocar daño"],
  ["Incidente","Pudo causar daño"],
  ["Accidente","Ocasionó lesión o daño"],
  ["Falla de maquinaria","Problema en un equipo"],
];

/* PIEZAS QUE SE REPITEN (para no escribir lo mismo mil veces) */
// etiquetita de color; le quita los espacios al nombre para que coincida con la clase del CSS
const tag = c => `<span class="tag ${c.replace(" ", "-")}">${c}</span>`;

// arma una tabla completa con las filas que le pases
const tabla = filas => `
  <div class="scroll"><table>
    <tr>${["Folio","Fecha","Tipo","Área","Descripción","Gravedad","Estado"].map(h => `<th>${h}</th>`).join("")}</tr>
    ${filas.map(([folio,fecha,tipo,area,desc,grav,estado]) => `
      <tr><td>${folio}</td><td>${fecha}</td><td>${tipo}</td><td>${area}</td><td>${desc}</td><td>${tag(grav)}</td><td>${tag(estado)}</td></tr>`).join("")}
  </table></div>`;

// título y subtítulo de cada pantalla
const cab = (titulo, sub) => `<h1 class="t">${titulo}</h1><p class="sub">${sub}</p>`;

// los cuadritos de números grandes (ej. Pendientes: 2)
const nums = lista => `<div class="nums">${lista.map(([n, v]) =>
  `<div class="card"><small>${n}</small><b>${v}</b></div>`).join("")}</div>`;

// una fila de la gráfica de barras
const barra = (area, n, pct) => `
  <div class="barra"><span>${area}</span><div class="f"><div class="r" style="width:${pct}%"></div></div><b>${n}</b></div>`;

// una tarjeta blanca con título; el estilo es opcional
const card = (titulo, contenido, estilo = "") => `<div class="card" ${estilo ? `style="${estilo}"` : ""}><h3>${titulo}</h3>${contenido}</div>`;

// un campo con su etiqueta arriba; "primero" le quita el espacio de arriba si es el primero
const campo = (etiqueta, control, primero = false) =>
  `<label class="lbl" ${primero ? 'style="margin-top:0"' : ""}>${etiqueta}</label>${control}`;

/* MENÚ Y PANTALLAS DE CADA ROL */
// los botones del menú de cada rol: [nombre interno, texto que se ve]
const MENUS = {
  supervisor:    [["inicio","Inicio"], ["nuevo","Nuevo reporte"], ["mis","Mis reportes"]],
  administrador: [["inicio","Inicio"], ["reportes","Reportes"], ["stats","Estadísticas"], ["usuarios","Gestión de usuarios"]],
};

// lo que se ve en cada pantalla, separado por rol
const VISTAS = {
  supervisor: {
    // pantalla de inicio del supervisor
    inicio: () =>
      cab("Inicio", "Hola, Luis. ¿Qué quieres reportar hoy?") +
      nums([["Pendientes",2], ["En revisión",1], ["Atendidos",5]]) +
      `<button class="btn" onclick="ir('nuevo')" style="margin-bottom:14px">Nuevo reporte</button>` +
      card("Mis últimos reportes", tabla(FILAS.slice(0, 3))), // solo los primeros 3

    // formulario para crear un reporte (el botón enviar solo muestra un aviso, no guarda nada todavía)
    nuevo: () =>
      cab("Nuevo reporte", "Cuéntanos qué ocurrió.") +
      `<form onsubmit="event.preventDefault();alert('Reporte enviado (demostración)')">
        ${card("1. Tipo de reporte", `<div class="opts">${TIPOS.map(([t, d], i) =>
          `<button type="button" class="opt ${i === 0 ? "sel" : ""}" onclick="sel(this)">${t}<small>${d}</small></button>`).join("")}</div>`)}
        ${card("2. Información", `
          <div class="f2">
            <div>${campo("Área", `<select><option>Almacén</option><option>Producción</option><option>Mantenimiento</option></select>`, true)}</div>
            <div>${campo("Fecha", `<input type="date">`, true)}</div>
          </div>
          ${campo("Gravedad", `<select><option>Baja</option><option selected>Media</option><option>Alta</option></select>`)}
          ${campo("Descripción", `<textarea rows="3" placeholder="¿Qué pasó o qué encontraste?"></textarea>`)}`)}
        ${card("3. Evidencia (opcional)", `<input type="file">`)}
        <button class="btn" type="submit">Enviar reporte</button>
      </form>`,

    // todos los reportes que ha enviado
    mis: () =>
      cab("Mis reportes", "Lo que has enviado y su estado.") +
      card("Historial", tabla(FILAS)),
  },

  administrador: {
    // pantalla de inicio del admin: resumen y reportes recientes
    inicio: () =>
      cab("Inicio", "Resumen de seguridad de Cataforesis.") +
      nums([["Riesgos",21], ["Incidentes",12], ["Accidentes",6], ["Fallas de maquinaria",9]]) +
      card("Reportes recientes", tabla(FILAS.slice(0, 4))), // solo los primeros 4

    // todos los reportes de todos los supervisores
    reportes: () =>
      cab("Reportes", "Todo lo que reportan los supervisores.") +
      card("Todos los reportes", tabla(FILAS)),

    // números y gráfica de barras por área
    stats: () =>
      cab("Estadísticas", "Dónde se concentran los reportes.") +
      nums([["Total de reportes",48], ["Pendientes",9], ["Atendidos",30]]) +
      card("Reportes por área", AREAS.map(a => barra(...a)).join(""), "max-width:640px"),

    // formulario para crear usuarios + lista de los que ya existen (el botón solo muestra un aviso)
    usuarios: () =>
      cab("Gestión de usuarios", "La empresa se asigna automáticamente.") +
      `<div class="dos">
        ${card("Crear usuario", `
          <form onsubmit="event.preventDefault();alert('Usuario creado (demostración)')">
            ${campo("Nombre", `<input required>`, true)}
            ${campo("Correo electrónico", `<input type="email" required>`)}
            ${campo("Contraseña temporal", `<input required>`)}
            ${campo("Rol", `<select><option>Supervisor</option><option>Administrador</option></select>`)}
            <button class="btn full" type="submit">Crear usuario</button>
          </form>`)}
        ${card("Usuarios de la empresa", `
          <div class="scroll"><table>
            <tr><th>Nombre</th><th>Correo</th><th>Rol</th></tr>
            ${USUARIOS.map(u => `<tr><td>${u.nombre}</td><td>${u.correo}</td><td>${ROLES[u.rol]}</td></tr>`).join("")}
          </table></div>`)}
      </div>`,
  },
};

/* LOGIN: lo único que funciona de verdad */
let rol = ""; // aquí se guarda el rol del que inició sesión

function iniciarSesion(e) {
  e.preventDefault(); // evita que la página se recargue al enviar
  const correo = $("correo").value.trim().toLowerCase(); // correo sin espacios y en minúsculas
  const u = USUARIOS.find(x => x.correo === correo && x.clave === $("clave").value); // busca si hay alguien con ese correo y contraseña
  if (!u) { $("error").textContent = "Correo o contraseña incorrectos."; return; } // si no existe, avisa y se detiene

  rol = u.rol; // guarda el rol
  $("error").textContent = ""; // limpia el mensaje de error
  $("emp").textContent = "Cataforesis";
  $("usu").textContent = `${u.nombre} · ${ROLES[rol]}`; // pone "Nombre · Rol" arriba a la derecha
  $("nav").innerHTML = MENUS[rol].map(([k, nombre]) => `<button data-k="${k}" onclick="ir('${k}')">${nombre}</button>`).join(""); // arma el menú según el rol
  mostrar("app"); // entra al programa
  ir("inicio"); // y abre la pantalla de inicio
}

function cerrarSesion() {
  $("correo").value = $("clave").value = ""; // borra lo que estaba escrito
  $("menu").classList.remove("abierto"); // cierra el menú por si estaba abierto en celular
  mostrar("login"); // regresa al login
}

/* NAVEGACIÓN */
function ir(k) { // cambia de apartado
  document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("on", b.dataset.k === k)); // marca en azul el botón donde estás
  $("tit").textContent = MENUS[rol].find(m => m[0] === k)[1]; // cambia el título de arriba
  $("menu").classList.remove("abierto"); // cierra el menú en celular
  $("vista").innerHTML = VISTAS[rol][k](); // pinta la pantalla que elegiste
  scrollTo(0, 0); // sube hasta arriba
}

function sel(btn) { // marca el tipo de reporte elegido
  document.querySelectorAll(".opt").forEach(o => o.classList.remove("sel")); // les quita la marca a todos
  btn.classList.add("sel"); // y se la pone al que le diste clic
}
