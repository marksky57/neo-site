# Neo At Your Service — Marketing Site

Static site at https://www.neoatyourservice.com — landing pages, pricing, legal pages. Deployed on Railway.

This file is canonical context for any LLM (Claude, GPT, Cursor, etc.) working on this repo. Read it first.

---

## Pages

- `index.html` — English homepage
- `index_es.html` — Spanish homepage (must stay in parity with EN)
- `pro-plan.html` — Founders detail page (linked from "Learn more" on homepage)
- `privacy-policy.html`, `terms-of-service.html`, `sms-messaging-policy.html` — legal
- `audio/voice-*.mp3` — voice samples for the 5 ElevenLabs voices

---

## Pricing regime (canonical — must match neo-backend/CLAUDE.md)

**Currently selling: NEO Pro Founders — $59/mo + $0.30/min.**

- No setup fee, no contracts, cancel anytime
- 30-day money-back guarantee
- Locked at this rate forever for first 100 Founders

**Post-Founders: $99/mo + $0.35/min.**

- Already shown as the white "Get Started — $99/mo" fallback button on homepage + es page
- Wired to Stripe Payment Link `4gMcN560u089cP8adG2wU08`

**Founders counter:** hardcoded JS constant `FOUNDERS_REMAINING = 90` (intentional tripwire — when it hits 0, the Founders banner/card hides automatically and only the $99 path shows). Update this manually as actual signups accrue.

---

## CTA URL conventions

| Button | URL |
|---|---|
| Founders ($59) — homepage, ES, pro-plan | `https://neo-backend-production-dbd6.up.railway.app/checkout?plan=pro` |
| Standard ($99) — homepage, ES | `https://buy.stripe.com/4gMcN560u089cP8adG2wU08` (Stripe Payment Link) |

The $59 path is **form-driven** (collects name/biz/phone/industry/city for Twilio area-code provisioning + Vapi assistant config). The $99 path is a **direct Stripe Payment Link** — bypasses the form. When you transition to $99, you'll need to repoint the Founders button to a new form-driven URL.

---

## Spam-claim safeguard

Never say "spam never billed" as an absolute claim. Always qualify with **"~99%"** or **"around 99%"** (Spanish: "aproximadamente el 99%"). This is a legal safeguard — spam filtering is imperfect.

Acceptable phrasings:
- "Spam filtering — ~99% of junk calls never charged"
- "Around 99% of spam is filtered and never billed"
- "Aproximadamente el 99% del spam se filtra y nunca se factura"

---

## EN/ES parity

`index.html` and `index_es.html` must stay aligned in:
- Pricing (numbers, terms, guarantee language)
- Feature claims
- Legal disclosures
- Spam-safeguard qualifiers
- CTA URLs

Tone/idiom can differ; substantive claims cannot.

---

## Product scope — there is ONE product (changed 2026-05-15 — must match neo-backend/CLAUDE.md)

**There is only ONE product: NEO Pro.** No tiers, no "standard vs pro." The $59/mo Founders price and the post-cap $99/mo price are two *prices* of the same single product, not two products. Never use "standard product / standard plan / standard tier" framing — it implies tiers that don't exist. (The archived $29 "NEO Standard" is dead; never reference it.)

**Live call transfer IS part of the product** — no setup fee, no upsell. Neo recognizes urgent/explicit "connect me" calls and transfers them to the owner's transfer line; if the owner doesn't pick up within ~18s, Neo takes a message and texts the owner. Marketing copy MAY claim emergency/urgent live transfer. Honest framing only: "urgent calls put straight through; if you can't grab it, you get an instant alert" — do NOT promise flawless universal live connection (carrier/Google-Voice realities vary). Calendar booking is NOT part of the product — case-by-case manual upsell only.

## What NOT to add to marketing copy

- "Calendar booking" — not part of the product (case-by-case manual upsell only). Saying Neo "captures appointment requests" / "takes appointment requests" is fine; saying it "books appointments into your calendar" is not.
- "Free trial" or "7-day trial" — removed; we charge immediately with 30-day money-back instead
- "Setup fee" — Founders explicitly waives this; don't reintroduce
- "Fully autonomous" / "self-learning" / "human replacement" — overclaim, avoid
- "Standard plan $29" — archived, never reference

---

## Operational rules

- **Push directly to main.** No feature branches, no PRs. `git push origin HEAD:main`.
- **Stage explicit paths.** Never `git add -A`.
- Railway auto-deploys on push to main.

---

## Common LLM mistakes to avoid

- Don't update only the English version — always update `index_es.html` to match.
- Don't reintroduce trial language anywhere.
- Don't change the Founders CTA URL without coordinating with neo-backend (it expects the form-driven `/checkout?plan=pro` path).
- Don't make absolute spam claims — always qualify with ~99%.
- Don't add features to copy that aren't in the product. Calendar booking is still NOT standard (don't claim it). Live call transfer / emergency live routing IS now standard (claiming it is correct — see "Standard product scope").
