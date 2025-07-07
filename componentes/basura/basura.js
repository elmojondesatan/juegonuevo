import { niveles, tipos } from "./data.js";

let basuraActual = [];
let intervaloTiempo;

export function crearBasura(jugador, pasarNivel, perderVida, finalizarJuego) {
  clearInterval(intervaloTiempo); // Resetear temporizador

  let contenedor = document.createElement("div");
  contenedor.className = "contenedor-basura";

  // Header: tiempo y vidas
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

  // Título del nivel
  const tituloNivel = document.createElement("h2");
  tituloNivel.className = "titulo-nivel";
  tituloNivel.textContent = `🧪 Nivel ${jugador.nivel}`;
  contenedor.appendChild(tituloNivel);

  // Botes de reciclaje
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

  // Zona de basura
  const contenedorBasura = document.createElement("div");
  contenedorBasura.className = "basura";
  contenedorBasura.id = "zona-basura";

  basuraActual = cargarObjetosDelNivel(jugador.nivel);
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

  // Botón Verificar
  const btn = document.createElement("button");
  btn.textContent = "✅ Verificar";
  btn.className = "verificar";
  btn.addEventListener("click", () =>
    verificarClasificacion(jugador, pasarNivel, perderVida, finalizarJuego)
  );
  contenedor.appendChild(btn);

  return contenedor;
}

function cargarObjetosDelNivel(nivelActual) {
  const data = niveles.find(n => n.nivel === nivelActual);
  return data ? data.objetos : niveles[niveles.length - 1].objetos;
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

export function iniciarTemporizador(jugador, perderVida, finalizarJuego) {
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
