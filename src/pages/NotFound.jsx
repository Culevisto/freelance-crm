import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="page-container state-container not-found-state" style={{ minHeight: '60vh' }}>
      <div className="state-icon" style={{ fontSize: 64 }}>404</div>
      <h2 style={{ color: '#e4e8f0', marginBottom: 12 }}>Страница не найдена</h2>
      <p className="state-text" style={{ marginBottom: 24 }}>Кажется, вы перешли по неверной ссылке.</p>
      <button className="btn-primary" onClick={() => navigate("/")}>
        На главную
      </button>
    </div>
  );
}
