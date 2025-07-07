export function cargarPantallaInicio(callback) {
    const root = document.getElementById("root");
    root.innerHTML = "";
  
    const contenedor = document.createElement("div");
    contenedor.className = "inicio-container";
  
    const titulo = document.createElement("h1");
    titulo.textContent = "🎮 Unirse a la partida";
  
    const inputNombre = document.createElement("input");
    inputNombre.placeholder = "Nombre";
    inputNombre.className = "input-nombre";
  
    const inputCodigo = document.createElement("input");
    inputCodigo.placeholder = "Código de partida";
    inputCodigo.className = "input-codigo";
  
    const avatarLabel = document.createElement("label");
    avatarLabel.textContent = "Elige tu avatar:";
  
    const selectAvatar = document.createElement("select");
    selectAvatar.className = "select-avatar";
    ["😀", "👩‍🚀", "🐱", "🦊", "🐼", "🐸"].forEach(emoji => {
      const option = document.createElement("option");
      option.value = emoji;
      option.textContent = emoji;
      selectAvatar.appendChild(option);
    });
  
    const boton = document.createElement("button");
    boton.textContent = "Ingresar";
    boton.className = "btn-ingresar";
  
    boton.addEventListener("click", () => {
      const datos = {
        nombre: inputNombre.value.trim() || "Anónimo",
        codigo: inputCodigo.value.trim(),
        avatar: selectAvatar.value
      };
      if (!datos.codigo) {
        alert("Por favor, ingresa el código de partida.");
        return;
      }
      callback(datos);
    });
  
    contenedor.appendChild(titulo);
    contenedor.appendChild(inputNombre);
    contenedor.appendChild(inputCodigo);
    contenedor.appendChild(avatarLabel);
    contenedor.appendChild(selectAvatar);
    contenedor.appendChild(boton);
  
    root.appendChild(contenedor);
  }
  