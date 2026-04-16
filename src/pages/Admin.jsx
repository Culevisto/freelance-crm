import { useEffect, useState } from "react";
import { fetchClients, createClient, updateClient, deleteClient } from "../api/api";

const STATUSES = ["active", "pending", "paused", "completed"];
const STATUS_LABEL = { active: "Активный", pending: "Ожидание", completed: "Завершён", paused: "Пауза" };
const STATUS_COLOR = {
  active:    { bg: "rgba(29,158,117,0.12)",  color: "#1D9E75" },
  pending:   { bg: "rgba(186,117,23,0.12)",  color: "#BA7517" },
  completed: { bg: "rgba(79,142,247,0.12)",  color: "#4f8ef7" },
  paused:    { bg: "rgba(122,132,160,0.12)", color: "#7a84a0" },
};
const SERVICES = ["Web Development", "UI/UX Design", "Mobile App", "SEO & Marketing", "Consulting"];
const PLANS = ["Basic", "Pro", "Enterprise"];

const EMPTY_FORM = { name: "", email: "", company: "", phone: "", service: "Web Development", plan: "Basic", status: "pending", budget: "", deadline: "", notes: "" };

export default function Admin() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "create" | "edit" | "delete"
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchClients().then(setClients).finally(() => setLoading(false));
  }, []);

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setForm(EMPTY_FORM); setSelected(null); setModal("create"); };
  const openEdit = (c) => { setForm({ ...c, budget: String(c.budget) }); setSelected(c); setModal("edit"); };
  const openDelete = (c) => { setSelected(c); setModal("delete"); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) return;
    setSaving(true);
    const payload = { ...form, budget: Number(form.budget) || 0 };
    if (modal === "create") {
      const created = await createClient(payload);
      setClients(prev => [...prev, created]);
    } else {
      const updated = await updateClient(selected.id, payload);
      setClients(prev => prev.map(c => c.id === updated.id ? updated : c));
    }
    setSaving(false);
    closeModal();
  };

  const handleDelete = async () => {
    await deleteClient(selected.id);
    setClients(prev => prev.filter(c => c.id !== selected.id));
    closeModal();
  };

  const fmt = (n) => (n || 0).toLocaleString("ru-RU") + " ₽";
  const totalBudget = clients.reduce((s, c) => s + (c.budget || 0), 0);
  const totalPaid = clients.reduce((s, c) => s + (c.paid || 0), 0);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Admin Panel</h2>
          <p style={s.subtitle}>Управление клиентами и проектами</p>
        </div>
        <button style={s.btnCreate} onClick={openCreate}>+ Новый клиент</button>
      </div>

      {/* Summary */}
      <div style={s.summaryRow}>
        {[
          ["Клиентов", clients.length],
          ["Активных", clients.filter(c => c.status === "active").length],
          ["Общий бюджет", fmt(totalBudget)],
          ["Получено", fmt(totalPaid)],
        ].map(([label, val]) => (
          <div key={label} style={s.sumCard}>
            <div style={s.sumLabel}>{label}</div>
            <div style={s.sumVal}>{val}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={s.searchWrap}>
        <span style={{ color: "#7a84a0", fontSize: 16 }}>⌕</span>
        <input
          style={s.searchInput}
          placeholder="Поиск..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <span style={s.countBadge}>{filtered.length}</span>
      </div>

      {/* Table */}
      {loading ? (
        <p style={{ color: "#7a84a0", fontSize: 14, marginTop: 20 }}>Загрузка...</p>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                {["ID", "Клиент", "Компания", "Услуга", "Тариф", "Статус", "Бюджет", "Оплачено", "Дедлайн", ""].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const sc = STATUS_COLOR[c.status] || STATUS_COLOR.paused;
                return (
                  <tr key={c.id} style={s.tr} onMouseEnter={e => e.currentTarget.style.background = "#0f1117"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ ...s.td, fontFamily: "monospace", color: "#4f8ef7" }}>#{c.id}</td>
                    <td style={s.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={s.miniAvatar}>{c.name[0]}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: "#e4e8f0" }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: "#7a84a0" }}>{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={s.td}>{c.company}</td>
                    <td style={s.td}>{c.service}</td>
                    <td style={s.td}>{c.plan}</td>
                    <td style={s.td}>
                      <span style={{ ...s.pill, ...sc }}>{STATUS_LABEL[c.status]}</span>
                    </td>
                    <td style={{ ...s.td, fontFamily: "monospace" }}>{fmt(c.budget)}</td>
                    <td style={{ ...s.td, fontFamily: "monospace", color: "#1D9E75" }}>{fmt(c.paid)}</td>
                    <td style={{ ...s.td, fontFamily: "monospace" }}>{c.deadline}</td>
                    <td style={s.td}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button style={s.editBtn} onClick={() => openEdit(c)}>Ред.</button>
                        <button style={s.delBtn} onClick={() => openDelete(c)}>Удл.</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {modal && (
        <div style={s.overlay} onClick={e => e.target === e.currentTarget && closeModal()}>
          <div style={s.modalBox}>
            {modal === "delete" ? (
              <>
                <div style={s.modalTitle}>Удалить клиента?</div>
                <p style={{ fontSize: 14, color: "#b0b8cc", marginBottom: 24 }}>
                  Вы уверены, что хотите удалить <strong style={{ color: "#e4e8f0" }}>{selected?.name}</strong>?
                  Это действие нельзя отменить.
                </p>
                <div style={s.modalFooter}>
                  <button style={s.btnCancel} onClick={closeModal}>Отмена</button>
                  <button style={s.btnDanger} onClick={handleDelete}>Удалить</button>
                </div>
              </>
            ) : (
              <>
                <div style={s.modalTitle}>{modal === "create" ? "Новый клиент" : "Редактировать клиента"}</div>
                <div style={s.formGrid}>
                  {[
                    ["name", "Имя *", "text"],
                    ["email", "Email *", "email"],
                    ["company", "Компания", "text"],
                    ["phone", "Телефон", "text"],
                    ["budget", "Бюджет (₽)", "number"],
                    ["deadline", "Дедлайн", "date"],
                  ].map(([key, label, type]) => (
                    <div key={key} style={s.fieldWrap}>
                      <label style={s.label}>{label}</label>
                      <input
                        type={type}
                        style={s.input}
                        value={form[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      />
                    </div>
                  ))}
                  <div style={s.fieldWrap}>
                    <label style={s.label}>Услуга</label>
                    <select style={s.select} value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}>
                      {SERVICES.map(sv => <option key={sv}>{sv}</option>)}
                    </select>
                  </div>
                  <div style={s.fieldWrap}>
                    <label style={s.label}>Тариф</label>
                    <select style={s.select} value={form.plan} onChange={e => setForm(f => ({ ...f, plan: e.target.value }))}>
                      {PLANS.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div style={s.fieldWrap}>
                    <label style={s.label}>Статус</label>
                    <select style={s.select} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                      {STATUSES.map(st => <option key={st} value={st}>{STATUS_LABEL[st]}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <label style={s.label}>Заметки</label>
                  <textarea
                    style={s.textarea}
                    rows={3}
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  />
                </div>
                <div style={s.modalFooter}>
                  <button style={s.btnCancel} onClick={closeModal}>Отмена</button>
                  <button style={s.btnSave} onClick={handleSave} disabled={saving}>
                    {saving ? "Сохраняю..." : modal === "create" ? "Создать" : "Сохранить"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { maxWidth: 1200, margin: "0 auto", padding: "36px 28px 60px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 },
  title: { fontSize: 24, fontWeight: 600, color: "#e4e8f0", marginBottom: 4 },
  subtitle: { fontSize: 13, color: "#7a84a0" },
  btnCreate: { background: "#4f8ef7", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  summaryRow: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 },
  sumCard: { background: "#13161e", border: "1px solid #1e2230", borderRadius: 10, padding: "14px 18px" },
  sumLabel: { fontSize: 11, color: "#7a84a0", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 },
  sumVal: { fontFamily: "monospace", fontSize: 20, fontWeight: 600, color: "#e4e8f0" },
  searchWrap: { background: "#13161e", border: "1px solid #1e2230", borderRadius: 8, padding: "0 14px", display: "flex", alignItems: "center", gap: 10, height: 40, marginBottom: 16 },
  searchInput: { flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 13, color: "#e4e8f0", fontFamily: "inherit" },
  countBadge: { fontFamily: "monospace", fontSize: 11, color: "#7a84a0" },
  tableWrap: { overflowX: "auto", background: "#13161e", border: "1px solid #1e2230", borderRadius: 12 },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { fontSize: 10, fontWeight: 600, color: "#7a84a0", textTransform: "uppercase", letterSpacing: "0.08em", padding: "12px 14px", textAlign: "left", borderBottom: "1px solid #1e2230", whiteSpace: "nowrap" },
  tr: { transition: "background 0.1s", cursor: "default" },
  td: { fontSize: 13, color: "#b0b8cc", padding: "12px 14px", borderBottom: "1px solid #0f1117", whiteSpace: "nowrap" },
  pill: { fontSize: 11, fontWeight: 500, padding: "3px 9px", borderRadius: 20 },
  miniAvatar: { width: 28, height: 28, borderRadius: "50%", background: "rgba(79,142,247,0.12)", color: "#4f8ef7", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 12, flexShrink: 0 },
  editBtn: { background: "rgba(79,142,247,0.1)", border: "1px solid rgba(79,142,247,0.2)", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "#4f8ef7", cursor: "pointer" },
  delBtn: { background: "rgba(226,75,74,0.1)", border: "1px solid rgba(226,75,74,0.2)", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "#e24b4a", cursor: "pointer" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 },
  modalBox: { background: "#13161e", border: "1px solid #1e2230", borderRadius: 16, padding: "28px 32px", width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto" },
  modalTitle: { fontSize: 18, fontWeight: 600, color: "#e4e8f0", marginBottom: 20 },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  fieldWrap: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 11, color: "#7a84a0", textTransform: "uppercase", letterSpacing: "0.07em" },
  input: { background: "#0f1117", border: "1px solid #1e2230", borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#e4e8f0", fontFamily: "inherit", outline: "none" },
  select: { background: "#0f1117", border: "1px solid #1e2230", borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#e4e8f0", fontFamily: "inherit", outline: "none" },
  textarea: { width: "100%", background: "#0f1117", border: "1px solid #1e2230", borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#e4e8f0", fontFamily: "inherit", outline: "none", boxSizing: "border-box", resize: "vertical" },
  modalFooter: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 },
  btnCancel: { background: "transparent", border: "1px solid #1e2230", borderRadius: 8, padding: "9px 20px", fontSize: 13, color: "#7a84a0", cursor: "pointer" },
  btnSave: { background: "#4f8ef7", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  btnDanger: { background: "#e24b4a", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
};