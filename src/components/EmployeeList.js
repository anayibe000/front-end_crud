// Importamos React y los hooks necesarios
import React from "react";

/**
 * Componente EmployeeList
 * -----------------------
 * Muestra la lista de empleados obtenidos desde el componente padre (App).
 * Permite eliminar empleados y notificar al componente padre cuando se desea editar uno.
 *
 * Props:
 *  - employees: arreglo con los empleados a mostrar (viene desde App)
 *  - onEdit: función callback que recibe el empleado seleccionado para editar.
 *  - onDeleted: función callback que se ejecuta después de eliminar, para refrescar la lista.
 */
function EmployeeList({ employees, onEdit, onDeleted }) {

  // -------------------- FUNCIÓN ELIMINAR --------------------
  // handleDelete recibe el ID del empleado a eliminar.
  // Pide confirmación al usuario y, si acepta, envía la solicitud DELETE al backend.
  const handleDelete = (id) => {
    // Confirmación para evitar eliminaciones accidentales
    if (!window.confirm("¿Seguro que deseas eliminar este empleado?")) return;

    // Petición DELETE al servidor
    fetch(`http://localhost:3000/api/empleados/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        alert("Empleado eliminado"); // Mensaje de confirmación
        onDeleted(); // Recargamos la lista desde el componente padre (App)
      })
      .catch((err) => console.error("Error al eliminar:", err));
  };

  // -------------------- RENDERIZADO --------------------
  // Muestra un mensaje si no hay empleados o una tabla si existen registros.
  return (
    <div>
      <h2>Lista de Empleados</h2>

      {/* Si no hay empleados, mostrar un mensaje */}
      {employees.length === 0 ? (
        <p>No hay empleados registrados.</p>
      ) : (
        // Si hay empleados, renderizamos una tabla HTML sencilla
        <table border="1" cellPadding="5">
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
            {/* Recorremos el arreglo de empleados */}
            {employees.map((emp) => (
              // Cada fila debe tener una key única (usamos emp._id)
              <tr key={emp._id}>
                <td>{emp.name}</td>
                <td>{emp.position}</td>
                <td>{emp.office}</td>
                <td>${emp.salary}</td>
                <td>
                  {/* Botón Editar: llama a onEdit pasando el empleado seleccionado */}
                  <button onClick={() => onEdit(emp)}>Editar</button>

                  {/* Botón Eliminar: llama a handleDelete con el ID del empleado */}
                  <button
                    onClick={() => handleDelete(emp._id)}
                    style={{ marginLeft: "10px" }} // Espacio visual entre botones
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

// Exportamos el componente para que pueda usarse en App.js u otros componentes
export default EmployeeList;