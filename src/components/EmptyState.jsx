export default function EmptyState({ title = "Пусто", message = "Ничего не найдено" }) {
  return (
    <div className="state-container empty-state">
      <div className="state-icon">∅</div>
      <h3 className="state-title">{title}</h3>
      <p className="state-text">{message}</p>
    </div>
  );
}
