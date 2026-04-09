import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const ADMIN_EMAIL = "admin@crm.ru";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("crm_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("crm_users");
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Admin", email: "admin@crm.ru", password: "admin123", role: "admin" }
    ];
  });

  const login = (email, password) => {
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return "Неверный email или пароль";
    const { password: _, ...safe } = found;
    setUser(safe);
    localStorage.setItem("crm_user", JSON.stringify(safe));
    return null;
  };

  const register = (name, email, password) => {
    if (users.find(u => u.email === email)) return "Пользователь уже существует";
    const newUser = { id: Date.now(), name, email, password, role: "manager" };
    const updated = [...users, newUser];
    setUsers(updated);
    localStorage.setItem("crm_users", JSON.stringify(updated));
    const { password: _, ...safe } = newUser;
    setUser(safe);
    localStorage.setItem("crm_user", JSON.stringify(safe));
    return null;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("crm_user");
  };

  const isAdmin = user?.email === ADMIN_EMAIL || user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);