import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchClient, fetchInteractions, createInteraction, deleteInteraction, updateClient } from "../api/api";

const STATUS_COLOR = {
  active:    { bg: "rgba(29,158,117,0.12)",  color: "#1D9E75" },
  pending:   { bg: "rgba(186,117,23,0.12)",  color: "#BA7517" },
  completed: { bg: "rgba(79,142,247,0.12)",  color: "#4f8ef7" },
  paused:    { bg: "rgba(122,132,160,0.12)", color: "#7a84a0" },
};
const STATUS_LABEL = { active: "Активный", pending: "Ожидание", completed: "Завершён", paused: "Пауза" };

const INTERACTION_ICONS = { call: "📞", email: "✉️", meeting: "🤝", payment: "💰", note: "📝" };
const INTERACTION_LABELS = { call: "Звонок", email: "Email", meeting: "Встреча", payment: "Оплата", note: "Заметка" };

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState("note");
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    Promise.all([fetchClient(id), fetchInteractions(id)])
      .then(([c, i]) => { setClient(c); setInteractions(i); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddInteraction = async () => {
  if (!newNote.trim()) return;
  setAddingNote(true);

  // если тип "payment" — парсим сумму из текста и обновляем paid
  if (noteType === "payment") {
    const match = newNote.match(/(\d[\d\s]*)/);
    if (match) {
      const amount = parseInt(match[1].replace(/\s/g, ""), 10);
      if (amount > 0) {
        const newPaid = (client.paid || 0) + amount;
        const updated = await updateClient(id, { paid: newPaid });
        setClient(updated);
      }
    }
  }

  const created = await createInteraction({ clientId: Number(id), type: noteType, text: newNote });
  setInteractions(prev => [created, ...prev]);
  setNewNote("");
  setAddingNote(false);
};

  const handleDeleteInteraction = async (intId) => {
    await deleteInteraction(intId);
    setInteractions(prev => prev.filter(i => i.id !== intId));
  };

  const handleStatusChange = async (newStatus) => {
    const updated = await updateClient(id, { status: newStatus });
    setClient(updated);
  };

  if (loading) return <p style={{ padding: 40, color: "#7a84a0" }}>Загрузка...</p>;
  if (!client) return <p style={{ padding: 40, color: "#e87979" }}>Клиент не найден</p>;

  const fmt = (n) => (n || 0).toLocaleString("ru-RU") + " ₽";
  const pct = client.budget > 0 ? Math.round((client.paid / client.budget) * 100) : 0;
  const sc = STATUS_COLOR[client.status] || STATUS_COLOR.paused;

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate("/clients")}>← Назад к клиентам</button>

      <div style={s.grid}>
        {/* LEFT: client info */}
        <div style={s.left}>
          {/* Header card */}
          <div style={s.card}>
            <div style={s.clientHead}>
              <div style={s.bigAvatar}>{client.name[0]}</div>
              <div>
                <div style={s.clientName}>{client.name}</div>
                <div style={s.clientCompany}>{client.company}</div>
                <div style={{ ...s.statusPill, ...sc, marginTop: 8, display: "inline-block" }}>
                  {STATUS_LABEL[client.status]}
                </div>
              </div>
            </div>

            <div style={s.divider} />

            <div style={s.infoGrid}>
              {[
                ["Email", client.email],
                ["Телефон", client.phone],
                ["Услуга", client.service],
                ["Тариф", client.plan],
                ["Создан", client.createdAt],
                ["Дедлайн", client.deadline],
              ].map(([label, val]) => (
                <div key={label} style={s.infoRow}>
                  <span style={s.infoLabel}>{label}</span>
                  <span style={s.infoVal}>{val}</span>
                </div>
              ))}
            </div>

            {client.notes && (
              <>
                <div style={s.divider} />
                <div style={s.notesBox}>
                  <div style={s.notesLabel}>Заметки</div>
                  <p style={s.notesText}>{client.notes}</p>
                </div>
              </>
            )}
          </div>

          {/* Finance card */}
          <div style={s.card}>
            <div style={s.cardTitle}>Финансы</div>
            <div style={s.financeGrid}>
              <div style={s.finCard}>
                <div style={s.finLabel}>Бюджет</div>
                <div style={s.finVal}>{fmt(client.budget)}</div>
              </div>
              <div style={s.finCard}>
                <div style={s.finLabel}>Получено</div>
                <div style={{ ...s.finVal, color: "#1D9E75" }}>{fmt(client.paid)}</div>
              </div>
              <div style={s.finCard}>
                <div style={s.finLabel}>Осталось</div>
                <div style={{ ...s.finVal, color: "#BA7517" }}>{fmt(client.budget - client.paid)}</div>
              </div>
            </div>
            <div style={s.progressWrap}>
              <div style={s.progressBg}>
                <div style={{ ...s.progressFill, width: `${pct}%` }} />
              </div>
              <span style={s.progressLabel}>{pct}%</span>
            </div>
          </div>

          {/* Status changer */}
          <div style={s.card}>
            <div style={s.cardTitle}>Изменить статус</div>
            <div style={s.statusBtns}>
              {["active", "pending", "paused", "completed"].map(st => (
                <button
                  key={st}
                  style={{
                    ...s.statusBtn,
                    ...(client.status === st ? { ...STATUS_COLOR[st], border: "none" } : {}),
                  }}
                  onClick={() => handleStatusChange(st)}
                >
                  {STATUS_LABEL[st]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: interactions */}
        <div style={s.right}>
          <div style={s.card}>
            <div style={s.cardTitle}>История взаимодействий</div>

            {/* Add interaction */}
            <div style={s.addBox}>
              <div style={s.typeRow}>
                {Object.entries(INTERACTION_LABELS).map(([type, label]) => (
                  <button
                    key={type}
                    style={{ ...s.typeBtn, ...(noteType === type ? s.typeBtnActive : {}) }}
                    onClick={() => setNoteType(type)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <textarea
                style={s.textarea}
                placeholder="Описание взаимодействия..."
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                rows={3}
              />
              <button
                style={s.addBtn}
                onClick={handleAddInteraction}
                disabled={addingNote || !newNote.trim()}
              >
                {addingNote ? "Добавляю..." : "Добавить запись"}
              </button>
            </div>

            {/* List */}
            <div style={s.interList}>
              {interactions.length === 0 ? (
                <p style={{ color: "#7a84a0", fontSize: 13 }}>Пока нет записей</p>
              ) : (
                interactions.map(item => (
                  <div key={item.id} style={s.interItem}>
                    <div style={s.interIcon}>
                      <span style={{ fontSize: 14 }}>{INTERACTION_ICONS[item.type] || "📝"}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={s.interType}>{INTERACTION_LABELS[item.type] || item.type}</div>
                      <div style={s.interText}>{item.text}</div>
                      <div style={s.interDate}>{item.date}</div>
                    </div>
                    <button
                      style={s.deleteBtn}
                      onClick={() => handleDeleteInteraction(item.id)}
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { maxWidth: 1100, margin: "0 auto", padding: "32px 28px 60px" },
  back: { background: "none", border: "none", color: "#7a84a0", fontSize: 13, cursor: "pointer", marginBottom: 28, padding: 0 },
  grid: { display: "grid", gridTemplateColumns: "340px 1fr", gap: 20, alignItems: "start" },
  left: { display: "flex", flexDirection: "column", gap: 14 },
  right: {},
  card: { background: "#13161e", border: "1px solid #1e2230", borderRadius: 14, padding: "20px 22px" },
  cardTitle: { fontSize: 12, fontWeight: 600, color: "#7a84a0", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 },
  clientHead: { display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 18 },
  bigAvatar: { width: 52, height: 52, borderRadius: "50%", background: "rgba(79,142,247,0.12)", color: "#4f8ef7", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 20, flexShrink: 0 },
  clientName: { fontSize: 18, fontWeight: 600, color: "#e4e8f0", marginBottom: 4 },
  clientCompany: { fontSize: 13, color: "#7a84a0" },
  statusPill: { fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 20 },
  divider: { height: 1, background: "#1e2230", margin: "16px 0" },
  infoGrid: { display: "flex", flexDirection: "column", gap: 10 },
  infoRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  infoLabel: { fontSize: 12, color: "#7a84a0" },
  infoVal: { fontSize: 13, color: "#e4e8f0", fontWeight: 500, fontFamily: "monospace", textAlign: "right", maxWidth: 180, wordBreak: "break-all" },
  notesBox: {},
  notesLabel: { fontSize: 11, color: "#7a84a0", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 },
  notesText: { fontSize: 13, color: "#b0b8cc", lineHeight: 1.6 },
  financeGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 14 },
  finCard: { background: "#0f1117", borderRadius: 8, padding: "12px 14px" },
  finLabel: { fontSize: 10, color: "#7a84a0", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 },
  finVal: { fontFamily: "monospace", fontSize: 14, fontWeight: 600, color: "#e4e8f0" },
  progressWrap: { display: "flex", alignItems: "center", gap: 10 },
  progressBg: { flex: 1, height: 5, background: "#1e2230", borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", background: "#1D9E75", borderRadius: 4 },
  progressLabel: { fontSize: 12, color: "#7a84a0", fontFamily: "monospace", minWidth: 32 },
  statusBtns: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  statusBtn: { background: "#0f1117", border: "1px solid #1e2230", borderRadius: 8, padding: "8px 0", fontSize: 12, color: "#7a84a0", cursor: "pointer", transition: "all 0.15s" },
  addBox: { background: "#0f1117", borderRadius: 10, padding: "14px 16px", marginBottom: 20 },
  typeRow: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 },
  typeBtn: { background: "transparent", border: "1px solid #1e2230", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "#7a84a0", cursor: "pointer" },
  typeBtnActive: { borderColor: "#4f8ef7", color: "#4f8ef7", background: "rgba(79,142,247,0.08)" },
  textarea: { width: "100%", background: "#13161e", border: "1px solid #1e2230", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#e4e8f0", fontFamily: "inherit", resize: "vertical", outline: "none", marginBottom: 10, boxSizing: "border-box" },
  addBtn: { background: "#4f8ef7", color: "#fff", border: "none", borderRadius: 7, padding: "8px 18px", fontSize: 13, fontWeight: 500, cursor: "pointer" },
  interList: { display: "flex", flexDirection: "column", gap: 10 },
  interItem: { display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 0", borderBottom: "1px solid #1e2230" },
  interIcon: { width: 32, height: 32, borderRadius: 8, background: "#0f1117", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  interType: { fontSize: 11, fontWeight: 600, color: "#4f8ef7", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 },
  interText: { fontSize: 13, color: "#b0b8cc", lineHeight: 1.5, marginBottom: 4 },
  interDate: { fontSize: 11, color: "#7a84a0", fontFamily: "monospace" },
  deleteBtn: { background: "none", border: "none", color: "#7a84a0", fontSize: 18, cursor: "pointer", padding: "0 4px", lineHeight: 1 },
};