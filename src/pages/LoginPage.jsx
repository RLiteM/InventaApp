import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RecuperarContrasena from "../components/RecuperarContrasena";
import "../styles/login.css";

export default function LoginPage({ onLoginSuccess }) {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
  <div className="login-page">
    <LoginForm onLoginSuccess={onLoginSuccess} />
  </div>

  );
}