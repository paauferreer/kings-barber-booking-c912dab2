import { motion } from "framer-motion";
import logo from "@/assets/logo.jpeg";
import heroImg from "@/assets/cabezera.jpeg";

interface HeroSectionProps {
  onBookNow: () => void;
}

const HeroSection = ({ onBookNow }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroImg} alt="Kings Barber Shop interior" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
      </div>

      <div className="relative z-10 section-padding w-full max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.img
              src={logo}
              alt="Kings Barber Shop Logo"
              className="w-28 h-28 object-contain mb-8 rounded-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            />
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
              <span className="gold-gradient-text">Kings</span>
              <br />
              <span className="text-foreground">Barber Shop</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mb-2 font-body">
              Carrer de n'Antoni Fluxà, 70 · Inca, Mallorca
            </p>
            <div className="flex items-center gap-2 mb-8">
              <span className="text-primary text-xl">★ 4.8</span>
              <span className="text-muted-foreground">(820+ reseñas)</span>
            </div>
            <motion.button
              onClick={onBookNow}
              className="bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-lg text-lg hover:brightness-110 transition-all gold-glow"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Reservar Cita
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
