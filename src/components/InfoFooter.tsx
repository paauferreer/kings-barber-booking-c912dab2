import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Instagram } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const InfoFooter = () => {
  return (
    <footer id="contacto" className="section-padding bg-card border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-display text-xl text-primary mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" /> Ubicación
            </h3>
            <div className="rounded-lg overflow-hidden aspect-square">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3072.5!2d2.9108!3d39.7206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDQzJzE0LjIiTiAywrA1NCczOS4wIkU!5e0!3m2!1ses!2ses!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Kings Barber Shop"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Carrer de n'Antoni Fluxà, 70<br />07300 Inca, Mallorca
            </p>
          </motion.div>

          {/* Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-display text-xl text-primary mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" /> Horario
            </h3>
            <div className="space-y-3">
              {[
                { day: "Lunes", hours: "10:00 – 20:00" },
                { day: "Martes", hours: "10:00 – 20:00" },
                { day: "Miércoles", hours: "10:00 – 20:00" },
                { day: "Jueves", hours: "10:00 – 20:00" },
                { day: "Viernes", hours: "10:00 – 20:00" },
                { day: "Sábado", hours: "09:00 – 14:00" },
                { day: "Domingo", hours: "Cerrado" },
              ].map((item) => (
                <div key={item.day} className="flex justify-between text-sm">
                  <span className="text-foreground">{item.day}</span>
                  <span className={item.hours === "Cerrado" ? "text-destructive" : "text-muted-foreground"}>
                    {item.hours}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact & Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-display text-xl text-primary mb-4">Contacto</h3>
            <div className="space-y-4">
              <a href="tel:632279304" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                <Phone className="w-5 h-5 text-primary" />
                <span>632 279 304</span>
              </a>
              <a
                href="https://www.instagram.com/kingsbarbershop_inca/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
              >
                <Instagram className="w-5 h-5 text-primary" />
                <span>@kingsbarbershop_inca</span>
              </a>
              <a
                href="https://booksy.com/es-es/9504_kings-barber-shop_barberia_68772_inca"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
              >
                <span className="text-primary font-bold text-sm">B</span>
                <span>Reservar en Booksy</span>
              </a>
            </div>

            <div className="mt-8">
              <img src={logo} alt="Kings Barber Shop" className="w-20 h-20 object-contain rounded-lg opacity-60" />
            </div>
          </motion.div>
        </div>

        <div className="border-t border-border mt-12 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Kings Barber Shop · Inca, Mallorca
          </p>
        </div>
      </div>
    </footer>
  );
};

export default InfoFooter;
