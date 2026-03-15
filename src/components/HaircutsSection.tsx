import { motion } from "framer-motion";
import corte1 from "@/assets/corte-1.jpg";
import corte2 from "@/assets/corte-2.jpg";
import corte3 from "@/assets/corte-3.jpg";
import corte4 from "@/assets/corte-4.jpg";
import corte5 from "@/assets/corte-5.jpg";
import corte6 from "@/assets/corte-6.jpg";

const cuts = [
  { src: corte1, label: "Fade con línea" },
  { src: corte2, label: "Crop texturizado" },
  { src: corte3, label: "Pompadour clásico" },
  { src: corte4, label: "Buzz cut con barba" },
  { src: corte5, label: "Rizado con degradado" },
  { src: corte6, label: "Mullet moderno" },
];

const HaircutsSection = () => (
  <section id="cortes" className="section-padding bg-background">
    <div className="max-w-7xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-bold text-center mb-12"
      >
        <span className="gold-gradient-text">Cortes</span>
      </motion.h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {cuts.map((cut, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group relative aspect-square rounded-xl overflow-hidden border border-border"
          >
            <img
              src={cut.src}
              alt={cut.label}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-primary font-semibold text-lg">{cut.label}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HaircutsSection;
