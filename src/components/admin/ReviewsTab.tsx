import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, Eye, EyeOff, Save, Star } from "lucide-react";

interface Review {
  id: string;
  name: string;
  review_date: string;
  text: string;
  barber: string;
  rating: number;
  is_visible: boolean;
}

const barbers = ["Camilo", "Kimy", "Bryan", "Víctor"];

interface ReviewsTabProps {
  addTrigger?: number;
}

const ReviewsTab = ({ addTrigger }: ReviewsTabProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", review_date: "", text: "", barber: "", rating: 5, is_visible: true });

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    setLoading(true);
    const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    setReviews((data as Review[]) || []);
    setLoading(false);
  };

  const resetForm = () => setForm({ name: "", review_date: "", text: "", barber: "", rating: 5, is_visible: true });

  const saveReview = async () => {
    if (!form.name || !form.text || !form.barber) { toast.error("Nombre, texto y barbero son obligatorios"); return; }
    const payload = { ...form, review_date: form.review_date || new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }) };
    if (editingId) {
      const { error } = await supabase.from("reviews").update(payload).eq("id", editingId);
      if (error) toast.error("Error guardando");
      else { toast.success("Reseña actualizada"); setShowForm(false); setEditingId(null); fetchReviews(); }
    } else {
      const { error } = await supabase.from("reviews").insert(payload);
      if (error) toast.error("Error creando");
      else { toast.success("Reseña creada"); setShowForm(false); fetchReviews(); }
    }
    resetForm();
  };

  const deleteReview = async (id: string) => {
    if (!confirm("¿Eliminar esta reseña?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) toast.error("Error eliminando");
    else { toast.success("Reseña eliminada"); fetchReviews(); }
  };

  const toggleVisibility = async (r: Review) => {
    const { error } = await supabase.from("reviews").update({ is_visible: !r.is_visible }).eq("id", r.id);
    if (error) toast.error("Error");
    else fetchReviews();
  };

  const startEdit = (r: Review) => {
    setEditingId(r.id);
    setForm({ name: r.name, review_date: r.review_date, text: r.text, barber: r.barber, rating: r.rating, is_visible: r.is_visible });
    setShowForm(true);
  };

  if (loading) return <div className="text-center py-12 text-muted-foreground">Cargando reseñas...</div>;

  return (
    <div>
      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => { setShowForm(false); setEditingId(null); }}>
          <div className="card-elevated w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-xl text-foreground mb-4">{editingId ? "Editar Reseña" : "Nueva Reseña"}</h3>
            <div className="space-y-3">
              <div><label className="text-xs text-muted-foreground">Nombre del cliente *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-primary" /></div>
              <div><label className="text-xs text-muted-foreground">Barbero *</label>
                <select value={form.barber} onChange={e => setForm({ ...form, barber: e.target.value })} className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-primary">
                  <option value="">Seleccionar...</option>
                  {barbers.map(b => <option key={b} value={b}>{b}</option>)}
                </select></div>
              <div><label className="text-xs text-muted-foreground">Texto *</label>
                <textarea value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-primary" rows={3} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground">Fecha</label>
                  <input value={form.review_date} onChange={e => setForm({ ...form, review_date: e.target.value })} className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-primary" placeholder="13 mar 2026" /></div>
                <div><label className="text-xs text-muted-foreground">Puntuación</label>
                  <select value={form.rating} onChange={e => setForm({ ...form, rating: parseInt(e.target.value) })} className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-primary">
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} ★</option>)}
                  </select></div>
              </div>
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input type="checkbox" checked={form.is_visible} onChange={e => setForm({ ...form, is_visible: e.target.checked })} className="accent-primary" />
                Visible en la web
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="flex-1 border border-border text-muted-foreground py-2 rounded-lg text-sm hover:text-foreground transition-colors">Cancelar</button>
              <button onClick={saveReview} className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-semibold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> {editingId ? "Guardar" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews list */}
      <div className="space-y-2">
        {reviews.map(r => (
          <div key={r.id} className={`card-elevated p-4 flex items-center justify-between ${!r.is_visible ? "opacity-50" : ""}`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-foreground text-sm">{r.name}</h4>
                <div className="flex">
                  {[...Array(r.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-primary text-primary" />)}
                </div>
                {!r.is_visible && <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Oculta</span>}
              </div>
              <p className="text-xs text-muted-foreground truncate">"{r.text}"</p>
              <p className="text-xs text-muted-foreground mt-0.5">Barbero: {r.barber} · {r.review_date}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-3">
              <button onClick={() => toggleVisibility(r)} className={`p-2 rounded-lg transition-colors ${r.is_visible ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`} title={r.is_visible ? "Ocultar" : "Mostrar"}>
                {r.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button onClick={() => startEdit(r)} className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => deleteReview(r.id)} className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsTab;
