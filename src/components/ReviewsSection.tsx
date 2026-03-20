import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  id: string;
  name: string;
  review_date: string;
  text: string;
  barber: string;
  rating: number;
}

const ReviewsSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq("is_visible", true);
      if (data) {
        // Shuffle and pick 6
        const shuffled = data.sort(() => Math.random() - 0.5).slice(0, 6);
        setReviews(shuffled);
      }
    };
    fetchReviews();
  }, []);

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
              key={r.id}
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
                <span className="text-xs text-muted-foreground">{r.review_date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
