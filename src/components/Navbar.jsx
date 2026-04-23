import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../AuthContext";
import { useTheme } from "../ThemeContext";

export default function Navbar() {
  const { pathname } = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); setMenuOpen(false); };

  const isActive = (to, exact) => exact ? pathname === to : pathname.startsWith(to);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav style={s.nav}>
        {/* Logo */}
        <div style={s.logo}>◉ FreelanceCRM</div>

        {/* Desktop links */}
        <div style={s.links}>
          <Link to="/" style={{ ...s.link, ...(isActive("/", true) ? s.active : {}) }}>Главная</Link>
          <Link to="/clients" style={{ ...s.link, ...(isActive("/clients") ? s.active : {}) }}>Клиенты</Link>
          {isAdmin && (
            <Link to="/admin" style={{ ...s.link, ...(isActive("/admin") ? s.active : {}) }}>Admin</Link>
          )}
        </div>

        {/* Desktop right */}
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

        {/* Mobile: theme + hamburger */}
        <div style={s.mobileControls}>
          <button style={s.themeBtn} onClick={toggle} title="Сменить тему">
            {dark ? "☀" : "☽"}
          </button>
          <button
            style={s.hamburger}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Меню"
          >
            <span style={{ ...s.bar, ...(menuOpen ? s.barTop : {}) }} />
            <span style={{ ...s.bar, ...(menuOpen ? s.barMid : {}) }} />
            <span style={{ ...s.bar, ...(menuOpen ? s.barBot : {}) }} />
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div style={s.backdrop} onClick={closeMenu} />
          <div style={s.mobileMenu}>
            {/* User info */}
            <div style={s.mobileUser}>
              <div style={s.mobileAvatar}>{user?.name?.[0] || "U"}</div>
              <div>
                <div style={s.mobileUserName}>{user?.name}</div>
                <div style={s.mobileUserEmail}>{user?.email}</div>
              </div>
              {isAdmin && <span style={s.adminBadgeMobile}>admin</span>}
            </div>

            <div style={s.mobileDivider} />

            {/* Nav links */}
            <Link
              to="/"
              style={{ ...s.mobileLink, ...(isActive("/", true) ? s.mobileLinkActive : {}) }}
              onClick={closeMenu}
            >
              <span style={s.mobileLinkIcon}>🏠</span> Главная
            </Link>
            <Link
              to="/clients"
              style={{ ...s.mobileLink, ...(isActive("/clients") ? s.mobileLinkActive : {}) }}
              onClick={closeMenu}
            >
              <span style={s.mobileLinkIcon}>👥</span> Клиенты
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                style={{ ...s.mobileLink, ...(isActive("/admin") ? s.mobileLinkActive : {}) }}
                onClick={closeMenu}
              >
                <span style={s.mobileLinkIcon}>⚙️</span> Admin Panel
              </Link>
            )}

            <div style={s.mobileDivider} />

            <button style={s.mobileLogout} onClick={handleLogout}>
              Выйти из аккаунта
            </button>
          </div>
        </>
      )}

      <style>{`
        @media (min-width: 601px) {
          .mobile-only { display: none !important; }
        }
        @media (max-width: 600px) {
          .desktop-only { display: none !important; }
        }
      `}</style>
    </>
  );
}

