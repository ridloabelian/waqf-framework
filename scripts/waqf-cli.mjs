#!/usr/bin/env node
/**
 * WAQF Framework Zero-Dependency CLI (Standard WAQF-v1.3)
 * Validates JSON canvases against schema/waqf-canvas.schema.json, renders 1-Page Markdown canvases,
 * initializes new canvases, and enforces zero-drift consistency across repo files and ridlo.id.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const SCHEMA_PATH = path.join(ROOT_DIR, "schema", "waqf-canvas.schema.json");
const REMOTE_SPEC_URL = "https://ridlo.id/waqf-framework.md";

function loadSchema() {
  return JSON.parse(fs.readFileSync(SCHEMA_PATH, "utf8"));
}

function isValidDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

function validateAgainstSchema(value, schema, pointer = "$", errors = []) {
  if (!schema || typeof schema !== "object") return errors;

  if (schema.type) {
    const typeOk =
      (schema.type === "object" && value !== null && typeof value === "object" && !Array.isArray(value)) ||
      (schema.type === "array" && Array.isArray(value)) ||
      (schema.type === "string" && typeof value === "string") ||
      (schema.type === "number" && typeof value === "number" && Number.isFinite(value)) ||
      (schema.type === "integer" && Number.isInteger(value)) ||
      (schema.type === "boolean" && typeof value === "boolean");
    if (!typeOk) {
      errors.push(`${pointer}: expected type ${schema.type}, got ${Array.isArray(value) ? "array" : value === null ? "null" : typeof value}`);
      return errors;
    }
  }

  if (Object.hasOwn(schema, "const") && value !== schema.const) {
    errors.push(`${pointer}: must equal constant ${JSON.stringify(schema.const)}, got ${JSON.stringify(value)}`);
  }

  if (Array.isArray(schema.enum) && !schema.enum.includes(value)) {
    errors.push(`${pointer}: must be one of [${schema.enum.join(", ")}], got ${JSON.stringify(value)}`);
  }

  if (typeof value === "string") {
    if (typeof schema.minLength === "number" && value.length < schema.minLength) {
      errors.push(`${pointer}: length ${value.length} is below minLength ${schema.minLength}`);
    }
    if (typeof schema.maxLength === "number" && value.length > schema.maxLength) {
      errors.push(`${pointer}: length ${value.length} exceeds maxLength ${schema.maxLength}`);
    }
    if (typeof schema.pattern === "string" && !new RegExp(schema.pattern).test(value)) {
      errors.push(`${pointer}: value ${JSON.stringify(value)} does not match pattern ${schema.pattern}`);
    }
    if (schema.format === "date" && !isValidDate(value)) {
      errors.push(`${pointer}: invalid calendar date ${JSON.stringify(value)} (expected YYYY-MM-DD)`);
    }
  }

  if (typeof value === "number") {
    if (typeof schema.minimum === "number" && value < schema.minimum) {
      errors.push(`${pointer}: ${value} is below minimum ${schema.minimum}`);
    }
    if (typeof schema.maximum === "number" && value > schema.maximum) {
      errors.push(`${pointer}: ${value} exceeds maximum ${schema.maximum}`);
    }
  }

  if (Array.isArray(value)) {
    if (typeof schema.minItems === "number" && value.length < schema.minItems) {
      errors.push(`${pointer}: array length ${value.length} is below minItems ${schema.minItems}`);
    }
    if (typeof schema.maxItems === "number" && value.length > schema.maxItems) {
      errors.push(`${pointer}: array length ${value.length} exceeds maxItems ${schema.maxItems}`);
    }
    if (schema.uniqueItems) {
      const seen = new Set(value.map((item) => JSON.stringify(item)));
      if (seen.size !== value.length) {
        errors.push(`${pointer}: array items must be unique`);
      }
    }
    if (schema.items) {
      value.forEach((item, idx) => validateAgainstSchema(item, schema.items, `${pointer}[${idx}]`, errors));
    }
  }

  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    const props = schema.properties || {};
    if (Array.isArray(schema.required)) {
      for (const reqKey of schema.required) {
        if (!Object.hasOwn(value, reqKey)) {
          errors.push(`${pointer}: missing required property '${reqKey}'`);
        }
      }
    }
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!Object.hasOwn(props, key)) {
          errors.push(`${pointer}: unexpected property '${key}' (additionalProperties: false)`);
        }
      }
    }
    for (const [key, propSchema] of Object.entries(props)) {
      if (Object.hasOwn(value, key)) {
        validateAgainstSchema(value[key], propSchema, `${pointer}.${key}`, errors);
      }
    }
  }

  return errors;
}

function evaluateProtocolReadiness(canvas) {
  const meta = canvas.metadata || {};
  const w = canvas.w_wijhah || {};
  const a = canvas.a_azam || {};
  const q = canvas.q_qiyam || {};
  const f = canvas.f_fahs || {};
  const gates = meta.gates;
  const audit = f.ibnul_lutbiyyah_audit || {};

  const checks = {
    P01: Boolean(w.al_niyyah_vertical && w.maslahah_horizontal),
    P02: Boolean(w.al_bisyarah_vision),
    P03: Boolean(w.al_miqdar_targets?.length >= 1 && w.idiot_index_and_single_fire),
    P04: Boolean(a.tauqifi_guardrails?.length >= 1 && a.ijtihadi_tactics?.length >= 1 && a.deleted_bureaucracy_steps?.length >= 1 && typeof a.decision_data_threshold_pct === "number"),
    P05: Boolean(a.azam_ratified && a.kill_trigger),
    P06: Boolean(a.tafwidh_delegation?.length >= 1 && a.tafwidh_delegation.every((d) => d.al_quwwah_verified && d.al_amanah_verified)),
    P07: Boolean(q.definition_of_done?.length >= 1 && q.protected_maker_timeblock && typeof q.signal_floor_pct === "number" && q.goldilocks_stretch),
    P08: Boolean(q.uswah_touchpoints?.length >= 1),
    P09: Boolean(q.fa_ainuhum_support?.manager_unblocking_plan && q.fa_ainuhum_support?.zero_humiliation_pledge && q.fa_ainuhum_support?.timely_compensation_commitment),
    P10: Boolean((gates?.mid_post_flight_p10_p13_passed ?? true) && f.mid_cycle_hisbah_findings && !/^pending/i.test(f.mid_cycle_hisbah_findings) && f.external_negative_feedback?.length >= 1),
    P11: Boolean(f.at_tahqiq_artifacts?.length >= 1 && f.at_tahqiq_artifacts.every((art) => art.verified === true)),
    P12: Boolean(audit.integrity_status === "clean" && audit.asset_segregation_verified === true && audit.zero_unauthorized_gifts_declared === true),
    P13: Boolean((gates?.mid_post_flight_p10_p13_passed ?? true) && f.islah_actions?.length >= 1 && f.pre_expansion_semantic_tree_verified === true),
  };

  const gate1Keys = ["P01", "P02", "P03", "P04", "P05", "P06", "P07", "P08", "P09"];
  const gate2Keys = ["P10", "P11", "P12", "P13"];
  return {
    checks,
    gate1Count: gate1Keys.filter((k) => checks[k]).length,
    gate2Count: gate2Keys.filter((k) => checks[k]).length,
  };
}

function collectJsonFiles(targets) {
  const files = [];
  for (const rawTarget of targets) {
    const resolved = path.resolve(process.cwd(), rawTarget);
    if (!fs.existsSync(resolved)) {
      throw new Error(`Path not found: ${rawTarget}`);
    }
    const stat = fs.statSync(resolved);
    if (stat.isDirectory()) {
      const entries = fs.readdirSync(resolved, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
      for (const entry of entries) {
        const full = path.join(resolved, entry.name);
        if (entry.isDirectory()) {
          files.push(...collectJsonFiles([full]));
        } else if (entry.isFile() && entry.name.endsWith(".json")) {
          files.push(full);
        }
      }
    } else {
      files.push(resolved);
    }
  }
  return files;
}

function cmdValidate(args) {
  if (args.length === 0) {
    console.error("Usage: node scripts/waqf-cli.mjs validate <file.json|dir...>");
    process.exit(2);
  }
  const schema = loadSchema();
  const files = collectJsonFiles(args);
  if (files.length === 0) {
    console.error("No JSON files found to validate.");
    process.exit(1);
  }

  let failed = 0;
  for (const file of files) {
    const rel = path.relative(ROOT_DIR, file) || file;
    let payload;
    try {
      payload = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (err) {
      console.error(`FAIL ${rel}: invalid JSON (${err.message})`);
      failed += 1;
      continue;
    }
    const errors = validateAgainstSchema(payload, schema);
    if (errors.length > 0) {
      console.error(`FAIL ${rel}: ${errors.length} schema violation(s)`);
      for (const e of errors) console.error(`  - ${e}`);
      failed += 1;
    } else {
      const readiness = evaluateProtocolReadiness(payload);
      console.log(
        `PASS ${rel} [${payload.metadata.project_code} · status=${payload.metadata.status}] — Gate 1 (P01–P09): ${readiness.gate1Count}/9 | Gate 2 (P10–P13): ${readiness.gate2Count}/4`,
      );
    }
  }
  if (failed > 0) process.exit(1);
}

function escapeCell(text) {
  return String(text ?? "")
    .replaceAll("|", "\\|")
    .replace(/\r?\n/g, "<br>");
}

function joinList(items) {
  if (!Array.isArray(items) || items.length === 0) return "-";
  return items.map((s) => escapeCell(s).replace(/\.+$/, "")).join("; ");
}

function renderMarkdown(canvas, lang = "id") {
  const isId = lang !== "en";
  const m = canvas.metadata;
  const w = canvas.w_wijhah;
  const a = canvas.a_azam;
  const q = canvas.q_qiyam;
  const f = canvas.f_fahs;
  const readiness = evaluateProtocolReadiness(canvas);

  const labels = isId
    ? {
        heading: `# Kanvas Kerja 1 Halaman — ${m.title}`,
        sub: `> **Standard \`${canvas.schema_version}\`** (*Wijhah – 'Azam – Qiyam – Fahs* × *SAFT: Shiddiq – Amanah – Fathanah – Tabligh*) · Dihasilkan deterministik oleh \`scripts/waqf-cli.mjs\``,
        metaHead: "## Header & Mandat Amanah",
        attr: "Atribut",
        val: "Isian",
        matrixHead: "## Matriks Eksekusi 4 Kuadran WAQF",
        checklistHead: "## Checklist Kepatuhan 13 Protokol (`P01–P13`)",
        preHead: "### Gerbang 1 · Pre-Flight Gate (`P01–P09`)",
        postHead: "### Gerbang 2 · Mid-Cycle & Post-Flight Gate (`P10–P13`)",
        gateLine: m.gates
          ? `Pre-Flight: \`${m.gates.pre_flight_p01_p09_passed ? "LULUS" : "BELUM"}\` · Mid/Post-Flight: \`${m.gates.mid_post_flight_p10_p13_passed ? "LULUS" : "PROSES/PENDING"}\``
          : "Mengacu pada verifikasi field kanvas",
      }
    : {
        heading: `# 1-Page WAQF Execution Canvas — ${m.title}`,
        sub: `> **Standard \`${canvas.schema_version}\`** (*Wijhah – 'Azam – Qiyam – Fahs* × *SAFT: Shiddiq – Amanah – Fathanah – Tabligh*) · Deterministically rendered by \`scripts/waqf-cli.mjs\``,
        metaHead: "## Header & Stewardship Mandate",
        attr: "Field",
        val: "Entry",
        matrixHead: "## 4-Quadrant WAQF Execution Matrix",
        checklistHead: "## 13 Prophetic Hadith Protocols Checklist (`P01–P13`)",
        preHead: "### Gate 1 · Pre-Flight Gate (`P01–P09`)",
        postHead: "### Gate 2 · Mid-Cycle & Post-Flight Gate (`P10–P13`)",
        gateLine: m.gates
          ? `Pre-Flight: \`${m.gates.pre_flight_p01_p09_passed ? "PASSED" : "PENDING"}\` · Mid/Post-Flight: \`${m.gates.mid_post_flight_p10_p13_passed ? "PASSED" : "IN PROGRESS"}\``
          : "Derived from canvas verification fields",
      };

  const targetsMd = w.al_miqdar_targets
    .map((t, i) => `${i + 1}. **${escapeCell(t.metric)}:** ${escapeCell(t.target_value)} *(Deadline: ${t.deadline}${t.risk_or_budget_ceiling ? ` · Ceiling: ${escapeCell(t.risk_or_budget_ceiling)}` : ""})*`)
    .join("<br>");

  const delegationMd = a.tafwidh_delegation
    .map((d) => `- **${escapeCell(d.member_name)}** → ${escapeCell(d.role)} *(Al-Quwwah: ${d.al_quwwah_verified ? "OK" : "TBD"}, Al-Amanah: ${d.al_amanah_verified ? "OK" : "TBD"})*`)
    .join("<br>");

  const artifactsMd = (f.at_tahqiq_artifacts || []).length
    ? f.at_tahqiq_artifacts.map((x) => `- [${x.verified ? "VERIFIED" : "PENDING"}] **${escapeCell(x.kpi_name)}:** ${escapeCell(x.artifact_uri_or_ref)}`).join("<br>")
    : "- *(No verified artifacts attached yet)*";

  const wCell = [
    `**1.1 *Al-Niyyah & Maslahah* (\`P01\`):**<br>- *Vertical:* ${escapeCell(w.al_niyyah_vertical)}<br>- *Maslahah:* ${escapeCell(w.maslahah_horizontal)}`,
    `**1.2 *Al-Bisyarah* (\`P02\`):** ${escapeCell(w.al_bisyarah_vision)}`,
    `**1.3 *Al-Miqdar*, *Idiot Index* & *Single-Fire* (\`P03\`):**<br>${targetsMd}${w.idiot_index_and_single_fire ? `<br>- *Idiot Index & Single-Fire:* ${escapeCell(w.idiot_index_and_single_fire)}` : ""}`,
  ].join("<br><br>");

  const aCell = [
    `**2.1 *Tauqifi* 100% Guardrails (\`P04\`):**<br>${a.tauqifi_guardrails.map((g) => `- ${escapeCell(g)}`).join("<br>")}`,
    `**2.2 *Ijtihadi* (${a.decision_data_threshold_pct ?? 70}% Data), Bureaucracy Deletion & Kill Trigger (\`P04–P05\`):**<br>- *Deleted Steps:* ${joinList(a.deleted_bureaucracy_steps)}<br>- *Tactics:* ${joinList(a.ijtihadi_tactics)}<br>- *Kill Trigger:* ${escapeCell(a.kill_trigger || "-")}`,
    `**2.3 *Al-Qawiyy Al-Amin* Delegation (\`P06\`):**<br>${delegationMd}`,
    `**2.4 *'Azam* Ratified (\`P05\`):** \`${a.azam_ratified}\`${a.azam_ratified_date ? ` (${a.azam_ratified_date})` : ""}`,
  ].join("<br><br>");

  const qCell = [
    `**3.1 *Al-Itqan* (\`P07\` · Signal ≥ ${q.signal_floor_pct ?? 80}%):**<br>- *DoD:* ${joinList(q.definition_of_done)}<br>- *Goldilocks:* ${escapeCell(q.goldilocks_stretch || "-")}<br>- *Maker Timeblock:* ${escapeCell(q.protected_maker_timeblock || "-")}`,
    `**3.2 *Al-Uswah Al-Hasanah* (\`P08\`):**<br>${q.uswah_touchpoints.map((u) => `- ${escapeCell(u)}`).join("<br>")}`,
    `**3.3 *Fa-a'inuhum* & *La Yuqallad* (\`P09\`):**<br>- *Resources:* ${joinList(q.fa_ainuhum_support.provisioned_resources)}<br>- *Skip-Level & La Yuqallad:* ${escapeCell(q.fa_ainuhum_support.manager_unblocking_plan)}<br>- *Zero Humiliation:* \`${q.fa_ainuhum_support.zero_humiliation_pledge}\` · *Pay SLA:* ${escapeCell(q.fa_ainuhum_support.timely_compensation_commitment)}`,
  ].join("<br><br>");

  const fCell = [
    `**4.1 *Hisbah* & Negative Feedback (\`P10\`):**<br>- *Hisbah:* ${escapeCell(f.mid_cycle_hisbah_findings)}<br>- *External Negative Feedback:* ${joinList(f.external_negative_feedback)}`,
    `**4.2 *At-Tahqiq* Artifacts (\`P11\`):**<br>${artifactsMd}`,
    `**4.3 *Ibnul Lutbiyyah* Dual Audit (\`P12\`):**<br>- *Status:* \`${f.ibnul_lutbiyyah_audit.integrity_status.toUpperCase()}\` · *Segregation:* \`${f.ibnul_lutbiyyah_audit.asset_segregation_verified}\` · *Zero Gifts:* \`${f.ibnul_lutbiyyah_audit.zero_unauthorized_gifts_declared}\`<br>- *Summary:* ${escapeCell(f.ibnul_lutbiyyah_audit.outcome_summary)}`,
    `**4.4 *Islah* & Semantic Tree (\`P13\` · Tree=${Boolean(f.pre_expansion_semantic_tree_verified)}):**<br>${(f.islah_actions || []).map((act) => `- ${escapeCell(act)}`).join("<br>") || "-"}`,
  ].join("<br><br>");

  const mark = (k) => (readiness.checks[k] ? "x" : " ");

  const protocolLinesPre = isId
    ? [
        `- [${mark("P01")}] **P01 · *Innamal A'malu bin-Niyyat*:** Al-Niyyah vertikal & Maslahah nyata bebas mudarat.`,
        `- [${mark("P02")}] **P02 · *Al-Bisyarah*:** Visi menang penuntun ditetapkan.`,
        `- [${mark("P03")}] **P03 · *Al-Miqdar*:** 1–3 target terukur, pagu risiko, Idiot Index RAB & Single-Fire (≥80%).`,
        `- [${mark("P04")}] **P04 · *Hubab bin Mundzir*:** 100% Tauqifi terpisah dari ≥70% Ijtihadi + ≥20–30% birokrasi dihapus pra-otomasi.`,
        `- [${mark("P05")}] **P05 · *Badar*:** Syura ber-timebox mengesahkan 'Azam kolektif + Kill / Rollback Trigger.`,
        `- [${mark("P06")}] **P06 · *Abu Dzar Al-Ghifari*:** DRI lulus 1-Question Truth Test (Al-Quwwah) & Al-Amanah.`,
        `- [${mark("P07")}] **P07 · *Al-Itqan*:** Definition of Done, Goldilocks +4%, Protected Maker Timeblock & ≥80% Signal.`,
        `- [${mark("P08")}] **P08 · *Al-Uswah Al-Hasanah*:** Ko-lokalisasi pemimpin di titik bottleneck aktif.`,
        `- [${mark("P09")}] **P09 · *Fa-a'inuhum*:** Unblocking skip-level, pagar La Yuqallad (≥6j tidur, nol overwork 120j/celaan) & bayar H+0.`,
      ]
    : [
        `- [${mark("P01")}] **P01 · *Innamal A'malu bin-Niyyat*:** Vertical Al-Niyyah and concrete zero-harm Maslahah documented.`,
        `- [${mark("P02")}] **P02 · *Al-Bisyarah*:** Compelling strategic horizon established.`,
        `- [${mark("P03")}] **P03 · *Al-Miqdar*:** 1–3 bounded targets, risk cap, RAB Idiot Index & Single-Fire (≥80%) locked.`,
        `- [${mark("P04")}] **P04 · *Hubab bin Mundzir*:** 100% Tauqifi separated from ≥70% Ijtihadi + ≥20–30% bureaucracy deleted pre-automation.`,
        `- [${mark("P05")}] **P05 · *Badr*:** Timeboxed Syura ratified collective 'Azam + Kill / Rollback Trigger.`,
        `- [${mark("P06")}] **P06 · *Abu Dzar Al-Ghifari*:** DRI passed 1-Question Truth Test (Al-Quwwah) & Al-Amanah.`,
        `- [${mark("P07")}] **P07 · *Al-Itqan*:** Definition of Done, Goldilocks +4%, Protected Maker Timeblock & ≥80% Signal.`,
        `- [${mark("P08")}] **P08 · *Al-Uswah Al-Hasanah*:** Frontline bottleneck leader co-location scheduled.`,
        `- [${mark("P09")}] **P09 · *Fa-a'inuhum*:** Skip-level unblocking, La Yuqallad floor (≥6h sleep, no 120h overwork/abuse) & H+0 pay.`,
      ];

  const protocolLinesPost = isId
    ? [
        `- [${mark("P10")}] **P10 · *Hisbah / Taftish*:** Inspeksi tengah siklus & perburuan External Negative Feedback dijalankan.`,
        `- [${mark("P11")}] **P11 · *At-Tahqiq (Dua Pemuda Badar)*:** Seluruh klaim KPI ditopang bukti fisik/ledger terverifikasi.`,
        `- [${mark("P12")}] **P12 · *Ibnul Lutbiyyah*:** Audit capaian Al-Miqdar, pemisahan akad/aset & bebas gratifikasi berstatus CLEAN.`,
        `- [${mark("P13")}] **P13 · *Ta'ridh & Bani Makhzum*:** Islah SOP bermartabat & Semantic Tree (5-Hour Trunk) pra-ekspansi terverifikasi.`,
      ]
    : [
        `- [${mark("P10")}] **P10 · *Hisbah / Taftish*:** Mid-cycle inspection & External Negative Feedback hunting completed.`,
        `- [${mark("P11")}] **P11 · *At-Tahqiq (Two Youths of Badr)*:** Every KPI claim backed by verified physical/ledger artifacts.`,
        `- [${mark("P12")}] **P12 · *Ibnul Lutbiyyah*:** Al-Miqdar results, contract/asset segregation & zero-gratification audit marked CLEAN.`,
        `- [${mark("P13")}] **P13 · *Ta'ridh & Bani Makhzum*:** Dignified SOP Islah & pre-expansion Semantic Tree (5-Hour Trunk) verified.`,
      ];

  return [
    labels.heading,
    labels.sub,
    "",
    labels.metaHead,
    "",
    `| ${labels.attr} | ${labels.val} |`,
    "| :--- | :--- |",
    `| **Project Code** | \`${m.project_code}\` |`,
    `| **Entity / Unit** | ${escapeCell(m.entity)} |`,
    `| **Primary DRI (*Al-Qawiyy Al-Amin*)** | ${escapeCell(m.primary_dri)} |`,
    `| **SAFT Pillars** | ${(m.saft_pillars || []).join(" · ") || "-"} |`,
    `| **Cycle Window** | \`${m.cycle_start}\` → \`${m.cycle_end}\`${m.hisbah_date ? ` *(Hisbah: \`${m.hisbah_date}\`)*` : ""} |`,
    `| **Lifecycle Status** | \`${m.status}\` |`,
    `| **Dual-Gate Status** | ${labels.gateLine} |`,
    "",
    labels.matrixHead,
    "",
    "| **W — WIJHAH** *(Niyyah, Ru'yah & Al-Miqdar)* | **A — 'AZAM** *(Syura, Tadbir & Tafwidh)* |",
    "| :--- | :--- |",
    `| ${wCell} | ${aCell} |`,
    "| **Q — QIYAM** *(Itqan, Uswah & I'anah)* | **F — FAHS** *(Hisbah, At-Tahqiq & Muhasabah)* |",
    `| ${qCell} | ${fCell} |`,
    "",
    labels.checklistHead,
    "",
    labels.preHead,
    ...protocolLinesPre,
    "",
    labels.postHead,
    ...protocolLinesPost,
    "",
  ].join("\n");
}

function cmdRender(args) {
  const fileArg = args.find((a) => !a.startsWith("--"));
  if (!fileArg) {
    console.error("Usage: node scripts/waqf-cli.mjs render <file.json> [--lang id|en] [--out <file.md>]");
    process.exit(2);
  }
  const langIdx = args.indexOf("--lang");
  const lang = langIdx !== -1 && args[langIdx + 1] ? args[langIdx + 1] : "id";
  const outIdx = args.indexOf("--out");
  const outPath = outIdx !== -1 && args[outIdx + 1] ? args[outIdx + 1] : null;

  const fullPath = path.resolve(process.cwd(), fileArg);
  const payload = JSON.parse(fs.readFileSync(fullPath, "utf8"));
  const errors = validateAgainstSchema(payload, loadSchema());
  if (errors.length > 0) {
    console.error(`Cannot render invalid JSON (${fileArg}):`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }

  const md = renderMarkdown(payload, lang);
  if (outPath) {
    const resolvedOut = path.resolve(process.cwd(), outPath);
    fs.writeFileSync(resolvedOut, md, "utf8");
    console.log(`RENDERED ${path.relative(ROOT_DIR, resolvedOut) || resolvedOut}`);
  } else {
    process.stdout.write(md);
  }
}

function cmdInit(args) {
  const code = args.find((a) => !a.startsWith("--"));
  if (!code || !/^[A-Z0-9_-]{3,40}$/.test(code)) {
    console.error("Usage: node scripts/waqf-cli.mjs init <PROJECT_CODE> [--out <file.json>] (code must match ^[A-Z0-9_-]{3,40}$)");
    process.exit(2);
  }
  const outIdx = args.indexOf("--out");
  const outPath = outIdx !== -1 && args[outIdx + 1] ? args[outIdx + 1] : null;
  const today = new Date().toISOString().slice(0, 10);
  const starter = {
    schema_version: "waqf-framework/1.3.0",
    metadata: {
      project_code: code,
      title: `${code} — WAQF Execution Initiative`,
      entity: "Organization / Foundation Unit",
      primary_dri: "Primary DRI Name",
      saft_pillars: ["Shiddiq", "Amanah", "Fathanah", "Tabligh"],
      cycle_start: today,
      hisbah_date: today,
      cycle_end: today,
      status: "draft",
      gates: {
        pre_flight_p01_p09_passed: false,
        mid_post_flight_p10_p13_passed: false,
      },
    },
    w_wijhah: {
      al_niyyah_vertical: "Vertical intention worthy before Allah without hidden ego.",
      maslahah_horizontal: "Concrete measurable benefit for beneficiaries with zero harm.",
      al_bisyarah_vision: "Medium-term winning horizon anchoring team resilience.",
      idiot_index_and_single_fire: "RAB Idiot Index checked; >=80% Single-Fire focus on 1 bottleneck.",
      al_miqdar_targets: [
        {
          metric: "Primary Outcome KPI",
          target_value: "100% DoD target achieved",
          deadline: today,
          risk_or_budget_ceiling: "Bounded budget & capital cap",
        },
      ],
    },
    a_azam: {
      tauqifi_guardrails: ["100% Sharia contract compliance, data privacy, and legal segregation"],
      ijtihadi_tactics: ["Move at >=70% data sufficiency with rapid field iteration"],
      decision_data_threshold_pct: 70,
      deleted_bureaucracy_steps: ["Removed >=20-30% redundant approval layers before automation"],
      kill_trigger: "Objective metric or budget variance threshold triggering immediate pause/rollback.",
      tafwidh_delegation: [
        {
          member_name: "Primary DRI Name",
          role: "Primary DRI (1-Question Truth Test Passed)",
          al_quwwah_verified: true,
          al_amanah_verified: true,
        },
      ],
      azam_ratified: true,
      azam_ratified_date: today,
    },
    q_qiyam: {
      definition_of_done: ["Explicit verifiable DoD artifact with zero verbal-only claims"],
      signal_floor_pct: 80,
      goldilocks_stretch: "+4% stretch above proven baseline",
      protected_maker_timeblock: "08:00-12:00 Zero-Meeting Deep Work Window (Async-first except P0)",
      uswah_touchpoints: ["Leader co-locates directly at active bottleneck until resolved"],
      fa_ainuhum_support: {
        provisioned_resources: ["Required tools, ledger access, and allocated budget"],
        manager_unblocking_plan: "Fastest skip-level unblocking under La Yuqallad guardrails (>=6h sleep, no extreme overwork).",
        zero_humiliation_pledge: true,
        timely_compensation_commitment: "H+0 settlement upon verified BAST/invoice",
      },
    },
    f_fahs: {
      mid_cycle_hisbah_findings: "PENDING — Scheduled mid-cycle inspection and external negative feedback hunt.",
      external_negative_feedback: [],
      at_tahqiq_artifacts: [],
      ibnul_lutbiyyah_audit: {
        outcome_summary: "Pending post-cycle dual outcome & anti-gratification audit.",
        integrity_status: "pending",
        asset_segregation_verified: false,
        zero_unauthorized_gifts_declared: false,
      },
      pre_expansion_semantic_tree_verified: false,
      islah_actions: [],
    },
  };

  const jsonOut = JSON.stringify(starter, null, 2) + "\n";
  if (outPath) {
    const resolvedOut = path.resolve(process.cwd(), outPath);
    fs.writeFileSync(resolvedOut, jsonOut, "utf8");
    console.log(`CREATED ${path.relative(ROOT_DIR, resolvedOut) || resolvedOut}`);
  } else {
    process.stdout.write(jsonOut);
  }
}

async function cmdCheckDrift(args) {
  const remote = args.includes("--remote");
  const failures = [];
  const readText = (relPath) => fs.readFileSync(path.join(ROOT_DIR, relPath), "utf8");

  const schema = loadSchema();
  const pkg = JSON.parse(readText("package.json"));
  const citation = readText("CITATION.cff");
  const versionMatch = citation.match(/^version:\s*"([^"]+)"/m);
  const cffVersion = versionMatch ? versionMatch[1] : null;

  if (pkg.version !== "1.3.0") failures.push(`package.json version is ${pkg.version}, expected 1.3.0`);
  if (cffVersion !== "1.3.0") failures.push(`CITATION.cff version is ${cffVersion}, expected 1.3.0`);
  if (schema.properties?.schema_version?.const !== "waqf-framework/1.3.0") {
    failures.push(`schema_version const is ${schema.properties?.schema_version?.const}, expected waqf-framework/1.3.0`);
  }

  const v13Files = [
    "README.md",
    "AGENTS.md",
    "docs/SOP_Siklus_Manajemen_Profetik_WAQF.md",
    "docs/WAQF_WHITEPAPER_EN.md",
    "templates/1-page-waqf-canvas.id.md",
    "templates/1-page-waqf-canvas.en.md",
    "templates/obsidian-waqf-projectnote.md",
    "templates/cadence-agendas.md",
    "skills/waqf-prophetic-management/SKILL.md",
    ".github/ISSUE_TEMPLATE/waqf-initiative.yml",
  ];
  for (const file of v13Files) {
    const content = readText(file);
    if (!/(WAQF-v1\.3|waqf-framework-v1\.3|\(`v1\.3`\)|v1\.3)/i.test(content)) {
      failures.push(`${file}: missing v1.3 version marker`);
    }
  }

  const timeblockFiles = [
    "README.md",
    "docs/SOP_Siklus_Manajemen_Profetik_WAQF.md",
    "docs/WAQF_WHITEPAPER_EN.md",
    "templates/1-page-waqf-canvas.id.md",
    "templates/1-page-waqf-canvas.en.md",
    "templates/cadence-agendas.md",
    "skills/waqf-prophetic-management/SKILL.md",
    ".github/ISSUE_TEMPLATE/waqf-initiative.yml",
  ];
  for (const file of timeblockFiles) {
    const content = readText(file);
    if (!/(Protected Maker Timeblock|Zero-Meeting)/i.test(content)) {
      failures.push(`${file}: missing Protected Maker Timeblock / Zero-Meeting reference`);
    }
  }

  const obsidianNote = readText("templates/obsidian-waqf-projectnote.md");
  for (const st of ["azam-ratified", "qiyam-execution", "mid-cycle-hisbah", "closed-islah"]) {
    if (!obsidianNote.includes(st)) {
      failures.push(`templates/obsidian-waqf-projectnote.md: missing canonical status '${st}'`);
    }
  }

  const examplesDir = path.join(ROOT_DIR, "examples");
  if (!fs.existsSync(examplesDir)) {
    failures.push("examples/ directory is missing");
  } else {
    const exampleJsons = fs.readdirSync(examplesDir).filter((n) => n.endsWith(".json")).sort();
    if (exampleJsons.length === 0) failures.push("examples/ contains no JSON examples");
    for (const jf of exampleJsons) {
      const payload = JSON.parse(fs.readFileSync(path.join(examplesDir, jf), "utf8"));
      const errs = validateAgainstSchema(payload, schema);
      if (errs.length > 0) failures.push(`examples/${jf}: failed schema validation (${errs[0]})`);
      const mdCompanion = jf.replace(/\.json$/, ".md");
      if (!fs.existsSync(path.join(examplesDir, mdCompanion))) {
        failures.push(`examples/${jf}: missing companion Markdown file examples/${mdCompanion}`);
      }
    }
  }

  if (remote) {
    try {
      const res = await fetch(REMOTE_SPEC_URL);
      if (!res.ok) {
        failures.push(`Remote fetch ${REMOTE_SPEC_URL} returned HTTP ${res.status}`);
      } else {
        const remoteText = await res.text();
        if (!remoteText.includes('code: "WAQF-v1.3"')) {
          failures.push(`Remote ${REMOTE_SPEC_URL} missing 'code: "WAQF-v1.3"'`);
        }
        for (let i = 1; i <= 13; i += 1) {
          const code = `P${String(i).padStart(2, "0")}`;
          if (!remoteText.includes(code)) {
            failures.push(`Remote ${REMOTE_SPEC_URL} missing protocol code ${code}`);
          }
        }
      }
    } catch (err) {
      failures.push(`Remote parity check failed for ${REMOTE_SPEC_URL}: ${err.message}`);
    }
  }

  if (failures.length > 0) {
    console.error(`DRIFT CHECK FAILED (${failures.length} issue(s)):`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log(`PASS check-drift${remote ? " (including live ridlo.id/waqf-framework.md parity)" : ""}: 0 drift issues detected across WAQF-v1.3.`);
}

async function cmdTest(args) {
  const schema = loadSchema();
  const exampleFiles = collectJsonFiles([path.join(ROOT_DIR, "examples")]);
  if (exampleFiles.length === 0) {
    console.error("FAIL test: no example JSON files found");
    process.exit(1);
  }

  for (const file of exampleFiles) {
    const payload = JSON.parse(fs.readFileSync(file, "utf8"));
    const errs = validateAgainstSchema(payload, schema);
    if (errs.length > 0) {
      console.error(`FAIL test: ${path.relative(ROOT_DIR, file)} invalid:`, errs);
      process.exit(1);
    }
  }
  console.log(`PASS examples validation (${exampleFiles.length} file(s))`);

  const base = JSON.parse(fs.readFileSync(exampleFiles[0], "utf8"));
  const negativeCases = [
    ["wrong schema_version", (c) => { c.schema_version = "waqf-framework/1.2.0"; }],
    ["unknown property in metadata", (c) => { c.metadata.extra_untracked = true; }],
    ["invalid status 'hisbah'", (c) => { c.metadata.status = "hisbah"; }],
    ["invalid status 'azam_disetujui'", (c) => { c.metadata.status = "azam_disetujui"; }],
    ["invalid calendar date '2026-02-30'", (c) => { c.metadata.cycle_start = "2026-02-30"; }],
    ["zero_humiliation_pledge false", (c) => { c.q_qiyam.fa_ainuhum_support.zero_humiliation_pledge = false; }],
    ["empty tauqifi_guardrails", (c) => { c.a_azam.tauqifi_guardrails = []; }],
    ["al_miqdar_targets exceeds 3", (c) => { c.w_wijhah.al_miqdar_targets.push({ metric: "Extra KPI", target_value: "1", deadline: "2026-12-31" }); }],
  ];

  for (const [label, mutate] of negativeCases) {
    const clone = structuredClone(base);
    mutate(clone);
    const errs = validateAgainstSchema(clone, schema);
    if (errs.length === 0) {
      console.error(`FAIL negative boundary test '${label}': expected rejection, got PASS`);
      process.exit(1);
    }
  }
  console.log(`PASS negative schema boundary suite (${negativeCases.length} assertions rejected as expected)`);

  await cmdCheckDrift(args);
}

const [, , command, ...rest] = process.argv;

switch (command) {
  case "validate":
    cmdValidate(rest);
    break;
  case "render":
    cmdRender(rest);
    break;
  case "init":
    cmdInit(rest);
    break;
  case "check-drift":
    await cmdCheckDrift(rest);
    break;
  case "test":
    await cmdTest(rest);
    break;
  default:
    console.log(
      [
        "WAQF Framework CLI (waqf-framework/1.3.0)",
        "Commands:",
        "  validate <file.json|dir...>              Validate JSON canvases against schema/waqf-canvas.schema.json",
        "  render <file.json> [--lang id|en] [--out <file.md>]  Render validated JSON to 1-Page Markdown Canvas",
        "  init <PROJECT_CODE> [--out <file.json>]  Scaffold a schema-valid starter WAQF-v1.3 JSON canvas",
        "  check-drift [--remote]                   Verify zero-drift across repo files (and live ridlo.id spec)",
        "  test [--remote]                          Run example validations, negative schema boundaries & drift checks",
      ].join("\n"),
    );
    process.exit(command ? 2 : 0);
}
