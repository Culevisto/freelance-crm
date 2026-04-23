export default function ErrorState({ message = "Произошла ошибка при загрузке данных", onRetry }) {
  return (
    <div className="state-container error-state">
      <div className="state-icon error-icon">⚠</div>
      <h3 className="state-title">Ошибка</h3>
      <p className="state-text">{message}</p>
      {onRetry && (
        <button className="btn-primary" onClick={onRetry} style={{ marginTop: 16 }}>
          Повторить
        </button>
      )}
    </div>
  );
}
