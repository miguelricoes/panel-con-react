import { useState } from "react";



export default function AdminPanel() {
  const [paginaActual, setPaginaActual] = useState("inicio");
  const [nuevoTipoPQRS, setNuevoTipoPQRS] = useState("Petición");
  const [nuevoMensajePQRS, setNuevoMensajePQRS] = useState("");
  const [fontSize, setFontSize] = useState("16px"); // Tamaño base
  const [diasReservados, setDiasReservados] = useState([
  { dia: 3, tipo: "Reunión" },
  { dia: 7, tipo: "Evento" },
  { dia: 15, tipo: "Mantenimiento" }
]);


  const [nuevoUsuario, setNuevoUsuario] = useState({
  nombre: "",
  correo: "",
  contrasena: "",
  rol: "Usuario"
});


  const [usuarios, setUsuarios] = useState([
  { id: 1, nombre: "Juan Pérez", correo: "juan@example.com", rol: "Administrador" },
  { id: 2, nombre: "Ana López", correo: "ana@example.com", rol: "Usuario" },
  { id: 3, nombre: "Carlos Ruiz", correo: "carlos@example.com", rol: "Moderador" }
]);

  function toggleReserva(dia) {
  const yaReservado = diasReservados.find(d => d.dia === dia);
  if (yaReservado) {
    setDiasReservados(prev => prev.filter(d => d.dia !== dia));
  } else {
    const tipo = prompt("Tipo de reserva (ej: Reunión, Evento, etc.):");
    if (tipo) {
      setDiasReservados(prev => [...prev, { dia, tipo }]);
    }
  }
}

  

  function mostrarContenido() {
    if (paginaActual === "inicio") {
  const admin = usuarios.find(u => u.rol === "Administrador"); // Simula admin activo

  return (
    <div>
      <h2 style={{ color: "#333" }}>Inicio</h2>
    </div>
  );
}
else if (paginaActual === "usuarios") {
      return (
        <div>
          <h2 style={{color: "#333"}}>Usuarios</h2>
          <button onClick={() => alert('Agregar usuario')}>Agregar Usuario</button>
        </div>
      );
    } else if (paginaActual === "configuracion") {
      return (
        <div style={{color: "#333"}}>
          <h2>Configuración</h2>
          <p>Ajustes del sistema.</p>
        </div>
      );
    }
    else if (paginaActual === "Q&A") {
      return (
        <div style={{color: "#333"}}>
          <h2>PQRS</h2>
          <li>Petición</li>
          <li>Queja</li>
          <li>Sugerencia</li>
        </div>
        
      );
    }else if (paginaActual === "reserva") {
      return (
        <div>
          <h2 style={{ color: "#333" }}>Reservas</h2>
          <li style={{color: "#333"}}>Calendario para reservar un dia del mes</li>
        </div>
      );
    }
    
    
  }
  function mostrarContenido2() {
    if (paginaActual === "inicio") {
  return (
    <div style={{ color: "#fff", width: "100%" }}>
      <h2>Formulario de Solicitudes</h2>
      <table style={{ width: "100%", backgroundColor: "#222", color: "#fff", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={celda}>Tipo</th>
            <th style={celda}>Mensaje</th>
            <th style={celda}>Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={celda}>
              <select style={{ width: "100%", padding: "5px" }}>
                <option value="">Seleccionar</option>
                <option value="peticion">Usuarios Activos</option>
                <option value="queja">Ventas del Mes</option>
                <option value="sugerencia">Reportes Pendientes</option>
              </select>
            </td>
            <td style={celda}>
              <input type="text" placeholder="Escribe tu mensaje" style={{ width: "100%", padding: "3px" }} />
            </td>
            <td style={celda}>
              <button style={{ padding: "5px 10px" }} onClick={() => alert("Dato guardado")}>Guardar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
else if (paginaActual === "usuarios") {
  return (
    <div style={{ width: "100%" }}>
      <h2 style={{ color: "#fff", marginBottom: "20px" }}>Usuarios Registrados</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}>
        <thead>
          <tr style={{ backgroundColor: "#444" }}>
            <th style={celdaEstilo}>ID</th>
            <th style={celdaEstilo}>Nombre</th>
            <th style={celdaEstilo}>Correo</th>
            <th style={celdaEstilo}>Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.id}>
              <td style={celdaEstilo}>{user.id}</td>
              <td style={celdaEstilo}>{user.nombre}</td>
              <td style={celdaEstilo}>{user.correo}</td>
              <td style={celdaEstilo}>{user.rol}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ color: "#fff", marginTop: "30px" }}>Crear nuevo usuario</h3>
      <input
        type="text"
        placeholder="Nombre"
        value={nuevoUsuario.nombre}
        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
        style={inputEstilo}
      />
      <input
        type="email"
        placeholder="Correo"
        value={nuevoUsuario.correo}
        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })}
        style={inputEstilo}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={nuevoUsuario.contrasena}
        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, contrasena: e.target.value })}
        style={inputEstilo}
      />
      <select
        value={nuevoUsuario.rol}
        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })}
        style={inputEstilo}
      >
        <option value="Usuario">Usuario</option>
        <option value="Administrador">Administrador</option>
        <option value="Moderador">Moderador</option>
      </select>

      <button
        onClick={() => {
          const nuevo = {
            id: usuarios.length + 1,
            nombre: nuevoUsuario.nombre,
            correo: nuevoUsuario.correo,
            rol: nuevoUsuario.rol
          };
          setUsuarios([...usuarios, nuevo]);
          alert("Usuario creado con éxito");
          setNuevoUsuario({ nombre: "", correo: "", contrasena: "", rol: "Usuario" });
        }}
        style={{
          marginTop: "10px",
          backgroundColor: "#28a745",
          color: "#fff",
          padding: "10px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Registrar Usuario
      </button>
    </div>
  );
}


