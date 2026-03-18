import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Create admin user
    const { data: user, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: "kingsBS@kingsbarber.com",
      password: "Kings5d24u%",
      email_confirm: true,
    });

    if (createError) {
      // User might already exist
      if (createError.message.includes("already")) {
        return new Response(JSON.stringify({ message: "Admin already exists" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw createError;
    }

    // Assign admin role
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: user.user.id, role: "admin" });

    if (roleError) throw roleError;

    return new Response(JSON.stringify({ message: "Admin created", userId: user.user.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
