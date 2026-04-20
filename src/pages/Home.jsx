import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchClients } from "../api/api";

const STATUS_LABEL = {
  active: "Активные",
  pending: "Ожидание",
  completed: "Завершены",
  paused: "Пауза",
};

const STATUS_COLOR = {
  active: { bg: "rgba(29,158,117,0.12)", color: "#1D9E75" },
  pending: { bg: "rgba(186,117,23,0.12)", color: "#BA7517" },
  completed: { bg: "rgba(79,142,247,0.12)", color: "#4f8ef7" },
  paused: { bg: "rgba(122,132,160,0.12)", color: "#7a84a0" },
};

export default function Home() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients()
      .then(setClients)
      .finally(() => setLoading(false));
  }, []);

  const totalBudget = clients.reduce((s, c) => s + (c.budget || 0), 0);
  const totalPaid = clients.reduce((s, c) => s + (c.paid || 0), 0);
  const activeCount = clients.filter(c => c.status === "active").length;
  const pendingCount = clients.filter(c => c.status === "pending").length;

  const fmt = (n) => n.toLocaleString("ru-RU") + " ₽";

  const byStatus = Object.entries(
    clients.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {})
  );

  const recent = [...clients]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <div style={s.page}>
      <p style={s.tag}>// freelance crm</p>
      <h1 style={s.title}>
        {" "}
        <span style={{ color: "#4f8ef7" }}>Привет Фрилансер</span>
      </h1>
      <p style={s.sub}>
        Управляй клиентами, отслеживай оплаты и дедлайны в одном месте.
      </p>

      {loading ? (
        <p style={{ color: "#7a84a0", fontSize: 14 }}>Загрузка...</p>
      ) : (
        <>
          {/* Stats */}
          <div style={s.statsGrid}>
            {[
              { label: "Всего клиентов", value: clients.length },
              { label: "Активные проекты", value: activeCount },
              { label: "Ожидают ответа", value: pendingCount },
              { label: "Общий бюджет", value: fmt(totalBudget) },
              { label: "Получено", value: fmt(totalPaid) },
              { label: "Осталось получить", value: fmt(totalBudget - totalPaid) },
            ].map(({ label, value }) => (
              <div key={label} style={s.statCard}>
                <div style={s.statLabel}>{label}</div>
                <div style={s.statValue}>{value}</div>
              </div>
            ))}
          </div>

          {/* Status breakdown */}
          <div style={s.section}>
            <div style={s.sectionTitle}>По статусам</div>
            <div style={s.statusRow}>
              {byStatus.map(([status, count]) => (
                <div key={status} style={{ ...s.statusPill, ...STATUS_COLOR[status] }}>
                  {STATUS_LABEL[status] || status} — {count}
                </div>
              ))}
            </div>
          </div>

          {/* Recent clients */}
          <div style={s.section}>
            <div style={s.sectionTitle}>Последние клиенты</div>
            <div style={s.recentList}>
              {recent.map(c => (
                <div
                  key={c.id}
                  style={s.recentItem}
                  onClick={() => navigate(`/clients/${c.id}`)}
                >
                  <div style={s.avatar}>{c.name[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={s.recentName}>{c.name}</div>
                    <div style={s.recentMeta}>{c.company} · {c.service}</div>
                  </div>
                  <div style={{ ...s.statusDot, ...STATUS_COLOR[c.status] }}>
                    {STATUS_LABEL[c.status] || c.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button style={s.btnPrimary} onClick={() => navigate("/clients")}>
              Все клиенты →
            </button>
            <button style={s.btnSecondary} onClick={() => navigate("/admin")}>
              Admin Panel
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const s = {
  page: { maxWidth: 860, margin: "0 auto", padding: "52px 28px 60px" },
  tag: { fontFamily: "monospace", fontSize: 11, color: "#4f8ef7", letterSpacing: "0.15em", marginBottom: 14 },
  title: { fontSize: 42, fontWeight: 300, lineHeight: 1.15, marginBottom: 14, letterSpacing: "-0.02em", color: "#e4e8f0" },
  sub: { color: "#7a84a0", fontSize: 15, lineHeight: 1.7, marginBottom: 36 },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 36 },
  statCard: { background: "#13161e", border: "1px solid #1e2230", borderRadius: 12, padding: "18px 20px" },
  statLabel: { fontSize: 11, color: "#7a84a0", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 },
  statValue: { fontFamily: "monospace", fontSize: 22, fontWeight: 600, color: "#e4e8f0" },
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 11, color: "#7a84a0", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 },
  statusRow: { display: "flex", gap: 8, flexWrap: "wrap" },
  statusPill: { fontSize: 12, fontWeight: 500, padding: "4px 12px", borderRadius: 20 },
  recentList: { display: "flex", flexDirection: "column", gap: 8 },
  recentItem: {
    background: "#13161e",
    border: "1px solid #1e2230",
    borderRadius: 10,
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    cursor: "pointer",
    transition: "border-color 0.15s",
  },
  avatar: {
    width: 36, height: 36, borderRadius: "50%",
    background: "rgba(79,142,247,0.12)", color: "#4f8ef7",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 600, fontSize: 14, flexShrink: 0,
  },
  recentName: { fontSize: 14, fontWeight: 500, color: "#e4e8f0", marginBottom: 2 },
  recentMeta: { fontSize: 12, color: "#7a84a0" },
  statusDot: { fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap" },
  btnPrimary: {
    background: "#4f8ef7", color: "#fff", border: "none",
    borderRadius: 8, padding: "10px 22px", fontSize: 14,
    fontWeight: 500, cursor: "pointer",
  },
  btnSecondary: {
    background: "transparent", color: "#7a84a0",
    border: "1px solid #1e2230",
    borderRadius: 8, padding: "10px 22px", fontSize: 14,
    fontWeight: 500, cursor: "pointer",
  },
};