const s = {
  nav: {
    background: "#0f1117",
    borderBottom: "1px solid #1e2230",
    padding: "0 20px",
    display: "flex",
    alignItems: "center",
    height: 56,
    position: "sticky",
    top: 0,
    zIndex: 100,
    gap: 8,
  },
  logo: {
    fontFamily: "monospace",
    fontWeight: 700,
    color: "#4f8ef7",
    fontSize: 14,
    letterSpacing: "0.06em",
    whiteSpace: "nowrap",
    marginRight: 8,
    flexShrink: 0,
  },
  // Desktop nav links - hidden on mobile via CSS
  links: {
    display: "flex",
    gap: 2,
    flex: 1,
    "@media (max-width: 600px)": { display: "none" },
  },
  link: {
    padding: "6px 14px",
    borderRadius: 7,
    fontSize: 13,
    fontWeight: 500,
    color: "#7a84a0",
    textDecoration: "none",
    transition: "all 0.15s",
    whiteSpace: "nowrap",
  },
  active: { color: "#4f8ef7", background: "rgba(79,142,247,0.1)" },
  // Desktop right - hidden on mobile
  right: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexShrink: 0,
  },
  themeBtn: {
    background: "transparent",
    border: "1px solid #1e2230",
    borderRadius: 7,
    width: 34,
    height: 34,
    fontSize: 16,
    color: "#7a84a0",
    cursor: "pointer",
    flexShrink: 0,
  },
  userInfo: { display: "flex", alignItems: "center", gap: 8 },
  userName: { fontSize: 13, color: "#b0b8cc", whiteSpace: "nowrap" },
  adminBadge: {
    fontSize: 10,
    fontWeight: 600,
    color: "#4f8ef7",
    background: "rgba(79,142,247,0.1)",
    border: "1px solid rgba(79,142,247,0.2)",
    padding: "2px 8px",
    borderRadius: 20,
    whiteSpace: "nowrap",
  },
  logoutBtn: {
    background: "transparent",
    border: "1px solid #1e2230",
    borderRadius: 7,
    padding: "6px 14px",
    fontSize: 12,
    color: "#7a84a0",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  // Mobile hamburger controls
  mobileControls: {
    display: "none", // shown via CSS below
    alignItems: "center",
    gap: 8,
    marginLeft: "auto",
  },
  hamburger: {
    background: "transparent",
    border: "1px solid #1e2230",
    borderRadius: 7,
    width: 38,
    height: 38,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    cursor: "pointer",
    flexShrink: 0,
    padding: 0,
  },
  bar: {
    display: "block",
    width: 18,
    height: 2,
    background: "#7a84a0",
    borderRadius: 2,
    transition: "all 0.25s ease",
    transformOrigin: "center",
  },
  barTop: { transform: "translateY(7px) rotate(45deg)", background: "#4f8ef7" },
  barMid: { opacity: 0, transform: "scaleX(0)" },
  barBot: { transform: "translateY(-7px) rotate(-45deg)", background: "#4f8ef7" },

  // Mobile dropdown menu
  backdrop: {
    position: "fixed",
    inset: 0,
    top: 56,
    background: "rgba(0,0,0,0.4)",
    zIndex: 98,
  },
  mobileMenu: {
    position: "fixed",
    top: 56,
    left: 0,
    right: 0,
    background: "#13161e",
    borderBottom: "1px solid #1e2230",
    zIndex: 99,
    padding: "16px 0",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  },
  mobileUser: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "8px 20px 16px",
  },
  mobileAvatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "rgba(79,142,247,0.12)",
    color: "#4f8ef7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 16,
    flexShrink: 0,
  },
  mobileUserName: { fontSize: 14, fontWeight: 600, color: "#e4e8f0", marginBottom: 2 },
  mobileUserEmail: { fontSize: 12, color: "#7a84a0" },
  adminBadgeMobile: {
    marginLeft: "auto",
    fontSize: 10,
    fontWeight: 600,
    color: "#4f8ef7",
    background: "rgba(79,142,247,0.1)",
    border: "1px solid rgba(79,142,247,0.2)",
    padding: "3px 10px",
    borderRadius: 20,
  },
  mobileDivider: { height: 1, background: "#1e2230", margin: "4px 0" },
  mobileLink: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "13px 20px",
    fontSize: 15,
    fontWeight: 500,
    color: "#b0b8cc",
    textDecoration: "none",
    transition: "background 0.15s",
  },
  mobileLinkActive: {
    color: "#4f8ef7",
    background: "rgba(79,142,247,0.07)",
  },
  mobileLinkIcon: { fontSize: 16, width: 20, textAlign: "center" },
  mobileLogout: {
    display: "block",
    width: "calc(100% - 40px)",
    margin: "8px 20px 0",
    background: "rgba(226,75,74,0.08)",
    border: "1px solid rgba(226,75,74,0.2)",
    borderRadius: 8,
    padding: "12px",
    fontSize: 14,
    color: "#e24b4a",
    cursor: "pointer",
    textAlign: "center",
    fontFamily: "inherit",
    fontWeight: 500,
  },
};
