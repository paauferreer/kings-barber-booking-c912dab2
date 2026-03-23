import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BookingPayload {
  client_name: string;
  client_phone: string;
  client_email?: string;
  service: string;
  barber: string;
  appointment_date: string;
  appointment_time: string;
}

const SHOP_EMAIL = "kingsbarbershop921@gmail.com";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const booking: BookingPayload = await req.json();

    const SMTP_PASSWORD = Deno.env.get("SMTP_PASSWORD");
    if (!SMTP_PASSWORD) {
      console.error("SMTP_PASSWORD not configured");
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const client = new SmtpClient();
    await client.connectTLS({
      hostname: "smtp.gmail.com",
      port: 465,
      username: SHOP_EMAIL,
      password: SMTP_PASSWORD,
    });

    const results: string[] = [];

    // 1. Notify shop (for all barbers)
    const shopSubject = `Nueva cita: ${booking.client_name} - ${booking.appointment_date} ${booking.appointment_time}`;
    const shopBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #121212; color: #fff; padding: 30px; border-radius: 12px;">
        <h1 style="color: #c9982e; font-size: 24px;">Nueva Cita Reservada (${booking.barber})</h1>
        <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Barbero:</strong> ${booking.barber}</p>
          <p><strong>Cliente:</strong> ${booking.client_name}</p>
          <p><strong>Teléfono:</strong> ${booking.client_phone}</p>
          ${booking.client_email ? `<p><strong>Email:</strong> ${booking.client_email}</p>` : ""}
          <p><strong>Servicio:</strong> ${booking.service}</p>
          <p><strong>Fecha:</strong> ${booking.appointment_date}</p>
          <p><strong>Hora:</strong> ${booking.appointment_time}</p>
        </div>
        <p style="color: #999; font-size: 12px;">Kings Barber Shop</p>
      </div>
    `;

    await client.send({
      from: SHOP_EMAIL,
      to: SHOP_EMAIL,
      subject: shopSubject,
      content: "Nueva cita reservada.",
      html: shopBody,
    });
    results.push(`shop_notification: ${SHOP_EMAIL}`);

    // 2. Client confirmation
    if (booking.client_email) {
      const clientSubject = `Confirmación de tu cita en Kings Barber Shop`;
      const clientBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #121212; color: #fff; padding: 30px; border-radius: 12px;">
          <h1 style="color: #c9982e; font-size: 24px;">¡Cita Confirmada!</h1>
          <p>Hola ${booking.client_name},</p>
          <p>Tu cita ha sido reservada correctamente.</p>
          <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Servicio:</strong> ${booking.service}</p>
            <p><strong>Barbero:</strong> ${booking.barber}</p>
            <p><strong>Fecha:</strong> ${booking.appointment_date}</p>
            <p><strong>Hora:</strong> ${booking.appointment_time}</p>
          </div>
          <p>📍 Carrer de Bertran, 114, Sarrià-Sant Gervasi, 08023 Barcelona</p>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">Si necesitas cancelar o modificar tu cita, llámanos al 632 279 304.</p>
          <p style="color: #999; font-size: 12px;">Kings Barber Shop</p>
        </div>
      `;
      
      await client.send({
        from: SHOP_EMAIL,
        to: booking.client_email,
        subject: clientSubject,
        content: "Cita confirmada.",
        html: clientBody,
      });
      results.push(`client_confirmation: ${booking.client_email}`);
    }

    await client.close();

    console.log("Booking notification results:", results);

    return new Response(JSON.stringify({ success: true, notifications: results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in booking-notification:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
