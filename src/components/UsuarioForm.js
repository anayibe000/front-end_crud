// Importación de React y hooks
import React, { useState, useEffect } from "react";

/**
 * Formulario para crear o editar usuarios.
 * Recibe un usuario opcional para edición y notifica al
 * componente padre cuando se guarda la información.
 */
function UsuarioForm({ usuarioToEdit, onSaveComplete, token }) {
  // Estados de los campos del formulario
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Sincroniza los campos cuando se selecciona un usuario para editar
  useEffect(() => {
    if (usuarioToEdit) {
      setNombre(usuarioToEdit.nombre || "");
      setEmail(usuarioToEdit.email || "");
      setPassword("");
    } else {
      setNombre("");
      setEmail("");
      setPassword("");
    }
  }, [usuarioToEdit]);

  // Manejo del envío del formulario (crear o actualizar)
  const handleSubmit = (e) => {
    e.preventDefault();

    const newUsuario = { nombre, email, password };

    const method = usuarioToEdit ? "PUT" : "POST";
    const url = usuarioToEdit
      ? `http://localhost:3000/api/usuarios/${usuarioToEdit._id}`
      : "http://localhost:3000/api/usuarios";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newUsuario),
    })
      .then((res) => res.json())
      .then((data) => {
        const nombreMostrar = data.nombre || nombre;

        alert(
          usuarioToEdit
            ? `Usuario ${nombreMostrar} actualizado`
            : `Usuario ${nombreMostrar} creado`,
        );

        // Limpia el formulario y actualiza la lista en el componente padre
        setNombre("");
        setEmail("");
        setPassword("");
        onSaveComplete();
      })
      .catch((err) => console.error("Error:", err));
  };

  // Renderizado del formulario
  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <h2>{usuarioToEdit ? "Editar Usuario" : "Agregar Usuario"}</h2>

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">{usuarioToEdit ? "Actualizar" : "Crear"}</button>
      </form>
    </div>
  );
}

export default UsuarioForm;
