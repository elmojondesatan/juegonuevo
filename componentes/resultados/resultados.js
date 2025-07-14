import { exportarResultadosCSV } from "../../helpers/exportarCSV.js";

export function mostrarResultados(datos) {
  const root = document.getElementById("root");
  root.innerHTML = "";

  const contenedor = document.createElement("div");
  contenedor.className = "resultados-container";

  const titulo = document.createElement("h2");
  titulo.textContent = "📊 Resultados Finales";

  const lista = document.createElement("ul");
  lista.className = "resultados-lista";

  // Ordenar por puntos descendente
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
