import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lock, User } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Map username to email
    const loginEmail = email.includes("@") ? email : `${email}@kingsbarber.com`;

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    });

    if (error) {
      toast.error("Credenciales incorrectas");
      setLoading(false);
      return;
    }

    // Check admin role
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: roles } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });

      if (roles) {
        toast.success("Bienvenido al panel de administración");
        navigate("/admin");
      } else {
        await supabase.auth.signOut();
        toast.error("No tienes permisos de administrador");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="card-elevated w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl text-foreground mb-2">Panel Admin</h1>
          <p className="text-muted-foreground">Kings Barber Shop</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground block mb-1">Usuario</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors"
                placeholder="Usuario"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground block mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors"
                placeholder="Contraseña"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:brightness-110 transition-all disabled:opacity-50 gold-glow"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <a href="/" className="block text-center text-sm text-muted-foreground mt-6 hover:text-primary transition-colors">
          ← Volver a la web
        </a>
      </div>
    </div>
  );
};

export default AdminLogin;
