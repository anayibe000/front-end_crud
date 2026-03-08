// Importación de React
import React from "react";

/**
 * Componente que muestra la lista de empleados
 * y permite editar o eliminar registros.
 */
function EmployeeList({ employees, onEdit, onDeleted }) {
  // Función para eliminar un empleado
  const handleDelete = (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este empleado?")) return;

    fetch(`http://localhost:3000/api/empleados/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        alert("Empleado eliminado");
        onDeleted(); // Actualiza la lista en el componente padre
      })
      .catch((err) => console.error("Error al eliminar:", err));
  };

  // Renderizado de la lista de empleados
  return (
    <div className="card">
      <h2>Lista de Empleados</h2>

      {employees.length === 0 ? (
        <p>No hay empleados registrados.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Posición</th>
              <th>Oficina</th>
              <th>Salario</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id}>
                <td>{emp.name}</td>
                <td>{emp.position}</td>
                <td>{emp.office}</td>
                <td>${emp.salary}</td>

                <td>
                  <button className="table-btn" onClick={() => onEdit(emp)}>
                    Editar
                  </button>

                  <button
                    className="table-btn delete-btn"
                    onClick={() => handleDelete(emp._id)}
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

export default EmployeeList;
