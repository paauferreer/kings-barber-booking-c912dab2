import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get appointments for tomorrow that have client email
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    const { data: appointments, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("appointment_date", tomorrowStr)
      .in("status", ["pending", "confirmed"])
      .not("client_email", "is", null);

    if (error) {
      console.error("Error fetching appointments:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const reminders: string[] = [];

    for (const appt of (appointments || [])) {
      if (!appt.client_email) continue;

      const reminderBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #121212; color: #fff; padding: 30px; border-radius: 12px;">
          <h1 style="color: #c9982e; font-size: 24px;">⏰ Recordatorio de tu cita</h1>
          <p>Hola ${appt.client_name},</p>
          <p>Te recordamos que mañana tienes una cita en Kings Barber Shop.</p>
          <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Servicio:</strong> ${appt.service}</p>
            <p><strong>Barbero:</strong> ${appt.barber}</p>
            <p><strong>Fecha:</strong> ${appt.appointment_date}</p>
            <p><strong>Hora:</strong> ${appt.appointment_time}</p>
          </div>
          <p>📍 Carrer de Bertran, 114, Sarrià-Sant Gervasi, 08023 Barcelona</p>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">Si necesitas cancelar o modificar tu cita, llámanos al 632 279 304.</p>
          <p style="color: #999; font-size: 12px;">Kings Barber Shop</p>
        </div>
      `;

      reminders.push(appt.client_email);
      console.log(`Reminder prepared for: ${appt.client_email} - ${appt.appointment_date} ${appt.appointment_time}`);
    }

    console.log(`Processed ${reminders.length} reminders for ${tomorrowStr}`);

    return new Response(JSON.stringify({ success: true, reminders_count: reminders.length, date: tomorrowStr }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in send-reminders:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
