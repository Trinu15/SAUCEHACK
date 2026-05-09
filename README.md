# FridgeNow 🍳

> Cook what you *actually* have. Nothing more.

A hackathon submission for **SAUCEHACK** on Wooble.

---

## The Problem

It's 8pm. You open the fridge. You see half an onion, some rice, two eggs, a sad tomato. You stare for 90 seconds. You close it. You open Swiggy.

Not because there's no food — there is food. But the gap between "ingredients I have" and "meal I can actually make" requires creative thinking nobody has at 8pm.

Every recipe app shows you beautiful meals that need 14 ingredients, three of which you don't own. They're designed for people who meal plan on Sundays. **You are not that person.**

## The Solution

FridgeNow tells you *exactly* what you can cook right now using only what you already have.

- No substitutions
- No "pick up X on the way home"
- No recipes that technically work if you swap everything
- Real food. Real constraints. Real kitchens.

---

## How It Works

1. You tell the app what's in your fridge (type or quick-add)
2. The AI generates 3–4 recipes using **only** those ingredients
3. Tap any recipe to see step-by-step instructions

The AI prompt is strictly constrained — it cannot suggest ingredients you don't have and cannot recommend substitutions. Salt, pepper, oil, and water are the only assumed pantry basics.

---

## Tech Stack

- Plain HTML, CSS, JavaScript — no frameworks, no build step
- Anthropic Claude API (`claude-sonnet-4-20250514`) for recipe generation
- Google Fonts (Fraunces + DM Sans)
- Fully client-side — works as a static file

---

## Run Locally

Just open `index.html` in your browser. No install needed.

> Note: The AI features require the Anthropic API to be accessible from the client. In production, proxy the API call through a backend to keep credentials secure.

---

## Judging Criteria Addressed

| Criteria | How FridgeNow addresses it |
|---|---|
| Practical Accuracy | AI is hard-prompted to use ONLY listed ingredients — no exceptions |
| Ease of Use | Quick-add buttons, one tap to get recipes — usable in under 10 seconds |
| Design & Experience | Warm editorial UI, fast, frictionless, designed for tired 8pm users |

---

## The Hardest Constraint

The hardest constraint was enforcing ingredient-only cooking — no substitutions, no "pick up X on the way." Most recipe apps assume a stocked pantry. We solve this by hard-prompting the AI with a strict boundary: only the user's listed ingredients are allowed, with salt, pepper, oil, and water as the only assumed pantry basics. Every recipe returned is immediately cookable. The prompt explicitly bans phrases like "you could also add" and forces the AI to reason within real constraints, not ideal ones.

---

## Files

```
index.html   — App shell and markup
style.css    — All styles
app.js       — Logic, AI call, rendering
README.md    — This file
```

---

Made for SAUCEHACK · Wooble Hackathon · May 2026
