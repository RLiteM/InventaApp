import { useState } from "react";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";

export default function AppRouter() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <LoginPage onLoginSuccess={setUser} />;
  }

  return <DashboardPage user={user} />;
}
