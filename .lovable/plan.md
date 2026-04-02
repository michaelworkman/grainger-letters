

## The Grainger Family Letters — Build Plan

### Design System Setup
- Override Tailwind theme with the editorial color palette (ink, cream, warm rule, amber accent, grays)
- Import Google Fonts: Playfair Display (serif headings/letter text) and Plus Jakarta Sans (UI/body)
- Set base styles: cream background, generous whitespace, max 680px content width for narrative text
- Thin 2px amber decorative rule as a reusable accent element

### Navigation & Hero Header
- Clean horizontal nav with four sections: The Story, The Letters, The Places, Ask a Question
- Hero: large Playfair Display title "The Grainger family letters", subtitle "Lexington, Virginia · 1963–1999", short description, amber rule below
- Mobile-responsive nav (hamburger or minimal collapse)

### Section 1: The Story
- Longform narrative across 5 chapters (Roots, The Lexington Years, Alice in the World, The Workman Branch, The Final Letter)
- Each chapter: number, title, body text in Playfair Display at ~15px with 1.85 line-height
- Pull quotes in left-bordered amber-rule blockquotes
- Smooth scroll between chapters, book-like reading experience

### Section 2: The Letters (Archive Browser)
- Two-column layout: vertical timeline sidebar (left) + document pane (right)
- Timeline: amber dot markers with connecting vertical line, year + location labels, filled amber dot for active selection
- Letter display: bordered document frame with date/address header, Playfair Display body text
- Space for scanned letter images alongside transcriptions (two-up on desktop, stacked on mobile)
- All 36 letters loaded from data, selectable via timeline
- Mobile: timeline collapses to horizontal scroll strip or dropdown

### Section 3: The Places (Interactive Map)
- Full-width Leaflet.js map with OpenStreetMap tiles (no API key needed)
- Custom amber/ink markers for all 37 locations (no default red pins)
- Click markers to see location name, period, and contextual note from the letters
- Styled popup cards matching the editorial design

### Section 4: Ask a Question (Claude Q&A)
- Chat interface styled in the editorial aesthetic
- Suggested question chips: "Who was Pixie?", "Tell me about Alice's humanitarian work", etc.
- Conversation history maintained in session
- **Note:** The Claude API call requires a backend proxy (Supabase Edge Function) to keep the API key secure — this will be set up as a follow-up once Supabase is connected

### Photos Integration
- Extract and place the uploaded letter photos into the project
- Display scanned images in the letter browser alongside transcriptions

### SEO & Polish
- Page title and meta description per the brief
- Responsive design throughout — single-column layouts on mobile
- Smooth transitions between sections

