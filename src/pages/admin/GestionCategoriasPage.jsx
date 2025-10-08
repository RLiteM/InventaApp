import { useState, useEffect } from 'react';
import api from '../../api/apiClient';
import CrearCategoriaModal from '../../components/admin/CrearCategoriaModal';
import EditarCategoriaModal from '../../components/admin/EditarCategoriaModal'; // Nuevo
import ListarProductosModal from '../../components/admin/ListarProductosModal'; // Nuevo
import '../../styles/GestionCategorias.css';

export default function GestionCategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para los modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  
  // Estado para la categoría seleccionada
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  const fetchCategorias = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // La API ahora devuelve todo en una sola llamada
      const response = await api.get('/categoria');
      setCategorias(response.data);
    } catch (err) {
      setError('No se pudo cargar la lista de categorías.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  // Manejadores para el modal de CREACIÓN
  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);
  const handleCategoriaCreada = () => {
    handleCloseCreateModal();
    fetchCategorias();
  };

  // Manejadores para el modal de EDICIÓN
  const handleOpenEditModal = (categoria) => {
    setSelectedCategoria(categoria);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setSelectedCategoria(null);
    setIsEditModalOpen(false);
  };
  const handleCategoriaActualizada = () => {
    handleCloseEditModal();
    fetchCategorias();
  };

  // Manejadores para el modal de LISTADO DE PRODUCTOS
  const handleOpenListModal = (categoria) => {
    setSelectedCategoria(categoria);
    setIsListModalOpen(true);
  };
  const handleCloseListModal = () => {
    setSelectedCategoria(null);
    setIsListModalOpen(false);
  };

  const handleDelete = async (categoriaId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      try {
        await api.delete(`/categoria/${categoriaId}`);
        setCategorias(categorias.filter(c => c.categoriaId !== categoriaId));
      } catch (err) {
        setError('No se pudo eliminar la categoría. Es posible que esté en uso.');
        console.error(err);
      }
    }
  };

  if (isLoading && !categorias.length) {
    return <div>Cargando categorías...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="category-management-page">
      <div className="page-header">
        <h1>Gestión de Categorías</h1>
        <button onClick={handleOpenCreateModal} className="create-button">Crear Categoría</button>
      </div>
      <table className="categories-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Productos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map(cat => (
            <tr key={cat.categoriaId}>
              <td>{cat.nombre}</td>
              <td>{cat.descripcion || 'N/A'}</td>
              <td>{cat.cantidadProductos ?? 'N/A'}</td>
              <td className="action-buttons">
                <button onClick={() => handleOpenEditModal(cat)} className="edit-button">Editar</button>
                <button onClick={() => handleDelete(cat.categoriaId)} className="delete-button">Eliminar</button>
                <button onClick={() => handleOpenListModal(cat)} className="list-button">Ver Productos</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modales */}
      <CrearCategoriaModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onCategoriaCreada={handleCategoriaCreada}
      />
      {isEditModalOpen && (
        <EditarCategoriaModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onCategoriaActualizada={handleCategoriaActualizada}
          categoria={selectedCategoria}
        />
      )}
      {isListModalOpen && (
        <ListarProductosModal
          isOpen={isListModalOpen}
          onClose={handleCloseListModal}
          categoria={selectedCategoria}
        />
      )}
    </div>
  );
}
