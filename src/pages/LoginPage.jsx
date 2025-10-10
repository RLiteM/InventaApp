
import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RecuperarContrasena from "../components/RecuperarContrasena";
import ThemeToggle from "../components/ThemeToggle"; // Importar el componente
import "../styles/login.css";

export default function LoginPage({ onLoginSuccess }) {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="login-page">
      <ThemeToggle /> {/* Añadir el interruptor de tema */}
      <LoginForm onLoginSuccess={onLoginSuccess} />
    </div>
  );
}