# Smart Travel Scout

A natural language travel experience discovery application built for Sri Lanka.
Users enter a query in plain English — the system interprets their intent and returns
the most relevant experiences from a fixed, verified inventory.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square)
![OpenAI](https://img.shields.io/badge/OpenAI-gpt--4o--mini-412991?style=flat-square)
![Zod](https://img.shields.io/badge/Zod-validation-3068b7?style=flat-square)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square)

**Live Application:** [smart-travel-scout-ecru.vercel.app](https://smart-travel-scout-ecru.vercel.app/)
**Repository:** [github.com/ruwini01/smart-travel-scout](https://github.com/ruwini01/smart-travel-scout)

---

## Overview

The core of this application is the matching pipeline I designed — where a
user's natural language input, however they choose to phrase it, reliably
maps to the correct inventory items, with a clear explanation of why each
result was selected.

Intent is interpreted at the semantic level, not through simple keyword
lookup. A query like *"something adventurous for wildlife photography"*
correctly resolves to the safari experience because the system understands
the relationship between the words and the inventory tags, not just whether
the words appear verbatim.

The AI is strictly constrained to the provided inventory. It cannot suggest,
infer, or fabricate any destination outside the five items given. This is
enforced both through the system prompt and through Zod schema validation
at the API boundary — two independent layers that together make hallucination
practically impossible.

---

## Application Features

- Natural language search — users describe their trip freely in plain English
- AI-powered intent matching via OpenAI `gpt-4o-mini`
- Per-result reasoning — each card explains which tag, price, or location triggered the match
- Match strength indicators — Top Pick, Great Match, Possible Match
- Price and tag filter bar for further refinement
- Skeleton loading states and graceful fallback for empty results
- Offline fallback scorer — the application remains functional if the API is unavailable
- Wishlist, full booking flow, and contact modals
- Fully responsive across mobile, tablet, and desktop

---

## Technology Choices

| Technology | Reason |
|---|---|
| Next.js 14 App Router | Provides both the frontend and the serverless API route within a single project — keeps the architecture clean and the API key entirely server-side |
| OpenAI `gpt-4o-mini` | Sufficient accuracy for intent-to-tag mapping on a small inventory, at low cost and latency |
| Zod | Enforces a strict response schema at the API boundary — any ID outside the valid set is rejected before it reaches the frontend |
| Tailwind CSS | Enables rapid, consistent UI development |
| Vercel | Zero-configuration deployment with first-class Next.js support and secure environment variable handling |

---

## Project Structure

```
smart-travel-scout/
├── app/
│   ├── api/
│   │   └── search/
│   │       └── route.js        ← OpenAI integration, Zod validation,
│   │                              rate limiting, caching
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   ├── Navbar.jsx
│   ├── HeroSection.jsx
│   ├── SearchBar.jsx
│   ├── ExperienceCard.jsx
│   ├── ResultsSection.jsx
│   ├── FilterBar.jsx
│   ├── BookingModal.jsx
│   ├── WishlistDrawer.jsx
│   ├── ContactModal.jsx
│   ├── HowItWorks.jsx
│   ├── AboutSection.jsx
│   ├── TrustStrip.jsx
│   ├── SkeletonCard.jsx
│   ├── Footer.jsx
│   └── Toast.jsx
├── data/
│   └── inventory.js            ← Verified inventory + UI enrichment fields
├── utils/
│   └── matchInventory.js       ← Offline keyword fallback scorer
├── .env.local                  ← OPENAI_API_KEY (not committed)
└── README.md
```

---

## Inventory

The application searches exclusively within this dataset, exactly as provided:

```json
[
  {"id": 1, "title": "High-Altitude Tea Trails",  "location": "Nuwara Eliya", "price": 120, "tags": ["cold","nature","hiking"]},
  {"id": 2, "title": "Coastal Heritage Wander",   "location": "Galle Fort",   "price": 45,  "tags": ["history","culture","walking"]},
  {"id": 3, "title": "Wild Safari Expedition",     "location": "Yala",         "price": 250, "tags": ["animals","adventure","photography"]},
  {"id": 4, "title": "Surf & Chill Retreat",       "location": "Arugam Bay",   "price": 80,  "tags": ["beach","surfing","young-vibe"]},
  {"id": 5, "title": "Ancient City Exploration",   "location": "Sigiriya",     "price": 110, "tags": ["history","climbing","view"]}
]
```

`data/inventory.js` extends these items with UI-only fields — images,
descriptions, and highlights — for display purposes. The API route sends
only the original five fields to OpenAI. The model never sees the
enrichment data.

---

## Architecture

```
User enters a natural language query
              │
              ▼
     POST /api/search
              │
              ├── Rate limiter         10 requests / min / IP
              ├── Input validation     empty check, 500 character limit
              ├── Query cache          1 hour TTL — repeated queries skip OpenAI
              ├── Keyword early return exact tag match — bypasses OpenAI entirely
              │
              ▼
     OpenAI gpt-4o-mini
              │   System prompt:  inventory embedded as JSON + strict rules
              │   Temperature:    0.1  — deterministic, not generative
              │   Max tokens:     500  — short JSON response only
              │
              ▼
     Zod schema validation
              │   IDs outside {1, 2, 3, 4, 5} are rejected here
              │
              ▼
     ID join from data/inventory.js
              │   Response content sourced from local file, not from AI output
              │
              ▼
     JSON response delivered to frontend
```

The AI's role is deliberately narrow — it determines which IDs to return
and provides a reason for each. All result content is sourced from the local
inventory file after validation. The worst possible AI failure produces an
empty result, never fabricated content.

---

## Hallucination Prevention

Three independent layers enforce grounding:

**Layer 1 — System prompt constraint**

The complete inventory is embedded as a JSON array directly in the system
prompt. The model receives explicit, numbered rules: return only IDs from
the list, never suggest anything outside it, and produce only the specified
JSON structure.

**Layer 2 — Zod schema validation**

```js
const ResponseSchema = z.object({
  matches: z.array(z.object({
    id: z.number().int().refine(
      (id) => VALID_IDS.has(id),
      { message: "ID not in inventory — hallucination blocked" }
    ),
    reason: z.string().min(1).max(300),
    matchStrength: z.enum(["Top Pick", "Great Match", "Possible Match"]),
  })).max(5),
});
```

Any ID outside the valid set is caught here and the response is rejected
before it reaches the frontend.

**Layer 3 — Local data join**

The final response is assembled by looking up the validated IDs in
`data/inventory.js`. The AI output is used only for ID selection and
reasoning text. It cannot alter the factual content of any result.

---

## Cost and Performance Controls

| Measure | Implementation |
|---|---|
| Low temperature | `0.1` — consistent output, no unnecessary variation |
| Token limit | `max_tokens: 500` — sufficient for the JSON response, nothing more |
| Query cache | In-memory Map with 1 hour TTL — identical queries do not reach OpenAI |
| Keyword early return | Clear exact-tag matches bypass the LLM — sub-50ms response |
| Rate limiting | 10 requests per IP per minute — prevents abuse |
| Model selection | `gpt-4o-mini` — accurate for this task at significantly lower cost than larger models |

---

## Local Development

**Clone and install**
```bash
git clone https://github.com/ruwini01/smart-travel-scout.git
cd smart-travel-scout
npm install
```

**Configure environment**

Create `.env.local` in the project root:
```
OPENAI_API_KEY=sk-your-key-here
```

**Start the development server**
```bash
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000)

**Test the API route directly**
```bash
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "chilled beach weekend with surfing vibes under $100"}'
```

---

## Deployment

```bash
npm run build
vercel
```

Add `OPENAI_API_KEY` under **Project Settings → Environment Variables** in
the Vercel dashboard. The application deploys automatically on every push
to the main branch.

---

## Submission Questions

### 1. The "Under the Hood" Moment

After the OpenAI integration was in place and returning 200 responses, the
frontend was occasionally displaying no results without any visible error.
The API appeared to be working, but searches produced nothing.

I isolated the issue by logging the raw response string in the API route
before attempting to parse it:

```js
console.log("Raw OpenAI response:", rawText);
```

The log revealed that the model was intermittently wrapping its JSON
response in markdown code fences — ` ```json { ... } ``` ` — rather than
returning plain JSON. `JSON.parse()` was throwing a SyntaxError on the
fences, the catch block was returning a 500, and the frontend was silently
falling back to an empty state.

The immediate fix was to strip the fences before parsing:

```js
const cleaned = rawText.replace(/```json|```/g, "").trim();
parsed = JSON.parse(cleaned);
```

The underlying cause was an underspecified system prompt. I had instructed
the model to match the query to the best experiences without defining the
required output format precisely enough. I rewrote the prompt to include
the exact JSON structure the model must return, set `temperature: 0.1` to
reduce output variation, and added Zod validation as a structural safeguard
so that malformed or unexpected responses are caught systematically rather
than failing silently.

---

### 2. The Scalability Thought

With 5 inventory items, embedding the full dataset in the system prompt is
practical. With 50,000 items it would exceed context window limits and
generate prohibitive API costs on every query.

The architecture I would implement:

**Embeddings and vector retrieval**
Pre-compute a vector embedding for each inventory item using
`text-embedding-3-small`, concatenating title, tags, and location into a
single string per item. Store the vectors in a database such as Pinecone
or pgvector on Supabase. On each user query, embed the query string and
retrieve the top 10 to 20 most semantically similar items via cosine
similarity. This reduces the candidate set from 50,000 to a focused
shortlist before the LLM is involved — cutting prompt token usage by
approximately 99%.

**LLM re-ranking on the shortlist only**
Pass only the retrieved candidates to the LLM for intent-based ranking and
explanation generation. The model works with a relevant subset, which
improves both accuracy and cost.

**Constrained output — already implemented**
The LLM returns only item IDs with a reason. IDs are validated by Zod and
joined to local data. This layer scales without modification.

**Additional cost controls at scale**
Redis cache with distributed TTL for repeated queries, per-user rate
limiting, background pre-warming for high-frequency search terms, and
expansion of the keyword early-return filter to handle a broader range of
common queries without involving the LLM at all.

---

### 3. The AI Reflection

I used Claude (claude.ai) as a development assistant during this build —
primarily for scaffolding, discussing architecture decisions, and reviewing
component structure.

One instance where the suggestion required correction: when I asked for
help writing the initial system prompt, Claude proposed instructing the
model to use its best judgment to suggest relevant travel experiences.
I implemented that version and tested it. The model returned a
well-written recommendation for a beachfront resort in the Maldives — a
destination that does not exist anywhere in the inventory. The suggestion
was confident, plausible, and entirely fabricated.

The problem was that vague guidance gives the model room to be helpful in
the way it is trained to be, which conflicts with the strict grounding this
application requires. I corrected it by rewriting the prompt to embed the
full inventory as a JSON array, enumerate the valid IDs explicitly, and
include a numbered rule list that prohibits any suggestion outside the
list. I also specified the exact JSON response structure the model must
produce. Zod validation was then added as a second independent layer so
that even if the prompt is insufficiently constraining, hallucinated IDs
are caught and rejected at the API boundary before they reach the user.

---

## Fair Use and Ethics

- The assistant does not fabricate options beyond the provided inventory
- No personal data is collected beyond what is required to perform a search
- The OpenAI API key is stored server-side only and is never exposed to the client
- Rate limiting is implemented to prevent abuse
- Images are sourced from Unsplash under their open licence

---

## License

MIT — Ruwini Tharanga
