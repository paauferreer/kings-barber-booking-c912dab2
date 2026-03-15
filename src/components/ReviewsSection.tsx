import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  { name: "Alfonso", date: "13 mar 2026", text: "Excelentes profesionales, super amables! Se nota que disfrutan con lo que hacen. Para volver una y otra vez.", barber: "Camilo", rating: 5 },
  { name: "Pedro", date: "5 mar 2026", text: "Corte perfecto, buen trato y ambiente top. No cambio de barbero.", barber: "Víctor", rating: 5 },
  { name: "Joel", date: "3 mar 2026", text: "Corte 10 de 10, servicio y ambiente más de lo mismo. Muchas gracias 💪🏽👏🏽", barber: "Víctor", rating: 5 },
  { name: "Natalia", date: "6 mar 2026", text: "Son los mejores, en especial Víctor.", barber: "Víctor", rating: 5 },
  { name: "Mireia", date: "26 feb 2026", text: "Fue el primer corte de mi peque y todo perfecto. Gracias.", barber: "Bryan", rating: 5 },
  { name: "Aitor", date: "26 feb 2026", text: "Muy buen corte y muy majo el barbero.", barber: "Camilo", rating: 5 },
];

const ReviewsSection = () => {
  return (
    <section id="resenas" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Lo que dicen <span className="gold-gradient-text">nuestros clientes</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-primary text-primary" />
              ))}
            </div>
            <span className="text-2xl font-bold text-foreground">4.8</span>
            <span className="text-muted-foreground">(820+ reseñas en Booksy)</span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card-elevated p-6"
            >
              <div className="flex mb-3">
                {[...Array(r.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground mb-4 italic">"{r.text}"</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground">Barbero: {r.barber}</p>
                </div>
                <span className="text-xs text-muted-foreground">{r.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
