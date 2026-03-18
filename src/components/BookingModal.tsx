import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { X, ChevronLeft, ChevronRight, Check, Calendar, Clock, User, Scissors } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
}

const services = [
  { name: "Corte King 👑", price: "16€", duration: "35 min" },
  { name: "Corte + Barba Clásica", price: "18€", duration: "45 min" },
  { name: "Corte + Cejas", price: "17€", duration: "35 min" },
  { name: "Corte + Barba + Cejas", price: "19€", duration: "45 min" },
  { name: "Corte + Cejas c/Hilo", price: "21€", duration: "45 min" },
  { name: "Corte + Barba + Cejas c/Hilo", price: "24€", duration: "1h" },
  { name: "Barba", price: "10€", duration: "15 min" },
  { name: "Cejas c/Cuchilla", price: "5€", duration: "5 min" },
  { name: "Cejas c/Hilo", price: "9€", duration: "15 min" },
  { name: "Corte 6-8 años", price: "14€", duration: "35 min" },
  { name: "Corte Mini King (0-5)", price: "12€", duration: "30 min" },
  { name: "Corte Queen", price: "32€", duration: "45 min" },
  { name: "Corte Chicas Basic", price: "25€", duration: "45 min" },
  { name: "Tinte Chicos 1 Color", price: "15€", duration: "45 min" },
  { name: "Mechas Básicas Chicos", price: "38€", duration: "3h" },
  { name: "Permanente Chicos", price: "40€+", duration: "2h" },
  { name: "Keratina Chicos", price: "50€", duration: "3h 30min" },
];

const barbers = [
  { name: "Camilo", flag: "🇨🇴/🇪🇸" },
  { name: "Kimy", flag: "🇬🇹" },
  { name: "Bryan", flag: "🇨🇴" },
  { name: "Víctor", flag: "🇪🇸" },
];

const timeSlots = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30",
];

const BookingModal = ({ isOpen, onClose, preselectedService }: BookingModalProps) => {
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState(preselectedService || "");
  const [selectedBarber, setSelectedBarber] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const reset = () => {
    setStep(0);
    setSelectedService(preselectedService || "");
    setSelectedBarber("");
    setSelectedDate("");
    setSelectedTime("");
    setName("");
    setPhone("");
    setEmail("");
    setSubmitted(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Generate next 14 days
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  }).filter(d => d.getDay() !== 0); // exclude Sundays

  const canNext = () => {
    if (step === 0) return !!selectedService;
    if (step === 1) return !!selectedBarber;
    if (step === 2) return !!selectedDate && !!selectedTime;
    if (step === 3) return name.trim() && phone.trim();
    return false;
  };

  const handleSubmit = async () => {
    const dateObj = dates.find(d => {
      const key = d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
      return key === selectedDate;
    });
    const dateStr = dateObj ? dateObj.toISOString().split("T")[0] : selectedDate;

    const { error } = await supabase.from("appointments").insert({
      client_name: name,
      client_phone: phone,
      client_email: email || null,
      service: selectedService,
      barber: selectedBarber,
      appointment_date: dateStr,
      appointment_time: selectedTime,
    });

    if (error) {
      toast.error("Error al reservar. Inténtalo de nuevo.");
      return;
    }
    setSubmitted(true);
  };

  const steps = ["Servicio", "Barbero", "Fecha y Hora", "Datos"];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="card-elevated w-full max-w-lg max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h3 className="font-display text-2xl text-foreground">Reservar Cita</h3>
            <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Steps indicator */}
          {!submitted && (
            <div className="flex gap-1 px-6 pt-4">
              {steps.map((s, i) => (
                <div key={s} className="flex-1">
                  <div className={`h-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-muted"}`} />
                  <p className={`text-xs mt-1 ${i === step ? "text-primary" : "text-muted-foreground"}`}>{s}</p>
                </div>
              ))}
            </div>
          )}

          <div className="p-6">
            {submitted ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-display text-2xl text-foreground mb-2">¡Cita Reservada!</h4>
                <p className="text-muted-foreground mb-1">Recibirás una confirmación por email.</p>
                <p className="text-sm text-muted-foreground">
                  {selectedService} · {selectedBarber} · {selectedDate} a las {selectedTime}
                </p>
                <button onClick={handleClose} className="mt-6 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold">
                  Cerrar
                </button>
              </motion.div>
            ) : (
              <>
                {/* Step 0: Service */}
                {step === 0 && (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {services.map((s) => (
                      <button
                        key={s.name}
                        onClick={() => setSelectedService(s.name)}
                        className={`w-full text-left p-3 rounded-lg border transition-all flex justify-between items-center ${
                          selectedService === s.name
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Scissors className="w-4 h-4 text-primary shrink-0" />
                          <span className="text-sm text-foreground">{s.name}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-primary font-semibold text-sm">{s.price}</span>
                          <p className="text-xs text-muted-foreground">{s.duration}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 1: Barber */}
                {step === 1 && (
                  <div className="grid grid-cols-2 gap-4">
                    {barbers.map((b) => (
                      <button
                        key={b.name}
                        onClick={() => setSelectedBarber(b.name)}
                        className={`p-6 rounded-lg border transition-all text-center ${
                          selectedBarber === b.name
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                          <User className="w-7 h-7 text-primary" />
                        </div>
                        <p className="font-semibold text-foreground">{b.name}</p>
                        <p className="text-xs text-muted-foreground">{b.flag}</p>
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 2: Date & Time */}
                {step === 2 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Selecciona fecha
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-6">
                      {dates.map((d) => {
                        const key = d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
                        const dayName = d.toLocaleDateString("es-ES", { weekday: "short" });
                        return (
                          <button
                            key={key}
                            onClick={() => setSelectedDate(key)}
                            className={`shrink-0 px-4 py-3 rounded-lg border text-center transition-all ${
                              selectedDate === key
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/40"
                            }`}
                          >
                            <p className="text-xs text-muted-foreground capitalize">{dayName}</p>
                            <p className="font-semibold text-foreground text-sm">{d.getDate()}</p>
                          </button>
                        );
                      })}
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Selecciona hora
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {timeSlots.map((t) => (
                        <button
                          key={t}
                          onClick={() => setSelectedTime(t)}
                          className={`py-2 rounded-lg border text-sm transition-all ${
                            selectedTime === t
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-foreground hover:border-primary/40"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Contact info */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1">Nombre *</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1">Teléfono *</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors"
                        placeholder="632 279 304"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1">Email (opcional)</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors"
                        placeholder="tu@email.com"
                      />
                    </div>

                    <div className="card-elevated p-4 mt-4">
                      <p className="text-sm text-muted-foreground mb-1">Resumen</p>
                      <p className="text-foreground font-semibold">{selectedService}</p>
                      <p className="text-sm text-muted-foreground">Barbero: {selectedBarber} · {selectedDate} · {selectedTime}</p>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-6 pt-4 border-t border-border">
                  <button
                    onClick={() => setStep(Math.max(0, step - 1))}
                    className={`flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors ${step === 0 ? "invisible" : ""}`}
                  >
                    <ChevronLeft className="w-4 h-4" /> Atrás
                  </button>
                  {step < 3 ? (
                    <button
                      onClick={() => setStep(step + 1)}
                      disabled={!canNext()}
                      className="flex items-center gap-1 bg-primary text-primary-foreground px-5 py-2 rounded-lg font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all"
                    >
                      Siguiente <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={!canNext()}
                      className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all gold-glow"
                    >
                      Confirmar Cita
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;
