import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="page-container state-container not-found-state" style={{ minHeight: '60vh' }}>
      <div className="state-icon" style={{ fontSize: 64, color: '#e4e8f0' }}>404</div>
      <h2 className="state-title" style={{ fontSize: 24, marginBottom: 12 }}>Страница не найдена</h2>
      <p className="state-text" style={{ marginBottom: 24, fontSize: 16 }}>Кажется, вы перешли по неверной ссылке.</p>
      <button 
        style={{
          background: "#4f8ef7", 
          color: "#fff", 
          border: "none", 
          borderRadius: 8, 
          padding: "10px 24px", 
          fontSize: 15, 
          fontWeight: 500, 
          cursor: "pointer"
        }} 
        onClick={() => navigate("/")}
      >
        На главную
      </button>
    </div>
  );
}
