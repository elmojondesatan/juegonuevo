import { crearBasura, iniciarTemporizador } from "./componentes/basura/basura.js";
import { cargarPantallaInicio } from "./componentes/inicio/inicio.js";
import { mostrarResultados } from "./componentes/resultados/resultados.js";

// Estado del jugador
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
  jugador.puntos += 10; // sumar puntos al pasar nivel
  cargarJuego();
}

function perderVida() {
  jugador.vidas--;
  jugador.puntos = Math.max(0, jugador.puntos - 5); // restar puntos sin bajar de 0
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

  // Reiniciar estado para siguiente partida
  jugador.nivel = 1;
  jugador.vidas = 3;
  jugador.tiempoTotal = 0;
  jugador.puntos = 0;

  mostrarResultados(historial);
}

function cargarDOM() {
  cargarPantallaInicio((datos) => {
    jugador.nombre = datos.nombre;
    jugador.avatar = datos.avatar;
    jugador.codigo = datos.codigo;

    intervaloGlobal = setInterval(() => {
      jugador.tiempoTotal++;
    }, 1000);

    cargarJuego();
  });
}

cargarDOM();
