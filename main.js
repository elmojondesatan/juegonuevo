// === DATA (niveles y tipos) ===
const niveles = [
  {
    nivel: 1,
    objetos: [
      { emoji: "🧻", tipo: "papel" },
      { emoji: "🍌", tipo: "organico" },
      { emoji: "🥤", tipo: "plastico" }
    ]
  },
  {
    nivel: 2,
    objetos: [
      { emoji: "📄", tipo: "papel" },
      { emoji: "🌿", tipo: "organico" },
      { emoji: "🧴", tipo: "plastico" },
      { emoji: "🥫", tipo: "metal" }
    ]
  },
  {
    nivel: 3,
    objetos: [
      { emoji: "📦", tipo: "papel" },
      { emoji: "🍎", tipo: "organico" },
      { emoji: "🛍️", tipo: "plastico" },
      { emoji: "🍾", tipo: "vidrio" },
      { emoji: "🔩", tipo: "metal" }
    ]
  },
  {
    nivel: 4,
    objetos: [
      { emoji: "📄", tipo: "papel" },
      { emoji: "🍌", tipo: "organico" },
      { emoji: "🥤", tipo: "plastico" },
      { emoji: "🥂", tipo: "vidrio" },
      { emoji: "🛎️", tipo: "metal" },
      { emoji: "🔍", tipo: "vidrio" }
    ]
  }
];
const tipos = ["papel", "plastico", "organico", "vidrio", "metal"];

// === EXPORTAR CSV ===
function exportarResultadosCSV(datos, nombreArchivo = "resultados.csv") {
  const encabezado = Object.keys(datos[0]).join(",");
  const filas = datos.map(fila => Object.values(fila).join(","));
  const contenido = [encabezado, ...filas].join("\n");

  const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = nombreArchivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// === RESULTADOS ===
function mostrarResultados(datos) {
  const root = document.getElementById("root");
  root.innerHTML = "";

  const contenedor = document.createElement("div");
  contenedor.className = "resultados-container";

  const titulo = document.createElement("h2");
  titulo.textContent = "📊 Resultados Finales";

  const lista = document.createElement("ul");
  lista.className = "resultados-lista";

  const ordenados = [...datos].sort((a, b) => b.puntos - a.puntos);
  ordenados.forEach((jugador, index) => {
    const item = document.createElement("li");
    item.innerHTML = `🏅 Lugar #${index + 1} - ${jugador.nombre} ${jugador.avatar} - Nivel: ${jugador.nivel} - Tiempo: ${jugador.tiempo}s - ⭐ Puntos: ${jugador.puntos}`;
    lista.appendChild(item);
  });

  const botonDescargar = document.createElement("button");
  botonDescargar.textContent = "⬇️ Descargar Resultados";
  botonDescargar.className = "btn-descargar";
  botonDescargar.addEventListener("click", () => {
    exportarResultadosCSV(ordenados);
  });

  contenedor.appendChild(titulo);
  contenedor.appendChild(lista);
  contenedor.appendChild(botonDescargar);
  root.appendChild(contenedor);
}

// === JUEGO (basura) ===
let basuraActual = [];
let intervaloTiempo;

function crearBasura(jugador, pasarNivel, perderVida, finalizarJuego) {
  clearInterval(intervaloTiempo);

  let contenedor = document.createElement("div");
  contenedor.className = "contenedor-basura";

  const header = document.createElement("div");
  header.className = "estado-juego";

  const tiempoSpan = document.createElement("span");
  tiempoSpan.id = "tiempo";
  tiempoSpan.textContent = `⏱️ Tiempo: 30s`;

  const vidasSpan = document.createElement("span");
  vidasSpan.id = "vidas";
  vidasSpan.textContent = "❤️".repeat(jugador.vidas);

  header.appendChild(tiempoSpan);
  header.appendChild(vidasSpan);
  contenedor.appendChild(header);

  const tituloNivel = document.createElement("h2");
  tituloNivel.className = "titulo-nivel";
  tituloNivel.textContent = `🧪 Nivel ${jugador.nivel}`;
  contenedor.appendChild(tituloNivel);

  const contenedorBotes = document.createElement("div");
  contenedorBotes.className = "botes";

  tipos.forEach(tipo => {
    let bote = document.createElement("div");
    bote.className = `bote ${tipo}`;
    bote.dataset.tipo = tipo;
    bote.textContent = tipo.toUpperCase();

    bote.addEventListener("dragover", e => e.preventDefault());

    bote.addEventListener("drop", e => {
      const id = e.dataTransfer.getData("text");
      const basura = document.getElementById(id);
      e.target.appendChild(basura);
      basura.style.fontSize = "1.6rem";
    });

    contenedorBotes.appendChild(bote);
  });

  contenedor.appendChild(contenedorBotes);

  const contenedorBasura = document.createElement("div");
  contenedorBasura.className = "basura";
  contenedorBasura.id = "zona-basura";

  basuraActual = niveles.find(n => n.nivel === jugador.nivel)?.objetos || [];
  basuraActual.forEach((item, index) => {
    let basura = document.createElement("div");
    basura.className = "item-basura";
    basura.textContent = item.emoji;
    basura.setAttribute("draggable", "true");
    basura.dataset.tipo = item.tipo;
    basura.id = `basura-${index}`;

    basura.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text", basura.id);
    });

    contenedorBasura.appendChild(basura);
  });

  contenedor.appendChild(contenedorBasura);

  const btn = document.createElement("button");
  btn.textContent = "✅ Verificar";
  btn.className = "verificar";
  btn.addEventListener("click", () =>
    verificarClasificacion(jugador, pasarNivel, perderVida, finalizarJuego)
  );
  contenedor.appendChild(btn);

  return contenedor;
}

