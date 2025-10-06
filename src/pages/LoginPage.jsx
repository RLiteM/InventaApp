import LoginForm from "../components/LoginForm";
import "../styles/login.css";

export default function LoginPage({ onLoginSuccess }) {
  return (
    <div className="login-page">
      <LoginForm onLoginSuccess={onLoginSuccess} />
    </div>
  );
}