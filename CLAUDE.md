# NEO, At Your Service — Marketing Site

Static marketing site for Neo, the AI receptionist. Deployed on Railway at **neoatyourservice.com**.

The backend (checkout, provisioning, voice assistants, billing) lives in the separate **`neo-backend`** repo. That repo's `CLAUDE.md` is canonical for how the product actually works — this file covers the site only.

**Rewritten 2026-07-28.** The previous version described a pricing regime replaced twice over ($59/mo Founders + $0.30/min, a `FOUNDERS_REMAINING` counter, and a raw Stripe Payment Link as the $99 path). None of it exists. Anything on the site matching that description is a leftover and should be removed.

---

## Pricing (canonical — matches what the system actually bills)

**$99 to get started. $99/month. Includes 100 minutes. $0.39/minute after that.**

- No setup fee, no contract, cancel anytime
- Included minutes **do not roll over** — each cycle starts fresh at 100
- **No proration** — customers get the full 100 minutes regardless of signup date
- **Calls of 15 seconds or less are never billed** and don't consume included minutes
- This is the **only** price shown anywhere public

The allowance lives in a tiered Stripe price (0–100 min at $0.00, then $0.39), not in code.

### Retired — never reintroduce
- **$59/mo "Founders" pricing** and any "locked for life" language. A private discounted price still exists as a hand-out tool, but it must never appear on a public page — **including in HTML comments**, since page source is public.
- **Any spots counter** (`FOUNDERS_REMAINING` or similar).
- **$0.40/min and $0.35/min.** Both dead. $0.35 was never live and survived only in the Terms of Service until 2026-07-28.
- **"2 months free" / promo codes.** Never appeared in site copy; keep it that way.

---

## Positioning

**Lead with the outcome, not the technology.** Contractors buy answered calls and more jobs — not AI.

Primary themes:
- Never miss another lead
- Every call answered. Every lead captured.
- Built for contractors and small businesses
- Simple pricing · No contracts · No bloat · Everything you need, nothing you don't
- Professional call handling without the overhead of a receptionist
- English and Spanish automatically — never lose a lead to language

**Don't lead a headline or section header with "AI assistant" / "AI receptionist."** Neo *is* one and saying so plainly is fine, but it isn't the hook. The missed job is the hook.

The strongest line on the page is *"Every missed call is a missed job that goes straight to your competitor."* Keep it prominent.

**Don't oversell it either.** Neo is not a human employee and not a replacement for staff. It also isn't merely a missed-call safety net — it works every call live. Land on "every call answered and every lead worked."

---

## ⛔ Claims that must NOT appear (not backed by the product)

All of these were live until 2026-07-28 and were removed because nothing implements them. **Do not reintroduce any without checking `neo-backend` first.**

| Claim | Reality |
|---|---|
| "Spam filtering", "~99% of spam filtered/never billed", "blocks spam" | **No spam filtering exists in any layer.** No pre-answer screening, no Twilio add-on, no reputation check, no classifier. The honest version is: *calls under 15 seconds are never billed.* |
| "NEO handles calls **or texts**" | The SMS webhook handles STOP/START opt-out keywords **only**. Neo does not read, answer, or capture anything from an inbound customer text. |
| "Calendar & appointment booking" | Manual, case-by-case, $100 setup fee. Not self-serve, not automatic. |
| "Website AI chat widget" | Does not exist. |
| "Outbound reminder & follow-up calls" | Outbound exists for prospecting and recruiting, not as a customer feature. |
| "Extra numbers / multi-location support" | Not built. |

**Appointment *request* handling IS real** — Neo captures the caller's preferred time and texts it to the owner and the caller. Say "appointment request", never "books appointments".

**CRM integration IS real** but manual to set up — a per-customer webhook that pushes captured leads.

---

## Files

| File | Purpose |
|---|---|
| `index.html` | Homepage — hero, how it works, demo, pricing, Why NEO, FAQ |
| `index_es.html` | Spanish homepage. **Mirror of `index.html` — any change to one goes in the other in the same pass**, or the two sites quote different prices. |
| `pro-plan.html` | Plan detail page linked from the homepage |
| `training.html` | Rep training page (`/training`) — must stay in sync with `SALES-TRAINING.md` in `neo-backend` |
| `salestools.html` | Door hangers, sign riders, magnets — third-party print-on-demand links, no pricing |
| `apply.html` | Phone-rep job application → backend `/api/interview/apply` |
| `setup.html` | Post-signup setup instructions |
| `terms-of-service.html` / `-es.html`, `privacy-policy.html` / `-es.html`, `sms-messaging-policy.html` / `-es.html` | Legal. **Terms contains pricing — update it whenever pricing changes.** |
| `heygen-knowledge-base.md` | Source material for avatar videos |
| `audio/voice-*.mp3` | ElevenLabs voice samples |
| `website-preview/` | Redirect stub |

---

## Signup flow

All CTAs point at:

```
https://neo-backend-production-dbd6.up.railway.app/checkout?plan=pro
```

**⛔ Never link a raw `buy.stripe.com` Payment Link.** Provisioning is gated on intake form data cached under the Checkout Session id. A Payment Link skips `/checkout`, so the customer is **charged and provisioned nothing** — no phone number, no assistant, no welcome email, and no error raised. A live $99 Payment Link was linked from this site until 2026-07-16 for exactly this reason.

---

## Working rules

- **Push directly to `main`.** No feature branches, no PRs. `git push origin HEAD:main`.
- **Stage explicit paths.** Never `git add -A`.
- **English and Spanish change together**, always, in the same commit.
- **Pricing appears in more places than you expect** — homepage card, homepage CTA block, FAQ, `pro-plan.html` (including its `<meta name="description">`, which is what search results show), `training.html`, and the Terms of Service. Grep for the old figure after any change and confirm zero hits.
- **When pricing or capability changes, update `SALES-TRAINING.md` in `neo-backend` and `training.html` here in the same session.** Reps must never quote something the product doesn't do.
