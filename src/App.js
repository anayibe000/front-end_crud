// Importamos React y los hooks necesarios
import React, { useState, useEffect } from "react";

// Importamos los componentes hijos que conforman nuestra aplicación
import EmployeeForm from "./components/EmployeeForm";
import EmployeeList from "./components/EmployeeList";
import './App.css'; // Estilos globales opcionales

/**
 * Componente principal: App
 * -------------------------
 * Este componente orquesta toda la aplicación de Gestión de Empleados.
 * Se encarga de manejar el estado compartido entre EmployeeForm y EmployeeList.
 *
 * Funcionalidades:
 *  - Permite seleccionar un empleado para editarlo.
 *  - Limpia el formulario después de guardar.
 *  - Renderiza el formulario y la lista de empleados.
 */
function App() {

  // -------------------- ESTADO PRINCIPAL --------------------
  // selectedEmployee almacena el empleado que se está editando actualmente.
  // Si es null, el formulario se usa para crear un nuevo empleado.
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // -------------------- ESTADO LISTA EMPLEADOS --------------------
  // employees almacena la lista de empleados obtenida desde la API.
  const [employees, setEmployees] = useState([]);

  // -------------------- FUNCIÓN: CONSULTAR EMPLEADOS --------------------
  // Obtiene todos los empleados desde la API y actualiza el estado.
  const fetchEmployees = () => {
    fetch("http://localhost:3000/api/empleados")
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(err => console.error("Error:", err));
  };

  // -------------------- useEffect INICIAL --------------------
  // Se ejecuta al cargar la aplicación por primera vez
  // y obtiene la lista de empleados desde el backend.
  useEffect(() => {
    fetchEmployees();
  }, []);

  // -------------------- FUNCIÓN: EDITAR --------------------
  /**
   * handleEdit se ejecuta cuando el usuario hace clic en "Editar" desde EmployeeList.
   * Recibe un objeto empleado y lo almacena en el estado selectedEmployee.
   * Esto hace que EmployeeForm cargue sus datos para editar.
   */
  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
  };

  // -------------------- FUNCIÓN: GUARDAR COMPLETADO --------------------
  /**
   * handleSaveComplete se ejecuta cuando el formulario termina de guardar o actualizar
   * un empleado correctamente. Limpia el estado selectedEmployee para resetear el formulario
   * y recarga la lista de empleados desde la API.
   */
  const handleSaveComplete = () => {
    setSelectedEmployee(null);
    fetchEmployees(); // 🔥 Refresca la tabla automáticamente
  };

  // -------------------- RENDERIZADO --------------------
  // Estructura visual principal de la aplicación.
  return (
    <div className="container-main">

      {/* Título principal */}
      <h1>Gestión de Empleados</h1>

      {/* Formulario de creación/edición */}
      <EmployeeForm
        employeeToEdit={selectedEmployee}       // Prop: empleado actual a editar
        onSaveComplete={handleSaveComplete}     // Prop: callback al guardar
      />

      {/* Lista de empleados */}
      <EmployeeList
        employees={employees}                   // 🔥 lista actualizada desde App
        onEdit={handleEdit}                     // Prop: función que se ejecuta al editar
        onDeleted={fetchEmployees}              // 🔥 recarga tras eliminar
      />

    </div>
  );
}

// Exportamos el componente para que sea usado en index.js
export default App;
