// Importación de React
import React from "react";

/**
 * Componente que muestra la lista de usuarios y permite
 * editar o eliminar registros.
 */
function UsuarioList({ usuarios, onEdit, onDeleted, token }) {
  // Asegura que siempre se trabaje con un arreglo
  const usuariosList = Array.isArray(usuarios) ? usuarios : [];

  // Función para eliminar un usuario
  const handleDelete = (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;

    fetch(`http://localhost:3000/api/usuarios/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        alert("Usuario eliminado");
        onDeleted(); // Actualiza la lista en el componente padre
      })
      .catch((err) => console.error("Error al eliminar:", err));
  };

  // Renderizado de la lista de usuarios
  return (
    <div className="card">
      <h2>Lista de Usuarios</h2>

      {usuariosList.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Contraseña</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuariosList.map((usuario) => (
              <tr key={usuario._id}>
                <td>{usuario.nombre}</td>
                <td>{usuario.email}</td>
                <td>***</td>

                <td>
                  <button className="table-btn" onClick={() => onEdit(usuario)}>
                    Editar
                  </button>

                  <button
                    className="table-btn delete-btn"
                    onClick={() => handleDelete(usuario._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UsuarioList;
