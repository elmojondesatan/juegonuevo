import { niveles, tipos } from "./data.js";

let nivel = 1;
let vidas = 3;
let tiempo = 30;
let basuraActual = [];
let intervaloTiempo;

export function crearBasura() {
  clearInterval(intervaloTiempo); // Resetear temporizador

  let contenedor = document.createElement("div");
  contenedor.className = "contenedor-basura";

  // Header: tiempo y vidas
  const header = document.createElement("div");
  header.className = "estado-juego";

  const tiempoSpan = document.createElement("span");
  tiempoSpan.id = "tiempo";
  tiempoSpan.textContent = `⏱️ Tiempo: ${tiempo}s`;

  const vidasSpan = document.createElement("span");
  vidasSpan.id = "vidas";
  vidasSpan.textContent = "❤️".repeat(vidas);

  header.appendChild(tiempoSpan);
  header.appendChild(vidasSpan);
  contenedor.appendChild(header);

  // Título del nivel
  const tituloNivel = document.createElement("h2");
  tituloNivel.className = "titulo-nivel";
  tituloNivel.textContent = `🧪 Nivel ${nivel}`;
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
      basura.style.fontSize = "1.6rem"; // Disminuye tamaño al entrar al bote
    });

    contenedorBotes.appendChild(bote);
  });

  contenedor.appendChild(contenedorBotes);

  // Zona de basura
  const contenedorBasura = document.createElement("div");
  contenedorBasura.className = "basura";
  contenedorBasura.id = "zona-basura";

  basuraActual = cargarObjetosDelNivel(nivel);
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
  btn.addEventListener("click", verificarClasificacion);
  contenedor.appendChild(btn);

  return contenedor;
}

function cargarObjetosDelNivel(nivelActual) {
  const data = niveles.find(n => n.nivel === nivelActual);
  return data ? data.objetos : niveles[niveles.length - 1].objetos;
}

function verificarClasificacion() {
  // Validar que al menos haya basura en algún bote
  let algunBoteLleno = false;
  tipos.forEach(tipo => {
    const bote = document.querySelector(`.bote.${tipo}`);
    if (bote.querySelectorAll(".item-basura").length > 0) {
      algunBoteLleno = true;
    }
  });

  if (!algunBoteLleno) {
    alert("⚠️ ¡Por favor, llena los botes antes de verificar!");
    return; // No seguir con la verificación
  }

  // Verificar que la basura esté correctamente clasificada
  let correcto = true;
  tipos.forEach(tipo => {
    const bote = document.querySelector(`.bote.${tipo}`);
    const hijos = bote.querySelectorAll(".item-basura");
    hijos.forEach(b => {
      if (b.dataset.tipo !== tipo) correcto = false;
    });
  });

  if (correcto) {
    nivel++;
    reiniciarJuego(`✅ ¡Nivel ${nivel - 1} superado!`);
  } else {
    vidas--;
    actualizarVidas();
    if (vidas <= 0) {
      nivel = 1;
      vidas = 3;
      reiniciarJuego("😓 Te quedaste sin vidas. Reiniciando.");
    } else {
      reiniciarJuego("❌ Clasificación incorrecta.");
    }
  }
}

function actualizarVidas() {
  const vidasSpan = document.getElementById("vidas");
  vidasSpan.textContent = "❤️".repeat(vidas);
}

export function iniciarTemporizador() {
  let tiempoRestante = tiempo;
  const tiempoSpan = document.getElementById("tiempo");
  if (!tiempoSpan) return;

  tiempoSpan.textContent = `⏱️ Tiempo: ${tiempoRestante}s`;

  intervaloTiempo = setInterval(() => {
    tiempoRestante--;
    tiempoSpan.textContent = `⏱️ Tiempo: ${tiempoRestante}s`;

    if (tiempoRestante <= 0) {
      clearInterval(intervaloTiempo);
      vidas--;
      actualizarVidas();
      if (vidas <= 0) {
        nivel = 1;
        vidas = 3;
        reiniciarJuego("⏰ Tiempo agotado. Reiniciando juego.");
      } else {
        reiniciarJuego("⏰ Tiempo agotado. Intenta de nuevo.");
      }
    }
  }, 1000);
}

function reiniciarJuego(mensaje) {
  alert(mensaje);
  const root = document.querySelector("#root");
  root.textContent = "";

  const titulo = document.createElement("h1");
  titulo.className = "titulo-general";
  titulo.textContent = "♻️ Clasifica la Basura";
  root.appendChild(titulo);
  const juego = crearBasura();
  root.appendChild(juego);
  iniciarTemporizador();
}
