import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ServicesSectionProps {
  onBookService: (serviceName: string) => void;
}

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: string;
  duration: string;
  category: string;
}

const ServicesSection = ({ onBookService }: ServicesSectionProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("services")
        .select("id, name, description, price, duration, category")
        .eq("is_active", true)
        .order("sort_order");
      setServices(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const popularServices = services.filter(s => s.category === "popular");
  const otherServices = services.filter(s => s.category !== "popular");

  return (
    <section id="servicios" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Nuestros <span className="gold-gradient-text">Servicios</span>
          </h2>
          <p className="text-muted-foreground text-lg">Descubre todo lo que podemos hacer por ti</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <>
            {popularServices.length > 0 && (
              <>
                <h3 className="font-display text-2xl text-primary mb-6">Más Populares</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-12">
                  {popularServices.map((s, i) => (
                    <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.4 }}
                      className="card-elevated p-5 flex items-center justify-between hover:border-primary/40 transition-colors cursor-pointer group"
                      onClick={() => onBookService(s.name)}
                    >
                      <div className="flex-1">
                        <h4 className="font-display text-lg text-foreground group-hover:text-primary transition-colors">{s.name}</h4>
                        {s.description && <p className="text-sm text-muted-foreground mt-1">{s.description}</p>}
                      </div>
                      <div className="text-right ml-4 shrink-0">
                        <span className="text-primary font-bold text-lg">{s.price}</span>
                        <p className="text-xs text-muted-foreground">{s.duration}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            <h3 className="font-display text-2xl text-primary mb-6">Todos los Servicios</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {otherServices.map((s, i) => (
                <motion.div key={s.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03, duration: 0.3 }}
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
          </>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
