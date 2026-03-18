import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Plus, Calendar, Clock, User, Scissors, Phone, Mail, Trash2, Check, X, Edit2, Search } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Appointment = Tables<"appointments">;

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendiente", color: "bg-yellow-500/20 text-yellow-400" },
  confirmed: { label: "Confirmada", color: "bg-blue-500/20 text-blue-400" },
  completed: { label: "Completada", color: "bg-green-500/20 text-green-400" },
  cancelled: { label: "Cancelada", color: "bg-red-500/20 text-red-400" },
};

const barbers = ["Camilo", "Kimy", "Bryan", "Víctor"];

const Admin = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [barberFilter, setBarberFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const navigate = useNavigate();

  // New appointment form state
  const [form, setForm] = useState({
    client_name: "",
    client_phone: "",
    client_email: "",
    service: "",
    barber: "",
    appointment_date: "",
    appointment_time: "",
    notes: "",
  });

  useEffect(() => {
    checkAuth();
    fetchAppointments();

    const channel = supabase
      .channel("appointments-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "appointments" }, () => {
        fetchAppointments();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/admin-login");
      return;
    }
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) {
      await supabase.auth.signOut();
      navigate("/admin-login");
    }
  };

  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error cargando citas");
    } else {
      setAppointments(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id);

    if (error) toast.error("Error actualizando estado");
    else toast.success("Estado actualizado");
  };

  const deleteAppointment = async (id: string) => {
    if (!confirm("¿Eliminar esta cita?")) return;
    const { error } = await supabase.from("appointments").delete().eq("id", id);
    if (error) toast.error("Error eliminando");
    else toast.success("Cita eliminada");
  };

  const createAppointment = async () => {
    if (!form.client_name || !form.client_phone || !form.service || !form.barber || !form.appointment_date || !form.appointment_time) {
      toast.error("Rellena los campos obligatorios");
      return;
    }
    const { error } = await supabase.from("appointments").insert(form);
    if (error) toast.error("Error creando cita");
    else {
      toast.success("Cita creada");
      setShowCreate(false);
      setForm({ client_name: "", client_phone: "", client_email: "", service: "", barber: "", appointment_date: "", appointment_time: "", notes: "" });
    }
  };

  const saveEdit = async (id: string) => {
    const { error } = await supabase
      .from("appointments")
      .update(form)
      .eq("id", id);

    if (error) toast.error("Error guardando");
    else {
      toast.success("Cita actualizada");
      setEditingId(null);
    }
  };

  const startEdit = (appt: Appointment) => {
    setEditingId(appt.id);
    setForm({
      client_name: appt.client_name,
      client_phone: appt.client_phone,
      client_email: appt.client_email || "",
      service: appt.service,
      barber: appt.barber,
      appointment_date: appt.appointment_date,
      appointment_time: appt.appointment_time,
      notes: appt.notes || "",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  const filtered = appointments.filter((a) => {
    if (filter !== "all" && a.status !== filter) return false;
    if (barberFilter !== "all" && a.barber !== barberFilter) return false;
    if (search && !a.client_name.toLowerCase().includes(search.toLowerCase()) && !a.client_phone.includes(search)) return false;
    return true;
  });

  const counts = {
    all: appointments.length,
    pending: appointments.filter((a) => a.status === "pending").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-4 md:px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl gold-gradient-text">Panel de Control</h1>
          <p className="text-sm text-muted-foreground">Kings Barber Shop</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setShowCreate(true); setEditingId(null); setForm({ client_name: "", client_phone: "", client_email: "", service: "", barber: "", appointment_date: "", appointment_time: "", notes: "" }); }}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold text-sm hover:brightness-110 transition-all"
          >
            <Plus className="w-4 h-4" /> Nueva Cita
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm border border-border px-3 py-2 rounded-lg">
            <LogOut className="w-4 h-4" /> Salir
          </button>
        </div>
      </header>

      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {(["all", "pending", "confirmed", "completed", "cancelled"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`card-elevated p-4 text-center transition-all ${filter === key ? "border-primary/60" : ""}`}
            >
              <p className="text-2xl font-bold text-foreground">{counts[key]}</p>
              <p className="text-xs text-muted-foreground">{key === "all" ? "Todas" : statusLabels[key].label}</p>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-2 text-foreground text-sm focus:outline-none focus:border-primary"
              placeholder="Buscar por nombre o teléfono..."
            />
          </div>
          <select
            value={barberFilter}
            onChange={(e) => setBarberFilter(e.target.value)}
            className="bg-muted border border-border rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:border-primary"
          >
            <option value="all">Todos los barberos</option>
            {barbers.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        {/* Create / Edit Modal */}
        {(showCreate || editingId) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => { setShowCreate(false); setEditingId(null); }}>
            <div className="card-elevated w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h3 className="font-display text-xl text-foreground mb-4">{editingId ? "Editar Cita" : "Nueva Cita"}</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Nombre *</label>
                  <input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Teléfono *</label>
                  <input value={form.client_phone} onChange={(e) => setForm({ ...form, client_phone: e.target.value })} className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Email</label>
                  <input value={form.client_email} onChange={(e) => setForm({ ...form, client_email: e.target.value })} className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Servicio *</label>
                  <input value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Barbero *</label>
                  <select value={form.barber} onChange={(e) => setForm({ ...form, barber: e.target.value })} className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-primary">
                    <option value="">Seleccionar...</option>
                    {barbers.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Fecha *</label>
                    <input type="date" value={form.appointment_date} onChange={(e) => setForm({ ...form, appointment_date: e.target.value })} className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Hora *</label>
                    <input type="time" value={form.appointment_time} onChange={(e) => setForm({ ...form, appointment_time: e.target.value })} className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Notas</label>
                  <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-primary" rows={2} />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => { setShowCreate(false); setEditingId(null); }} className="flex-1 border border-border text-muted-foreground py-2 rounded-lg text-sm hover:text-foreground transition-colors">Cancelar</button>
                <button onClick={() => editingId ? saveEdit(editingId) : createAppointment()} className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-semibold text-sm hover:brightness-110 transition-all">
                  {editingId ? "Guardar" : "Crear Cita"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Appointments List */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Cargando citas...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No hay citas{filter !== "all" ? ` con estado "${statusLabels[filter]?.label}"` : ""}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((appt) => (
              <div key={appt.id} className="card-elevated p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-foreground">{appt.client_name}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusLabels[appt.status]?.color}`}>
                        {statusLabels[appt.status]?.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Scissors className="w-3 h-3" /> {appt.service}</span>
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {appt.barber}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {appt.appointment_date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {appt.appointment_time}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {appt.client_phone}</span>
                      {appt.client_email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {appt.client_email}</span>}
                    </div>
                    {appt.notes && <p className="text-xs text-muted-foreground mt-1 italic">📝 {appt.notes}</p>}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {appt.status === "pending" && (
                      <button onClick={() => updateStatus(appt.id, "confirmed")} className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors" title="Confirmar">
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    {(appt.status === "pending" || appt.status === "confirmed") && (
                      <button onClick={() => updateStatus(appt.id, "completed")} className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors" title="Completar">
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    {appt.status !== "cancelled" && appt.status !== "completed" && (
                      <button onClick={() => updateStatus(appt.id, "cancelled")} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors" title="Cancelar">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => startEdit(appt)} className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Editar">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteAppointment(appt.id)} className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-destructive transition-colors" title="Eliminar">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
