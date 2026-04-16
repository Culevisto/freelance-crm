import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useTheme } from "../ThemeContext";

export default function Navbar() {
  const { pathname } = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  const isActive = (to, exact) => exact ? pathname === to : pathname.startsWith(to);

  return (
    <nav style={s.nav}>
      <div style={s.logo}>◉ FreelanceCRM</div>
      <div style={s.links}>
        <Link to="/" style={{ ...s.link, ...(isActive("/", true) ? s.active : {}) }}>Главная</Link>
        <Link to="/clients" style={{ ...s.link, ...(isActive("/clients") ? s.active : {}) }}>Клиенты</Link>
        {isAdmin && (
          <Link to="/admin" style={{ ...s.link, ...(isActive("/admin") ? s.active : {}) }}>Admin</Link>
        )}
      </div>
      <div style={s.right}>
        <button style={s.themeBtn} onClick={toggle} title="Сменить тему">
          {dark ? "☀" : "☽"}
        </button>
        <div style={s.userInfo}>
          <span style={s.userName}>{user?.name}</span>
          {isAdmin && <span style={s.adminBadge}>admin</span>}
        </div>
        <button style={s.logoutBtn} onClick={handleLogout}>Выйти</button>
      </div>
    </nav>
  );
}

const s = {
  nav: { background: "#0f1117", borderBottom: "1px solid #1e2230", padding: "0 28px", display: "flex", alignItems: "center", height: 56, position: "sticky", top: 0, zIndex: 100 },
  logo: { fontFamily: "monospace", fontWeight: 700, color: "#4f8ef7", marginRight: 36, fontSize: 14, letterSpacing: "0.06em", whiteSpace: "nowrap" },
  links: { display: "flex", gap: 2, flex: 1 },
  link: { padding: "6px 14px", borderRadius: 7, fontSize: 13, fontWeight: 500, color: "#7a84a0", textDecoration: "none", transition: "all 0.15s" },
  active: { color: "#4f8ef7", background: "rgba(79,142,247,0.1)" },
  right: { display: "flex", alignItems: "center", gap: 12 },
  themeBtn: { background: "transparent", border: "1px solid #1e2230", borderRadius: 7, width: 34, height: 34, fontSize: 16, color: "#7a84a0", cursor: "pointer" },
  userInfo: { display: "flex", alignItems: "center", gap: 8 },
  userName: { fontSize: 13, color: "#b0b8cc" },
  adminBadge: { fontSize: 10, fontWeight: 600, color: "#4f8ef7", background: "rgba(79,142,247,0.1)", border: "1px solid rgba(79,142,247,0.2)", padding: "2px 8px", borderRadius: 20 },
  logoutBtn: { background: "transparent", border: "1px solid #1e2230", borderRadius: 7, padding: "6px 14px", fontSize: 12, color: "#7a84a0", cursor: "pointer" },
};