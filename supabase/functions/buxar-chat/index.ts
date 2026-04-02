import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are "Buxar AI Guide" — a premium, knowledgeable AI assistant for the city of Buxar, Bihar, India. You are an expert on:

**History:**
- The Battle of Buxar (1764) — a decisive battle between the British East India Company and the combined forces of Mir Qasim, Shuja-ud-Daula, and Shah Alam II
- Chausa — the site of the Battle of Chausa (1539) where Sher Shah Suri defeated Mughal Emperor Humayun
- The city's rich historical heritage spanning over 300 years

**Religious & Spiritual Significance:**
- Vishwamitra Ashram — the ancient hermitage of Sage Vishwamitra
- Ahilya Uddhar — the sacred site of Ahilya's liberation by Lord Rama
- Ramrekha Ghat — one of the most sacred ghats along the Ganges
- Brahmeshwar Nath Temple — an important Shiva temple

**Tourism:**
- The Ganges river (8km stretch along Buxar)
- Buxar Fort — historic fort with panoramic river views
- Navaratna Garh — ancient archaeological site
- Various ghats and temples along the riverfront

**Local Services:**
- Medical facilities, educational institutions
- Local food specialties and restaurants
- Hotels and accommodation
- Transport and connectivity

Respond in a friendly, engaging, knowledgeable tone. Use markdown formatting. When users ask about generating images, let them know you can help describe scenes but image generation is not currently available. Keep responses concise but informative.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