function verificarClasificacion(jugador, pasarNivel, perderVida, finalizarJuego) {
  let algunBoteLleno = false;
  tipos.forEach(tipo => {
    const bote = document.querySelector(`.bote.${tipo}`);
    if (bote.querySelectorAll(".item-basura").length > 0) {
      algunBoteLleno = true;
    }
  });

  if (!algunBoteLleno) {
    alert("⚠️ ¡Por favor, llena los botes antes de verificar!");
    return;
  }

  let correcto = true;
  tipos.forEach(tipo => {
    const bote = document.querySelector(`.bote.${tipo}`);
    const hijos = bote.querySelectorAll(".item-basura");
    hijos.forEach(b => {
      if (b.dataset.tipo !== tipo) correcto = false;
    });
  });

  if (correcto) {
    alert(`✅ ¡Nivel ${jugador.nivel} superado!`);
    pasarNivel();
  } else {
    jugador.vidas--;
    actualizarVidas(jugador);
    if (jugador.vidas <= 0) {
      alert("😓 Te quedaste sin vidas. Reiniciando.");
      finalizarJuego();
    } else {
      alert("❌ Clasificación incorrecta. Intenta de nuevo.");
      perderVida();
    }
  }
}

function actualizarVidas(jugador) {
  const vidasSpan = document.getElementById("vidas");
  if (vidasSpan) {
    vidasSpan.textContent = "❤️".repeat(jugador.vidas);
  }
}

function iniciarTemporizador(jugador, perderVida, finalizarJuego) {
  let tiempoRestante = 30;
  const tiempoSpan = document.getElementById("tiempo");
  if (!tiempoSpan) return;

  tiempoSpan.textContent = `⏱️ Tiempo: ${tiempoRestante}s`;

  intervaloTiempo = setInterval(() => {
    tiempoRestante--;
    tiempoSpan.textContent = `⏱️ Tiempo: ${tiempoRestante}s`;

    if (tiempoRestante <= 0) {
      clearInterval(intervaloTiempo);
      jugador.vidas--;
      actualizarVidas(jugador);
      if (jugador.vidas <= 0) {
        alert("⏰ Tiempo agotado. Reiniciando juego.");
        finalizarJuego();
      } else {
        alert("⏰ Tiempo agotado. Intenta de nuevo.");
        perderVida();
      }
    }
  }, 1000);
}

// === FLUJO PRINCIPAL ===
let jugador = {
  nombre: "",
  avatar: "",
  codigo: "",
  nivel: 1,
  vidas: 3,
  tiempoTotal: 0,
  puntos: 0
};
let historial = [];
let intervaloGlobal;


function cargarJuego() {
  const root = document.querySelector("#root");
  root.innerHTML = "";

  const tituloPrincipal = document.createElement("h1");
  tituloPrincipal.className = "titulo-general";
  tituloPrincipal.textContent = "♻️ Clasifica la Basura";

  root.appendChild(tituloPrincipal);

  const juego = crearBasura(jugador, pasarNivel, perderVida, finalizarJuego);
  root.appendChild(juego);

  iniciarTemporizador(jugador, perderVida, finalizarJuego);
}

function pasarNivel() {
  jugador.nivel++;
  jugador.puntos += 10;
  cargarJuego();
}

function perderVida() {
  jugador.vidas--;
  jugador.puntos = Math.max(0, jugador.puntos - 5);
  if (jugador.vidas <= 0) {
    finalizarJuego();
  } else {
    cargarJuego();
  }
}

function finalizarJuego() {
  clearInterval(intervaloGlobal);

  historial.push({
    nombre: jugador.nombre,
    avatar: jugador.avatar,
    codigo: jugador.codigo,
    nivel: jugador.nivel,
    tiempo: jugador.tiempoTotal,
    puntos: jugador.puntos
  });

  jugador.nivel = 1;
  jugador.vidas = 3;
  jugador.tiempoTotal = 0;
  jugador.puntos = 0;

  mostrarResultados(historial);
}

function cargarDOM() {
  // Datos por defecto ya que eliminamos la pantalla de inicio
  jugador.nombre = "Jugador";
  jugador.avatar = "🧠";
  jugador.codigo = "AUTO";

  intervaloGlobal = setInterval(() => {
    jugador.tiempoTotal++;
  }, 1000);

  cargarJuego();
}
cargarDOM();

