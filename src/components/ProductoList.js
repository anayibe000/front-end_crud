// Importación de React
import React from "react";

/**
 * Componente que muestra la lista de productos
 * y permite editar o eliminar registros.
 */
function ProductoList({ productos, onEdit, onDeleted, token }) {
  // Asegura que siempre se trabaje con un arreglo
  const productosList = Array.isArray(productos) ? productos : [];

  // Función para eliminar un producto
  const handleDelete = (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;

    fetch(`http://localhost:3000/api/productos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        alert("Producto eliminado");
        onDeleted(); // Actualiza la lista en el componente padre
      })
      .catch((err) => console.error("Error al eliminar:", err));
  };

  // Renderizado de la lista de productos
  return (
    <div className="card">
      <h2>Lista de Productos</h2>

      {productosList.length === 0 ? (
        <p>No hay productos registrados.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {productosList.map((producto) => (
              <tr key={producto._id}>
                <td>{producto.nombre}</td>
                <td>{producto.description}</td>
                <td>{producto.quantity}</td>
                <td>${producto.price}</td>

                <td>
                  <button
                    className="table-btn"
                    onClick={() => onEdit(producto)}
                  >
                    Editar
                  </button>

                  <button
                    className="table-btn delete-btn"
                    onClick={() => handleDelete(producto._id)}
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

export default ProductoList;
