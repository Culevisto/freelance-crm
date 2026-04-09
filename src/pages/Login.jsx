import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handle = async () => {
    setError("");
    if (!email.trim() || !password.trim()) { setError("Заполните все поля"); return; }
    if (mode === "register" && !name.trim()) { setError("Введите имя"); return; }
    setLoading(true);
    const err = mode === "login"
      ? login(email, password)
      : register(name, email, password);
    setLoading(false);
    if (err) { setError(err); return; }
    navigate("/");
  };

  return (
    <div style={s.wrap}>
      <div style={s.box}>
        <div style={s.logo}>◉ FreelanceCRM</div>
        <div style={s.title}>{mode === "login" ? "Вход в систему" : "Регистрация"}</div>

        <div style={s.tabs}>
          <button style={{ ...s.tab, ...(mode === "login" ? s.tabActive : {}) }} onClick={() => { setMode("login"); setError(""); }}>Вход</button>
          <button style={{ ...s.tab, ...(mode === "register" ? s.tabActive : {}) }} onClick={() => { setMode("register"); setError(""); }}>Регистрация</button>
        </div>

        {mode === "register" && (
          <div style={s.field}>
            <label style={s.label}>Имя</label>
            <input style={s.input} placeholder="Ваше имя" value={name} onChange={e => setName(e.target.value)} />
          </div>
        )}

        <div style={s.field}>
          <label style={s.label}>Email</label>
          <input style={s.input} type="email" placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        <div style={s.field}>
          <label style={s.label}>Пароль</label>
          <input style={s.input} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handle()} />
        </div>

        {error && <div style={s.error}>{error}</div>}

        {mode === "login" && (
          <div style={s.hint}>
            <span style={{ color: "#7a84a0", fontSize: 12 }}>Демо admin: </span>
            <span style={{ fontFamily: "monospace", fontSize: 12, color: "#4f8ef7" }}>admin@crm.ru / admin123</span>
          </div>
        )}

        <button style={s.btn} onClick={handle} disabled={loading}>
          {loading ? "..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
        </button>
      </div>
    </div>
  );
}

const s = {
  wrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 },
  box: { background: "#13161e", border: "1px solid #1e2230", borderRadius: 16, padding: "36px 40px", width: "100%", maxWidth: 420 },
  logo: { fontFamily: "monospace", fontWeight: 700, color: "#4f8ef7", fontSize: 14, letterSpacing: "0.06em", marginBottom: 24, textAlign: "center" },
  title: { fontSize: 22, fontWeight: 600, color: "#e4e8f0", marginBottom: 24, textAlign: "center" },
  tabs: { display: "flex", background: "#0f1117", borderRadius: 8, padding: 3, marginBottom: 24, gap: 3 },
  tab: { flex: 1, background: "transparent", border: "none", borderRadius: 6, padding: "8px 0", fontSize: 13, color: "#7a84a0", cursor: "pointer" },
  tabActive: { background: "#1e2230", color: "#e4e8f0" },
  field: { marginBottom: 16 },
  label: { display: "block", fontSize: 11, color: "#7a84a0", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 },
  input: { width: "100%", background: "#0f1117", border: "1px solid #1e2230", borderRadius: 8, padding: "10px 14px", fontSize: 14, color: "#e4e8f0", fontFamily: "inherit", outline: "none", boxSizing: "border-box" },
  error: { background: "rgba(226,75,74,0.1)", border: "1px solid rgba(226,75,74,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#e24b4a", marginBottom: 16 },
  hint: { marginBottom: 16, padding: "8px 12px", background: "#0f1117", borderRadius: 8 },
  btn: { width: "100%", background: "#4f8ef7", color: "#fff", border: "none", borderRadius: 8, padding: "12px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 4 },
};