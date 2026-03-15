import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
const gallery1 = "/lovable-uploads/0475a971-1ed6-499f-a3e7-3f59d228314d.jpg";
const gallery2 = "/lovable-uploads/65f9f93b-ac1d-4453-8175-025758423c4f.jpg";
const gallery3 = "/lovable-uploads/0b078061-1b97-4996-b74a-f65020e93453.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import cabezera from "@/assets/cabezera.jpeg";

const images = [
  { src: cabezera, alt: "El equipo de Kings Barber Shop" },
  { src: gallery1, alt: "Interior de la barbería" },
  { src: gallery2, alt: "Corte de pelo profesional" },
  { src: gallery3, alt: "Herramientas de barbería" },
  { src: gallery4, alt: "Resultado de corte" },
];

const GalleryCarousel = () => {
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    const next = (current + dir + images.length) % images.length;
    setCurrent(next);
    scrollRef.current?.children[next]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  return (
    <section id="galeria" className="section-padding bg-card/50">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-12"
        >
          <span className="gold-gradient-text">Galería</span>
        </motion.h2>

        <div className="relative">
          <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            {images.map((img, i) => (
              <motion.div
                key={i}
                className="snap-center shrink-0 w-[80vw] md:w-[60vw] lg:w-[45vw] aspect-[16/10] rounded-lg overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => scroll(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border border-border p-2 rounded-full hover:bg-primary/20 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-primary" />
          </button>
          <button
            onClick={() => scroll(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border border-border p-2 rounded-full hover:bg-primary/20 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-primary" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default GalleryCarousel;
