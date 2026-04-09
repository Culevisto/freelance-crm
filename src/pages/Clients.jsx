import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchClients } from "../api/api";

const STATUS_COLOR = {
  active:    { bg: "rgba(29,158,117,0.12)",  color: "#1D9E75" },
  pending:   { bg: "rgba(186,117,23,0.12)",  color: "#BA7517" },
  completed: { bg: "rgba(79,142,247,0.12)",  color: "#4f8ef7" },
  paused:    { bg: "rgba(122,132,160,0.12)", color: "#7a84a0" },
};
const STATUS_LABEL = { active: "Активный", pending: "Ожидание", completed: "Завершён", paused: "Пауза" };

export default function Clients() {
  const [all, setAll] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients().then(setAll).finally(() => setLoading(false));
  }, []);

  const filtered = all.filter(c => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const fmt = (n) => n.toLocaleString("ru-RU") + " ₽";
  const pct = (paid, budget) => budget > 0 ? Math.round((paid / budget) * 100) : 0;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2 style={s.title}>Клиенты</h2>
        <span style={s.badge}>{filtered.length} из {all.length}</span>
      </div>

      {/* Toolbar */}
      <div style={s.toolbar}>
        <div style={s.searchWrap}>
          <span style={s.searchIcon}>⌕</span>
          <input
            style={s.search}
            placeholder="Поиск по имени, компании, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={s.filters}>
          {["all", "active", "pending", "paused", "completed"].map(st => (
            <button
              key={st}
              style={{ ...s.filterBtn, ...(statusFilter === st ? s.filterActive : {}) }}
              onClick={() => setStatusFilter(st)}
            >
              {st === "all" ? "Все" : STATUS_LABEL[st]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={{ color: "#7a84a0", fontSize: 14, marginTop: 24 }}>Загрузка...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: "#7a84a0", fontSize: 14, marginTop: 24 }}>Ничего не найдено</p>
      ) : (
        <div style={s.list}>
          {filtered.map(c => {
            const p = pct(c.paid, c.budget);
            const sc = STATUS_COLOR[c.status] || STATUS_COLOR.paused;
            return (
              <div
                key={c.id}
                style={s.card}
                onClick={() => navigate(`/clients/${c.id}`)}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#4f8ef7"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#1e2230"}
              >
                <div style={s.cardTop}>
                  <div style={s.avatar}>{c.name[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={s.name}>{c.name}</div>
                    <div style={s.meta}>{c.company} · {c.service}</div>
                  </div>
                  <div style={{ ...s.statusPill, ...sc }}>
                    {STATUS_LABEL[c.status] || c.status}
                  </div>
                </div>

                <div style={s.cardMid}>
                  <div style={s.metaItem}>
                    <span style={s.metaLabel}>Бюджет</span>
                    <span style={s.metaVal}>{fmt(c.budget)}</span>
                  </div>
                  <div style={s.metaItem}>
                    <span style={s.metaLabel}>Получено</span>
                    <span style={{ ...s.metaVal, color: "#1D9E75" }}>{fmt(c.paid)}</span>
                  </div>
                  <div style={s.metaItem}>
                    <span style={s.metaLabel}>Дедлайн</span>
                    <span style={s.metaVal}>{c.deadline}</span>
                  </div>
                  <div style={s.metaItem}>
                    <span style={s.metaLabel}>План</span>
                    <span style={s.metaVal}>{c.plan}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={s.progressWrap}>
                  <div style={s.progressBg}>
                    <div style={{ ...s.progressFill, width: `${p}%` }} />
                  </div>
                  <span style={s.progressLabel}>{p}% оплачено</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const s = {
  page: { maxWidth: 900, margin: "0 auto", padding: "36px 28px 60px" },
  header: { display: "flex", alignItems: "center", gap: 14, marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 600, color: "#e4e8f0", letterSpacing: "-0.02em" },
  badge: { fontFamily: "monospace", fontSize: 11, color: "#7a84a0", background: "#13161e", border: "1px solid #1e2230", padding: "3px 10px", borderRadius: 20 },
  toolbar: { display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" },
  searchWrap: { flex: 1, minWidth: 200, background: "#13161e", border: "1px solid #1e2230", borderRadius: 8, padding: "0 12px", display: "flex", alignItems: "center", gap: 8, height: 38 },
  searchIcon: { color: "#7a84a0", fontSize: 16 },
  search: { flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 13, color: "#e4e8f0", fontFamily: "inherit" },
  filters: { display: "flex", gap: 4 },
  filterBtn: { background: "transparent", border: "1px solid #1e2230", borderRadius: 7, padding: "6px 12px", fontSize: 12, color: "#7a84a0", cursor: "pointer", transition: "all 0.15s" },
  filterActive: { borderColor: "#4f8ef7", color: "#4f8ef7", background: "rgba(79,142,247,0.08)" },
  list: { display: "flex", flexDirection: "column", gap: 10 },
  card: { background: "#13161e", border: "1px solid #1e2230", borderRadius: 12, padding: "16px 20px", cursor: "pointer", transition: "border-color 0.15s" },
  cardTop: { display: "flex", alignItems: "center", gap: 12, marginBottom: 14 },
  avatar: { width: 38, height: 38, borderRadius: "50%", background: "rgba(79,142,247,0.12)", color: "#4f8ef7", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 15, flexShrink: 0 },
  name: { fontSize: 14, fontWeight: 500, color: "#e4e8f0", marginBottom: 2 },
  meta: { fontSize: 12, color: "#7a84a0" },
  statusPill: { fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap" },
  cardMid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 14 },
  metaItem: { display: "flex", flexDirection: "column", gap: 3 },
  metaLabel: { fontSize: 10, color: "#7a84a0", textTransform: "uppercase", letterSpacing: "0.07em" },
  metaVal: { fontSize: 13, fontWeight: 500, color: "#e4e8f0", fontFamily: "monospace" },
  progressWrap: { display: "flex", alignItems: "center", gap: 10 },
  progressBg: { flex: 1, height: 4, background: "#1e2230", borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", background: "#1D9E75", borderRadius: 4, transition: "width 0.4s" },
  progressLabel: { fontSize: 11, color: "#7a84a0", fontFamily: "monospace", whiteSpace: "nowrap" },
};