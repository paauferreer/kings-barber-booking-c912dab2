import { motion } from "framer-motion";

interface ServicesSectionProps {
  onBookService: (serviceName: string) => void;
}

const popularServices = [
  { name: "Corte King 👑", desc: "Pensamos en el corte que mejor se adapte a tu estilo", price: "16€", duration: "35 min" },
  { name: "Corte + Barba Clásica", desc: "Corte completo con arreglo de barba", price: "18€", duration: "45 min" },
  { name: "Corte + Cejas", desc: "Degradado Kings + cejas con cuchilla", price: "17€", duration: "35 min" },
  { name: "Corte + Barba + Cejas", desc: "Corte completo + barba + cejas con cuchilla", price: "19€", duration: "45 min" },
  { name: "Corte + Cejas c/Hilo", desc: "Corte King + cejas con hilo", price: "21€", duration: "45 min" },
  { name: "Corte + Barba + Cejas c/Hilo", desc: "Corte completo + barba + cejas con hilo o pinza", price: "24€", duration: "1h" },
];

const otherServices = [
  { name: "Barba", price: "10€", duration: "15 min" },
  { name: "Cejas c/Cuchilla", price: "5€", duration: "5 min" },
  { name: "Cejas c/Pinza", price: "7€", duration: "15 min" },
  { name: "Cejas c/Hilo", price: "9€", duration: "15 min" },
  { name: "Cejas & Bigote c/Hilo", price: "12€", duration: "20 min" },
  { name: "Corte 6-8 años", price: "14€", duration: "35 min" },
  { name: "Corte Mini King (0-5)", price: "12€", duration: "30 min" },
  { name: "Laminado de Cejas", price: "22€", duration: "30 min" },
  { name: "Henna Cejas", price: "12€", duration: "30 min" },
  { name: "Tinte Chicos 1 Color", price: "15€", duration: "45 min" },
  { name: "Mechas Básicas Chicos", price: "38€", duration: "3h" },
  { name: "Mechas Full Chicos", price: "50€", duration: "3-4h" },
  { name: "Permanente Chicos", price: "40€+", duration: "2h" },
  { name: "Keratina Chicos", price: "50€", duration: "3h 30min" },
  { name: "Color Plata Kings", price: "50€", duration: "4h" },
  { name: "Corte Queen", price: "32€", duration: "45 min" },
  { name: "Corte Chicas Basic", price: "25€", duration: "45 min" },
  { name: "Corte Mini Queen", price: "12€", duration: "20 min" },
  { name: "Tinte Chicas", price: "45€", duration: "2h" },
  { name: "Mechas Babylight", price: "150€+", duration: "7h" },
  { name: "Bayalage", price: "149,99€+", duration: "7h" },
  { name: "Lifting de Pestañas", price: "35€", duration: "1h 15min" },
  { name: "Keratina Colombiana", price: "260€", duration: "8h" },
  { name: "Keratina Brasileña", price: "260€", duration: "6h" },
  { name: "Cauterización", price: "140€+", duration: "2h 15min" },
  { name: "Maquillaje c/Pestañas", price: "50€", duration: "1h" },
  { name: "Trenzas Chicos", price: "25€+", duration: "2h" },
  { name: "Pack Novia", price: "185€+", duration: "4h" },
];

const ServicesSection = ({ onBookService }: ServicesSectionProps) => {
  return (
    <section id="servicios" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Nuestros <span className="gold-gradient-text">Servicios</span>
          </h2>
          <p className="text-muted-foreground text-lg">Descubre todo lo que podemos hacer por ti</p>
        </motion.div>

        {/* Popular */}
        <h3 className="font-display text-2xl text-primary mb-6">Más Populares</h3>
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {popularServices.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="card-elevated p-5 flex items-center justify-between hover:border-primary/40 transition-colors cursor-pointer group"
              onClick={() => onBookService(s.name)}
            >
              <div className="flex-1">
                <h4 className="font-display text-lg text-foreground group-hover:text-primary transition-colors">{s.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
              </div>
              <div className="text-right ml-4 shrink-0">
                <span className="text-primary font-bold text-lg">{s.price}</span>
                <p className="text-xs text-muted-foreground">{s.duration}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Other services */}
        <h3 className="font-display text-2xl text-primary mb-6">Todos los Servicios</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {otherServices.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
              className="card-elevated p-4 flex items-center justify-between hover:border-primary/40 transition-colors cursor-pointer group"
              onClick={() => onBookService(s.name)}
            >
              <span className="font-body text-sm text-foreground group-hover:text-primary transition-colors">{s.name}</span>
              <div className="text-right ml-3 shrink-0">
                <span className="text-primary font-semibold text-sm">{s.price}</span>
                <p className="text-xs text-muted-foreground">{s.duration}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