else if (paginaActual === "configuracion") {
  return (
    <div style={{ color: "#fff" }}>
      <h2>Configuración</h2>

      <h3>
       <button
          onClick={() =>
            setFontSize((prev) => (prev === "16px" ? "20px" : "16px"))
          }
          style={botonConfigEstilo}
        >
          Tamaño De Letra
      </button>

      </h3>

      <h3>
        <button
          onClick={() => alert("Fuente de letra cambiada (simulado)")}
          style={botonConfigEstilo}
        >
          Fuente De Letra
        </button>
      </h3>

      <h3>
        <button
          onClick={() => window.location.reload()}
          style={{ ...botonConfigEstilo, backgroundColor: "#aa3333" }}
        >
          Reiniciar Chat Bot
        </button>
      </h3>
    </div>
  );
}

    else if (paginaActual === "Q&A") {
  return (
    <div style={{ color: "#fff", width: "100%" }}>
      <h2>Q&A - Enviar PQRS</h2>
      <div style={{ marginTop: "20px" }}>
        <label>Tipo de PQRS:</label>
        <select
          value={nuevoTipoPQRS}
          onChange={(e) => setNuevoTipoPQRS(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#222",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            marginBottom: "10px"
          }}
        >
          <option value="Petición">Petición</option>
          <option value="Queja">Queja</option>
          <option value="Reclamo">Reclamo</option>
          <option value="Sugerencia">Sugerencia</option>
        </select>

        <label>Mensaje:</label>
        <textarea
          value={nuevoMensajePQRS}
          onChange={(e) => setNuevoMensajePQRS(e.target.value)}
          placeholder="Escribe tu mensaje aquí..."
          rows="4"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "none",
            resize: "none",
            backgroundColor: "#222",
            color: "#fff",
            marginBottom: "10px"
          }}
        ></textarea>

        <input
          type="file"
          style={{
            marginBottom: "10px",
            display: "block",
            color: "#fff",
          }}
        />

        <button
          onClick={() => {
            if (nuevoMensajePQRS.trim() === "") {
              alert("Por favor escribe un mensaje.");
              return;
            }
            setPqrsPendientes(prev => [
              ...prev,
              {
                id: prev.length + 1,
                tipo: nuevoTipoPQRS,
                mensaje: nuevoMensajePQRS
              }
            ]);
            alert("PQRS enviada correctamente");
            setNuevoMensajePQRS(""); // Limpia el textarea
          }}
          style={{
            padding: "10px",
            backgroundColor: "#555",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Enviar PQRS
        </button>
      </div>
    </div>
  );
}

else if (paginaActual === "reserva") {
  return (
    <div style={{ color: "#fff", width: "100%" }}>
      <h2>Calendario de Reservas</h2>
      <p>Haz clic en un día para marcarlo o desmarcarlo como reservado.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "10px", marginTop: "20px" }}>
        {Array.from({ length: 30 }, (_, i) => {
          const dia = i + 1;
          const reserva = diasReservados.find(d => d.dia === dia);

          return (
            <div
              key={dia}
              onClick={() => toggleReserva(dia)}
              style={{
                padding: "10px",
                textAlign: "center",
                border: "1px solid #ccc",
                backgroundColor: reserva ? "#ffdddd" : "#222",
                color: "#fff",
                textDecoration: reserva ? "line-through" : "none",
                cursor: "pointer",
                borderRadius: "5px",
              }}
              title={reserva?.tipo || ""}
            >
              {dia}
              {reserva && (
                <div style={{ fontSize: "10px", color: "#900", marginTop: "5px" }}>
                  {reserva.tipo}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

  }
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f0f0f0", fontSize: fontSize }}>
      {/* Menú lateral */}
      <div style={{ width: "200px", backgroundColor: "#333", color: "#fff", padding: "20px" }}>
        <h1 style={{ fontSize: "24px", marginBottom: "30px" }}>Panel Admin</h1>
        <nav style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <button style={botonEstilo} onClick={() => setPaginaActual("inicio")}>Inicio</button>
          <button style={botonEstilo} onClick={() => setPaginaActual("usuarios")}>Usuarios</button>
          <button style={botonEstilo} onClick={() => setPaginaActual("configuracion")}>Configuración</button>
          <button style={botonEstilo} onClick={() => setPaginaActual("Q&A")}>PQRS</button>
          <button style={botonEstilo} onClick={() => setPaginaActual("reserva")}>Reserva</button>
          
        </nav>
      </div>

      {/* Contenido principal */}
      <div style={{  padding: "90px" }}>
        {mostrarContenido()}
      </div>
      {/* Contenido seccundario */}
      <div style={{  padding: "40px", display: "flex",width:"110vh", backgroundColor:"#333" }}>
        {mostrarContenido2()}
      </div>
    </div>
  );
}

const botonEstilo = {
  padding: "10px",
  backgroundColor: "#444",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  
};
const celda = {
  border: "1px solid #555",
  padding: "10px",
  textAlign: "left",
};
const celdaEstilo = {
  border: "1px solid #666",
  padding: "10px",
  textAlign: "left",
};
const inputEstilo = {
  display: "block",
  margin: "10px 0",
  padding: "8px",
  width: "100%",
  borderRadius: "5px",
  border: "1px solid #ccc"
};
const botonConfigEstilo = {
  padding: "10px 15px",
  backgroundColor: "#555",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
  width: "100%",
  maxWidth: "300px",
  textAlign: "left"
};



