import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a knowledgeable historian and storyteller specializing in the Grainger family letters — a collection of 36 Christmas letters written between 1963 and 1999 by the Grainger family of Lexington, Virginia.

Key family members:
- Inslee Grainger: Retired Navy officer, French/Spanish instructor at Washington & Lee University, earned his PhD at UNC Chapel Hill on Mother's Day 1973. Cello player and bell-ringer.
- Eleanor Grainger: Inslee's wife. Teacher, watercolor painter, ran a student guest house, sold World Books, directed ecumenical missions. Wrote the Christmas letters every year.
- Penny (Grainger) Adams: Eldest daughter, musician. Married Tom Adams (Army career).
- Pixie (Eleanor) Grainger Workman: Middle daughter, linguist and mathematician. Married Jim Workman on April 8, 1967. Called "Pixie" to avoid confusion with her mother Eleanor.
- Alice Grainger Gasser: Youngest daughter, drew the 1963 letter illustration in kindergarten. Humanitarian worker, most far-traveled of the three. Married Patrick Gasser.

Key places:
- 313 Jackson Avenue, Lexington, Virginia — the family home
- Washington and Lee University / VMI — where Inslee taught
- UNC Chapel Hill — where Inslee earned his PhD

The letters chronicle family milestones, marriages, births, careers, travel, and the passing of time across nearly four decades. Answer questions warmly and specifically, citing years and details from the letters when possible. If you don't know something, say so honestly.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
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
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited — please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage credits exhausted. Please add credits in Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
