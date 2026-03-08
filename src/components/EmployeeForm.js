// Importación de React y hooks
import React, { useState, useEffect } from "react";

/**
 * Formulario para crear o editar empleados.
 * Recibe un empleado opcional para edición y notifica
 * al componente padre cuando se guarda la información.
 */
function EmployeeForm({ employeeToEdit, onSaveComplete }) {
  // Estados de los campos del formulario
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [office, setOffice] = useState("");
  const [salary, setSalary] = useState("");

  // Sincroniza los campos cuando se selecciona un empleado para editar
  useEffect(() => {
    if (employeeToEdit) {
      setName(employeeToEdit.name || "");
      setPosition(employeeToEdit.position || "");
      setOffice(employeeToEdit.office || "");
      setSalary(employeeToEdit.salary || "");
    } else {
      setName("");
      setPosition("");
      setOffice("");
      setSalary("");
    }
  }, [employeeToEdit]);

  // Manejo del envío del formulario (crear o actualizar)
  const handleSubmit = (e) => {
    e.preventDefault();

    const newEmployee = { name, position, office, salary };

    const method = employeeToEdit ? "PUT" : "POST";
    const url = employeeToEdit
      ? `http://localhost:3000/api/empleados/${employeeToEdit._id}`
      : "http://localhost:3000/api/empleados";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEmployee),
    })
      .then((res) => res.json())
      .then((data) => {
        const nombreMostrar = data.name || name;

        alert(
          employeeToEdit
            ? `Empleado ${nombreMostrar} actualizado`
            : `Empleado ${nombreMostrar} creado`,
        );

        // Limpia el formulario y actualiza la lista en el componente padre
        setName("");
        setPosition("");
        setOffice("");
        setSalary("");
        onSaveComplete();
      })
      .catch((err) => console.error("Error:", err));
  };

  // Renderizado del formulario
  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <h2>{employeeToEdit ? "Editar Empleado" : "Agregar Empleado"}</h2>

        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Posición"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Oficina"
          value={office}
          onChange={(e) => setOffice(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Salario"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          required
        />

        <button type="submit">
          {employeeToEdit ? "Actualizar" : "Guardar"}
        </button>
      </form>
    </div>
  );
}

export default EmployeeForm;
