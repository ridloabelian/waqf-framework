# AGENTS.md — AI Agent Contract for `ridloabelian/waqf-framework`

This repository is the **Institutional & Open-Standard Adoption Spearhead** for **`Standard WAQF-v1.3`** (`waqf-framework/1.3.0`), replacing value-neutral Western loops (`PDCA`, `POAC`, `MBO`, `OKR`, `4DX`) with the 2D **WAQF (`Wijhah – 'Azam – Qiyam – Fahs`) × SAFT (`Shiddiq – Amanah – Fathanah – Tabligh`)** Prophetic Management Cycle.

## 1. Non-Negotiable *Tauqifi* Invariants (Never Violate)

1. **Architecture & Protocol Integrity:** Preserve the 4 stages (`Wijhah`, `'Azam`, `Qiyam`, `Fahs`), 4 Prophetic traits (`Shiddiq`, `Amanah`, `Fathanah`, `Tabligh`), Dual Accountability (*Mas'uliyyah*), all 13 Hadith/Sirah protocols (`P01–P13`), the 6 *Ijtihadi* velocity engines (`Idiot Index RAB`, `Single-Fire ≥80%`, `70% Data + Delete ≥20–30% Bureaucracy`, `1-Question DRI Truth Test`, `Goldilocks +4% / Protected Maker Timeblock 3–4h / ≥80% Signal / Skip-Level`, `Reverse Negative Feedback + 5-Hour Semantic Tree`), and the ***La Yuqallad* human guardrail** (`≥6h` sleep, zero 100–120h burnout sprints, zero humiliation, `H+0` punctual pay).
2. **Zero-Bloat Rule (`SURGE-2026-W48`):** Keep **zero external npm dependencies** and zero `node_modules` in this repository. All tooling in `scripts/` must use built-in Node.js standard library modules only.
3. **No Unverified Claims (`P11 · At-Tahqiq`):** Never mark KPIs, examples, or audits as verified without verifiable metrics/artifacts. Keep empirical figures (such as the `1 : 4,11` Clean-Water SROI audit: `80.9%` GL traceability, `-32.7%` deduplication `39,144 → 26,357` unique beneficiaries, `Akad 01 WPAIR Rp 41.510.003 + geoelectric rig Rp 42M`) exact.

## 2. Canonical Zero-Drift Lockstep Matrix

Whenever `schema/`, `templates/`, `docs/`, or version metadata change, keep all targets synchronized:

- **Schema & Validator:** `schema/waqf-canvas.schema.json` (`waqf-framework/1.3.0`), `scripts/waqf-cli.mjs`, `package.json`
- **Metadata & Licensing:** `CITATION.cff` (`version: "1.3.0"`), `LICENSE` (`CC-BY-SA-4.0` for docs/templates/MD vs. `MIT` for schema/CLI/JSON/skills/`.github`)
- **Core Specs & Docs:** `README.md`, `docs/SOP_Siklus_Manajemen_Profetik_WAQF.md`, `docs/WAQF_WHITEPAPER_EN.md`
- **Templates & Forms:** `templates/1-page-waqf-canvas.{id,en}.md`, `templates/obsidian-waqf-projectnote.md`, `templates/cadence-agendas.md`, `.github/ISSUE_TEMPLATE/{waqf-initiative,hisbah-muhasabah-review}.yml`, `.github/pull_request_template.md`
- **Agent & Examples:** `skills/waqf-prophetic-management/SKILL.md`, `examples/*.{json,md}`
- **Canonical External Truth (`ridlo.id`):**
  - Spec & Hub: `https://ridlo.id/waqf-framework` & `https://ridlo.id/waqf-framework.md`
  - Knowledge Graph Anchors: `ZK-035` (`/notes/waqf-prophetic-management-cycle-wijhah-azam-qiyam-fahs`), `ZK-041` (`/notes/semantic-tree-expert-interrogation-negative-feedback-loop`), `ZK-042` (`/notes/single-fire-surge-signal-to-noise-goldilocks-flow`)
  - Production SROI Proof: `https://ridlo.id/posts/audit-forensik-at-tahqiq-sroi-air-bersih-wakaf`

## 3. Mandatory Verification Before Commit

Run both commands and ensure exit code `0` before committing or proposing any PR:

```bash
node scripts/waqf-cli.mjs test
node scripts/waqf-cli.mjs check-drift --remote
```

Use `node scripts/waqf-cli.mjs render <file.json> --lang id|en --out <file.md>` after updating any `.json` file in `examples/` so JSON and Markdown canvases stay identical.
