import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, Plus, Trash2, Clock } from "lucide-react";

const barbers = ["Camilo", "Kimy", "Bryan", "Víctor"];
const dayNames = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

interface Schedule {
  id: string;
  barber_name: string;
  day_of_week: number;
  time_slots: string[];
  is_active: boolean;
}

const defaultSlots = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
];

const SchedulesTab = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedBarber, setSelectedBarber] = useState(barbers[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    const { data } = await supabase.from("barber_schedules").select("*").order("day_of_week");
    setSchedules((data as Schedule[]) || []);
    setLoading(false);
  };

  const barberSchedules = schedules.filter(s => s.barber_name === selectedBarber);

  const getScheduleForDay = (day: number) => barberSchedules.find(s => s.day_of_week === day);

  const toggleSlot = async (day: number, slot: string) => {
    const existing = getScheduleForDay(day);
    if (existing) {
      const newSlots = existing.time_slots.includes(slot)
        ? existing.time_slots.filter(s => s !== slot)
        : [...existing.time_slots, slot].sort();
      const { error } = await supabase.from("barber_schedules").update({ time_slots: newSlots }).eq("id", existing.id);
      if (error) toast.error("Error guardando");
      else fetchSchedules();
    } else {
      const { error } = await supabase.from("barber_schedules").insert({
        barber_name: selectedBarber, day_of_week: day, time_slots: [slot], is_active: true
      });
      if (error) toast.error("Error creando horario");
      else fetchSchedules();
    }
  };

  const toggleDayActive = async (day: number) => {
    const existing = getScheduleForDay(day);
    if (existing) {
      const { error } = await supabase.from("barber_schedules").update({ is_active: !existing.is_active }).eq("id", existing.id);
      if (error) toast.error("Error");
      else fetchSchedules();
    }
  };

  const setAllSlots = async (day: number) => {
    const existing = getScheduleForDay(day);
    if (existing) {
      const { error } = await supabase.from("barber_schedules").update({ time_slots: defaultSlots }).eq("id", existing.id);
      if (error) toast.error("Error");
      else { toast.success("Horario completo asignado"); fetchSchedules(); }
    } else {
      const { error } = await supabase.from("barber_schedules").insert({
        barber_name: selectedBarber, day_of_week: day, time_slots: defaultSlots, is_active: true
      });
      if (error) toast.error("Error");
      else { toast.success("Horario creado"); fetchSchedules(); }
    }
  };

  const clearSlots = async (day: number) => {
    const existing = getScheduleForDay(day);
    if (existing) {
      const { error } = await supabase.from("barber_schedules").update({ time_slots: [] }).eq("id", existing.id);
      if (error) toast.error("Error");
      else { toast.success("Horario vaciado"); fetchSchedules(); }
    }
  };

  if (loading) return <div className="text-center py-12 text-muted-foreground">Cargando horarios...</div>;

  return (
    <div>
      {/* Barber selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {barbers.map(b => (
          <button key={b} onClick={() => setSelectedBarber(b)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${selectedBarber === b ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            {b}
          </button>
        ))}
      </div>

      {/* Days grid */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6].map(day => {
          const schedule = getScheduleForDay(day);
          const isActive = schedule?.is_active ?? false;
          return (
            <div key={day} className={`card-elevated p-4 ${!isActive && schedule ? "opacity-50" : ""}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold text-foreground">{dayNames[day]}</h4>
                  {schedule && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                      {isActive ? "Activo" : "Inactivo"}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setAllSlots(day)} className="text-xs px-3 py-1 rounded bg-primary/20 text-primary hover:bg-primary/30 transition-colors">Todos</button>
                  <button onClick={() => clearSlots(day)} className="text-xs px-3 py-1 rounded bg-muted text-muted-foreground hover:text-foreground transition-colors">Limpiar</button>
                  {schedule && (
                    <button onClick={() => toggleDayActive(day)} className="text-xs px-3 py-1 rounded bg-muted text-muted-foreground hover:text-foreground transition-colors">
                      {isActive ? "Desactivar" : "Activar"}
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {defaultSlots.map(slot => {
                  const isSelected = schedule?.time_slots?.includes(slot) ?? false;
                  return (
                    <button key={slot} onClick={() => toggleSlot(day, slot)}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"}`}>
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SchedulesTab;
