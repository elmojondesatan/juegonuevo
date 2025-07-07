export function exportarResultadosCSV(datos, nombreArchivo = "resultados.csv") {
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
  