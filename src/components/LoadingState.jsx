export default function LoadingState({ message = "Загрузка..." }) {
  return (
    <div className="state-container">
      <div className="spinner"></div>
      <p className="state-text">{message}</p>
    </div>
  );
}
