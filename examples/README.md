# Worked Examples — `Standard WAQF-v1.3` (`waqf-framework/1.3.0`)

Folder ini menyediakan **studi kasus empiris nyata** (bukan placeholder kosong) dalam dua format berpasangan:
- **`.json`** — sumber data tunggal (*single source of truth*) tervalidasi ketat terhadap [`schema/waqf-canvas.schema.json`](../schema/waqf-canvas.schema.json).
- **`.md`** — Kanvas Kerja 1 Halaman yang di-render secara deterministik oleh [`scripts/waqf-cli.mjs`](../scripts/waqf-cli.mjs).

| File | Konteks & Entitas | Status Siklus | Sorotan `WAQF-v1.3` |
| :--- | :--- | :--- | :--- |
| [`01-nazhir-clean-water-sroi.json`](./01-nazhir-clean-water-sroi.json) / [`.md`](./01-nazhir-clean-water-sroi.md) | **Yayasan Amal Produktif Indonesia** *(Lembaga Nazhir BWI STBPN 3.3.00386 · Divisi KARYA)* | `closed-islah` (`13/13` Protokol Terverifikasi) | Audit Forensik *At-Tahqiq* 50 titik air bersih: keterlacakan GL KAP WTP `80,9%`, deduplikasi `-32,7%` (`39.144 → 26.357` jiwa unik), pemisahan 3 akad (`WPAIR / Wakaf Sarana / Infak Terikat ISAK 335`), SROI `1 : 4,11` (Pipanisasi Gravitasi `5,77x`), & *Islah* alokasi modal 2027. |
| [`02-b2b-single-fire-surge.json`](./02-b2b-single-fire-surge.json) / [`.md`](./02-b2b-single-fire-surge.md) | **PT Produktif Indonesia Berdaya / SAIF Group × Waflare** *(Komersial B2B & Tim AI)* | `qiyam-execution` (`Gate 1: 9/9`, `Gate 2: Pending`) | *14-Day Single-Fire Surge (`SURGE-2026-W48`)*, pemisahan legal `ENTITY-02` vs. Nazhir, freeze 40 proyek non-inti, penghapusan template `140 → 3` baris, *Protected Maker Timeblock* `08:00–12:00 WIB`, `≥80% Signal`, `5x/pekan` *External Negative Feedback*, dan pagar *La Yuqallad*. |

## Cara Validasi & Generate Kanvas Sendiri

```bash
# 1. Validasi seluruh contoh terhadap waqf-canvas.schema.json
node scripts/waqf-cli.mjs validate examples/

# 2. Buat kerangka kanvas JSON v1.3.0 baru yang langsung valid
node scripts/waqf-cli.mjs init PRJ-NAZHIR-2027-01 --out my-canvas.json

# 3. Render JSON tervalidasi menjadi Kanvas Markdown 1 Halaman (ID atau EN)
node scripts/waqf-cli.mjs render examples/01-nazhir-clean-water-sroi.json --lang id
node scripts/waqf-cli.mjs render examples/02-b2b-single-fire-surge.json --lang en
```
