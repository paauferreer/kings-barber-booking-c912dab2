import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.jpeg";

interface NavbarProps {
  onBookNow: () => void;
}

const links = [
  { label: "Servicios", href: "#servicios" },
  { label: "Galería", href: "#galeria" },
  { label: "Reseñas", href: "#resenas" },
  { label: "Contacto", href: "#contacto" },
];

const Navbar = ({ onBookNow }: NavbarProps) => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 h-16">
        <a href="#" className="flex items-center gap-3">
          <img src={logo} alt="KBS" className="w-10 h-10 object-contain rounded" />
          <span className="font-display text-lg text-primary hidden sm:inline">Kings Barber Shop</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-primary transition-colors font-body">
              {l.label}
            </a>
          ))}
          <button
            onClick={onBookNow}
            className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition-all"
          >
            Reservar
          </button>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-4">
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-muted-foreground hover:text-primary transition-colors">
                  {l.label}
                </a>
              ))}
              <button
                onClick={() => { setOpen(false); onBookNow(); }}
                className="bg-primary text-primary-foreground px-5 py-2 rounded-lg font-semibold"
              >
                Reservar Cita
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
