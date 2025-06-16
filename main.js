import { crearBasura, iniciarTemporizador } from "./componentes/basura/basura.js";

export function cargarDOM() {
  const DOM = document.querySelector("#root");
  DOM.innerHTML = "";

  const tituloPrincipal = document.createElement("h1");
  tituloPrincipal.className = "titulo-general";
  tituloPrincipal.textContent = "♻️ Clasifica la Basura";

  DOM.appendChild(tituloPrincipal);

  const juego = crearBasura();
  DOM.appendChild(juego);

  iniciarTemporizador();
}

cargarDOM(); // Llama al cargar la página
