export default function EmptyState({ title = "Пусто", message = "Ничего не найдено" }) {
  return (
    <div className="state-container empty-state">
      <div className="state-icon" style={{ color: '#e4e8f0', fontSize: 52 }}>∅</div>
      <h3 className="state-title" style={{ fontSize: 20, color: '#fff' }}>{title}</h3>
      <p className="state-text" style={{ fontSize: 15, color: '#b0b8cc' }}>{message}</p>
    </div>
  );
}
