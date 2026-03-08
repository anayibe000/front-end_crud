// Importación de React y hooks
import React, { useState, useEffect } from "react";

// Importación de componentes de la aplicación
import EmployeeForm from "./components/EmployeeForm";
import EmployeeList from "./components/EmployeeList";
import UsuarioForm from "./components/UsuarioForm";
import UsuarioList from "./components/UsuarioList";
import ProductoForm from "./components/ProductoForm";
import ProductoList from "./components/ProductoList";

import "./App.css";

/**
 * Componente principal de la aplicación.
 * Maneja autenticación con JWT y la gestión de empleados,
 * usuarios y productos.
 */
function App() {
  // Estados de autenticación
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Estados de datos
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);

  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [usuarios, setUsuarios] = useState([]);

  const [selectedProducto, setSelectedProducto] = useState(null);
  const [productos, setProductos] = useState([]);

  // Headers con token para peticiones protegidas
  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  // -------- LOGIN --------
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      const res = await fetch("http://localhost:3000/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.message || "Error en login");
        return;
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);

      setLoginEmail("");
      setLoginPassword("");

      setTimeout(() => {
        fetchEmployees();
        fetchUsuarios();
        fetchProductos();
      }, 500);
    } catch (err) {
      setLoginError("Error de conexión");
      console.error(err);
    }
  };

  // -------- LOGOUT --------
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setEmployees([]);
    setUsuarios([]);
    setProductos([]);
  };

  // -------- CONSULTAS A LA API --------
  const fetchEmployees = () => {
    if (!token) return;

    fetch("http://localhost:3000/api/empleados", {
      headers: getAuthHeaders(),
    })
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((err) => console.error(err));
  };

  const fetchUsuarios = () => {
    if (!token) return;

    fetch("http://localhost:3000/api/usuarios", {
      headers: getAuthHeaders(),
    })
      .then((res) => res.json())
      .then((data) => setUsuarios(Array.isArray(data) ? data : []))
      .catch(() => setUsuarios([]));
  };

  const fetchProductos = () => {
    if (!token) return;

    fetch("http://localhost:3000/api/productos", {
      headers: getAuthHeaders(),
    })
      .then((res) => res.json())
      .then((data) => setProductos(Array.isArray(data) ? data : []))
      .catch(() => setProductos([]));
  };

  // Cargar datos cuando existe token
  useEffect(() => {
    if (token) {
      fetchEmployees();
      fetchUsuarios();
      fetchProductos();
    }
  }, [token]);

  // Acciones después de guardar
  const handleSaveComplete = () => {
    setSelectedEmployee(null);
    fetchEmployees();
  };

  const handleSaveUsuarioComplete = () => {
    setSelectedUsuario(null);
    fetchUsuarios();
  };

  const handleSaveProductoComplete = () => {
    setSelectedProducto(null);
    fetchProductos();
  };

  // -------- PANTALLA DE LOGIN --------
  if (!token) {
    return (
      <div className="container-main">
        <h1>Sistema de Gestión CRUD</h1>

        <div
          className="card"
          style={{ maxWidth: "400px", margin: "50px auto" }}
        >
          <h2>Iniciar Sesión</h2>

          {loginError && (
            <p style={{ color: "red", marginBottom: "10px" }}>
              ⚠️ {loginError}
            </p>
          )}

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />

            <button type="submit">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  // -------- INTERFAZ PRINCIPAL --------
  return (
    <div>
      <div className="container-main">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h1>Sistema de Gestión CRUD</h1>
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>

        <h2>Gestión de Empleados</h2>
        <EmployeeForm
          employeeToEdit={selectedEmployee}
          onSaveComplete={handleSaveComplete}
        />
        <EmployeeList
          employees={employees}
          onEdit={(emp) => setSelectedEmployee(emp)}
          onDeleted={fetchEmployees}
        />

        <hr style={{ margin: "40px 0", borderColor: "#ccc" }} />

        <h2>Gestión de Usuarios</h2>
        <UsuarioForm
          usuarioToEdit={selectedUsuario}
          onSaveComplete={handleSaveUsuarioComplete}
          token={token}
        />
        <UsuarioList
          usuarios={usuarios}
          onEdit={(usuario) => setSelectedUsuario(usuario)}
          onDeleted={fetchUsuarios}
          token={token}
        />

        <hr style={{ margin: "40px 0", borderColor: "#ccc" }} />

        <h2>Gestión de Productos</h2>
        <ProductoForm
          productoToEdit={selectedProducto}
          onSaveComplete={handleSaveProductoComplete}
          token={token}
        />
        <ProductoList
          productos={productos}
          onEdit={(producto) => setSelectedProducto(producto)}
          onDeleted={fetchProductos}
          token={token}
        />
      </div>
    </div>
  );
}

export default App;
