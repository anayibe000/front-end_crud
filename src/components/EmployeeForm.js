// Importamos React y los hooks necesarios desde la biblioteca
import React, { useState, useEffect } from "react";

/**
 * Componente EmployeeForm
 * -----------------------
 * Este componente se utiliza para crear o editar empleados.
 * Puede funcionar en dos modos:
 *  - Modo "crear": cuando no hay empleado seleccionado (employeeToEdit = null)
 *  - Modo "editar": cuando se recibe un empleado con sus datos
 *
 * Props:
 *  - employeeToEdit: objeto con los datos del empleado a editar (puede ser null)
 *  - onSaveComplete: función callback que se ejecuta cuando se guarda correctamente
 */
function EmployeeForm({ employeeToEdit, onSaveComplete }) {

  // -------------------- ESTADOS --------------------
  // Cada campo del formulario tiene su propio estado local controlado.
  // Esto permite reflejar en tiempo real lo que el usuario escribe.
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [office, setOffice] = useState("");
  const [salary, setSalary] = useState("");

  // -------------------- EFECTO DE SINCRONIZACIÓN --------------------
  // Este useEffect se ejecuta cada vez que cambia la prop employeeToEdit.
  // Si existe un empleado para editar, los campos se llenan con sus datos.
  // Si no existe (modo creación), se limpian los campos del formulario.
  useEffect(() => {
    if (employeeToEdit) {
      // Precargar datos del empleado seleccionado
      setName(employeeToEdit.name);
      setPosition(employeeToEdit.position);
      setOffice(employeeToEdit.office);
      setSalary(employeeToEdit.salary);
    } else {
      // Limpiar el formulario para crear uno nuevo
      setName("");
      setPosition("");
      setOffice("");
      setSalary("");
    }
  }, [employeeToEdit]); // Se vuelve a ejecutar si cambia employeeToEdit

  // -------------------- MANEJO DEL ENVÍO --------------------
  // Esta función controla lo que ocurre al enviar el formulario.
  // Se encarga de crear o actualizar el empleado según corresponda.
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que el navegador recargue la página por defecto.

    // Construimos un objeto con los datos del formulario
    const newEmployee = { name, position, office, salary };

    // Determinamos si el formulario está en modo edición o creación
    const method = employeeToEdit ? "PUT" : "POST";
    const url = employeeToEdit
      ? `http://localhost:3000/api/empleados/${employeeToEdit._id}` // Actualizar
      : "http://localhost:3000/api/empleados"; // Crear nuevo

    // -------------------- PETICIÓN FETCH --------------------
    // Enviamos los datos al backend (Node.js / Express)
    fetch(url, {
      method, // PUT o POST según el caso
      headers: { "Content-Type": "application/json" }, // Indicamos que el cuerpo es JSON
      body: JSON.stringify(newEmployee), // Convertimos el objeto a texto JSON
    })
      .then((res) => res.json()) // Convertimos la respuesta a formato JSON
      .then((data) => {

        // -------------------- MENSAJE USUARIO --------------------
        // Algunos backends no devuelven el objeto completo en PUT,
        // por eso usamos el nombre local si data.name no existe.
        const nombreMostrar = data.name || name;

        alert(
          employeeToEdit
            ? `Empleado ${nombreMostrar} actualizado`
            : `Empleado ${nombreMostrar} creado`
        );

        // -------------------- LIMPIAR FORMULARIO --------------------
        // Esto garantiza que el formulario se resetee después de crear o editar
        setName("");
        setPosition("");
        setOffice("");
        setSalary("");

        // -------------------- NOTIFICAR AL PADRE --------------------
        // Permite refrescar la lista y limpiar selección en App.js
        onSaveComplete();
      })
      .catch((err) => console.error("Error:", err)); // Captura y muestra errores en consola
  };

  // -------------------- RENDERIZADO DEL FORMULARIO --------------------
  // Se muestran los campos de entrada controlados y un botón dinámico.
  // El texto del botón y el título cambian según si se está creando o editando un empleado.
  return (
    <form onSubmit={handleSubmit}>
      {/* Título dinámico del formulario */}
      <h2>{employeeToEdit ? "Editar Empleado" : "Agregar Empleado"}</h2>

      {/* Campo de texto: Nombre */}
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      {/* Campo de texto: Posición */}
      <input
        type="text"
        placeholder="Posición"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        required
      />

      {/* Campo de texto: Oficina */}
      <input
        type="text"
        placeholder="Oficina"
        value={office}
        onChange={(e) => setOffice(e.target.value)}
        required
      />

      {/* Campo numérico: Salario */}
      <input
        type="number"
        placeholder="Salario"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
        required
      />

      {/* Botón dinámico (cambia texto según acción) */}
      <button type="submit">
        {employeeToEdit ? "Actualizar" : "Guardar"}
      </button>
    </form>
  );
}

// Exportamos el componente para que pueda ser importado en otros archivos
export default EmployeeForm;