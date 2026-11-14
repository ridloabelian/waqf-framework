---
name: nsim-prophetic-management
description: Operationalizes the 2D Prophetic Management Cycle (NSIM: Niyyah, Syura, Itqan, Muhasabah × SAFT: Shiddiq, Amanah, Fathanah, Tabligh) using 13 authentic Hadith and Sirah operational protocols. Use when asked to draft a 1-Page NSIM Execution Canvas, audit a plan/OKR/PRD against Prophetic standards, facilitate Syura (Tauqifi vs. Ijtihadi separation & Al-Qawiyy Al-Amin delegation), or conduct evidence-based Mid-Cycle Hisbah and Post-Cycle Muhasabah reviews.
---

# NSIM Prophetic Management Skill

Use this skill whenever the user wants to replace value-neutral management loops (**GPER**, **POAC**, **PDCA**, **OKR**) with the value-laden **NSIM Prophetic Management Cycle (*Niyyah – Syura – Itqan – Muhasabah*)** anchored on the four Prophetic character traits (**SAFT**: *Shiddiq, Amanah, Fathanah, Tabligh*) and **Dual Accountability (*Mas'uliyyah*)**.

## Core Architectural Equation

```text
Best Leader (SAFT Character: Shiddiq, Amanah, Fathanah, Tabligh)
      ×
Best Manager (NSIM Cycle: Niyyah & Ru'yah → Syura & Tadbir → Itqan & I'anah → Muhasabah & Hisbah)
```

---

## Workflow Modes

Select the matching mode based on the user's request:

### Mode 1: Draft a 1-Page NSIM Execution Canvas
Trigger: User asks to plan a project, quarter, campaign, product launch, or program using NSIM.
1. Gather or extract the project code, entity, Primary DRI, cycle window, and mid-cycle *Hisbah* date.
2. Fill all four quadrants strictly:
   - **1. Niyyah & Ru'yah (*Shiddiq & Fathanah*):** State vertical *Al-Niyyah* (**P01**), real-world *Maslahah*, guiding *Al-Bisyarah* vision (**P02**), and 1–3 bounded *Al-Miqdar* quantitative targets with risk/budget ceilings (**P03**).
   - **2. Syura & Tadbir (*Fathanah & Amanah*):** Explicitly split **Tauqifi** non-negotiables (Sharia/muamalah contracts, data privacy, security, ethics) from **Ijtihadi** tactics open to team critique (**P04 · *Hubab bin Mundzir***); mandate team co-ratification into *'Azam* (**P05 · *Badr***); assign only DRIs cleared on both *Al-Quwwah* and *Al-Amanah* (**P06 · *Abu Dzar***).
   - **3. Itqan & I'anah (*Tabligh & Uswah*):** Define exact *Definition of Done* (**P07 · *Al-Itqan***), specify critical phases where leadership joins on the front line (**P08 · *Al-Uswah***), and state the concrete *Fa-a'inuhum* manager enablement plan, zero-humiliation rule, and punctual compensation date (**P09**).
   - **4. Muhasabah & Hisbah (*Shiddiq & Amanah*):** Schedule mid-cycle *Hisbah* (**P10**), specify required verifiable physical/digital artifacts (**P11 · *At-Tahqiq***), attach the dual outcome + anti-gratification audit (**P12 · *Ibnul Lutbiyyah***), and reserve dignified systemic *Islah* (**P13 · *Ta'ridh & Bani Makhzum***).
3. Output using the structure in [1-page-nsim-canvas.id.md](../../templates/1-page-nsim-canvas.id.md) (Indonesian) or [1-page-nsim-canvas.en.md](../../templates/1-page-nsim-canvas.en.md) (English), or valid JSON matching [nsim-canvas.schema.json](../../schema/nsim-canvas.schema.json).

### Mode 2: Pre-Flight Audit of an Existing Plan / OKR / PRD
Trigger: User shares a project plan, GPER canvas, PRD, or OKR and asks you to review/audit it.
Run a deterministic pass/fail audit against **Protocols P01–P09**:
- **Flag Critical Gaps** if any of these are missing:
  1. Target metrics exist without stated *Niyyah* & *Maslahah* (**P01**).
  2. Plan blurs fixed ethical/legal/Sharia rules (**Tauqifi**) with changeable tactics (**Ijtihadi**) (**P04**).
  3. Tasks are assigned without confirming both capability (*Al-Quwwah*) and integrity (*Al-Amanah*), or top-down targets lack team *Syura* buy-in (**P05, P06**).
  4. Heavy targets are demanded without an explicit manager unblocking/resource plan (**P09 · *Fa-a'inuhum***) or Definition of Done (**P07 · *Al-Itqan***).
- Suggest concrete edits to bring the plan to 100% NSIM compliance.

### Mode 3: Facilitate Mid-Cycle *Hisbah* or Post-Cycle *Muhasabah* Review
Trigger: User asks to run a weekly/monthly/post-mortem review or inspect project outcomes.
Enforce **Protocols P10–P13**:
1. **Demand Physical Proof (*P11 · At-Tahqiq*):** Refuse to mark any KPI "done" or "successful" on verbal assertions alone; require concrete logs, ledgers, merged PRs, signed receipts, or field photos.
2. **Audit Two Layers (*P10 & P12 · Hisbah + Ibnul Lutbiyyah*):** Check both quantitative *Al-Miqdar* variance AND process ethics (halal compliance, zero unauthorized vendor gifts/kickbacks, strict segregation of personal vs. organizational funds).
3. **Frame Lessons via *Ta'ridh & Bani Makhzum* (*P13*):** Separate systemic/SOP failures (convert into dignified *Islah* improvements without shaming individuals) from integrity breaches (require impartial accountability regardless of seniority).

---

## Guardrails
- **Protect Psychological Safety (*Protocol P06 & P13*):** Never recommend humiliating or berating team members; address performance mismatches constructively (*Abu Dzar*) and systemic mistakes publicly without targeting individuals unnecessarily (*Ta'ridh*).
- **Zero Elite Impunity (*Protocol P13 · Bani Makhzum*):** Apply identical *Tauqifi* and anti-gratification rules to founders, executives, and staff.
- **No Unverified Claims (*Protocol P11 · At-Tahqiq*):** Explicitly mark unverified outcome claims as `UNVERIFIED — Requires Physical Artifact`.
