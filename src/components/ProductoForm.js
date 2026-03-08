// Importación de React y hooks
import React, { useState, useEffect } from "react";

/**
 * Formulario para crear o editar productos.
 * Recibe un producto opcional para edición y notifica
 * al componente padre cuando se guarda la información.
 */
function ProductoForm({ productoToEdit, onSaveComplete, token }) {
  // Estados de los campos del formulario
  const [nombre, setNombre] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  // Sincroniza los campos cuando se selecciona un producto para editar
  useEffect(() => {
    if (productoToEdit) {
      setNombre(productoToEdit.nombre || "");
      setDescription(productoToEdit.description || "");
      setQuantity(productoToEdit.quantity || "");
      setPrice(productoToEdit.price || "");
    } else {
      setNombre("");
      setDescription("");
      setQuantity("");
      setPrice("");
    }
  }, [productoToEdit]);

  // Manejo del envío del formulario (crear o actualizar)
  const handleSubmit = (e) => {
    e.preventDefault();

    const newProducto = { nombre, description, quantity, price };

    const method = productoToEdit ? "PUT" : "POST";
    const url = productoToEdit
      ? `http://localhost:3000/api/productos/${productoToEdit._id}`
      : "http://localhost:3000/api/productos";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newProducto),
    })
      .then((res) => res.json())
      .then((data) => {
        const nombreMostrar = data.nombre || nombre;

        alert(
          productoToEdit
            ? `Producto ${nombreMostrar} actualizado`
            : `Producto ${nombreMostrar} creado`,
        );

        // Limpia el formulario y actualiza la lista en el componente padre
        setNombre("");
        setDescription("");
        setQuantity("");
        setPrice("");
        onSaveComplete();
      })
      .catch((err) => console.error("Error:", err));
  };

  // Renderizado del formulario
  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <h2>{productoToEdit ? "Editar Producto" : "Agregar Producto"}</h2>

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Cantidad"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Precio"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <button type="submit">{productoToEdit ? "Actualizar" : "Crear"}</button>
      </form>
    </div>
  );
}

export default ProductoForm;
