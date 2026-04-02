

## Reduce AI Hallucination — Ground the Chat in Full Letter Content

### Problem
The current system prompt contains only a short summary of the Grainger family. The AI model has no access to the actual letter text, so it fabricates details that sound plausible but are inaccurate.

### Solution
Embed all 36 letter transcriptions directly into the system prompt so the AI can cite real content. Also strengthen the prompt instructions to discourage speculation.

### Implementation

**1. Update the edge function (`supabase/functions/chat/index.ts`)**

- Import or inline all letter content (year, date, full transcription) into the system prompt as a reference corpus
- The letters data is ~600 lines / ~30KB of text — well within context limits for `gemini-3-flash-preview`
- Add stricter grounding instructions to the prompt:
  - "Only answer based on the letter content provided below"
  - "If the letters don't mention something, say you don't have that information"
  - "Always cite the year/letter when referencing specific facts"

**2. Prompt structure**

```
You are a historian specializing in the Grainger family letters...

RULES:
- Only use facts from the letters below. Do not invent or assume details.
- If information isn't in the letters, say so honestly.
- Cite the year when referencing facts.

=== LETTER ARCHIVE ===
[1963 — November 25, 1963 — Lexington, Virginia]
<full transcription>

[1964 — December 1964 — 313 Jackson Avenue]
<full transcription>
...
```

### Technical notes
- The letter content is already in `src/data/letters.ts` but edge functions can't import from `src/`. The content will be inlined directly in the edge function.
- No database changes needed.
- Redeploy the edge function after updating.

