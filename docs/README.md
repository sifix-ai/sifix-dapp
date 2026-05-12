# SIFIX Internal Docs

## Auto-report Policy

### Cara kerja
1. Endpoint `/api/v1/analyze` selesai analisa tx.
2. Jika memenuhi policy (`riskScore`, `confidence`, on-chain exists), sistem auto-create threat report.
3. Report auto selalu status `PENDING` (tidak pernah auto-VERIFIED).
4. Output analyze sekarang memuat `autoReported: boolean`.

### Rule default
- riskScore >= 85
- confidence >= 80
- address valid on-chain

### Override admin
- Endpoint: `POST /api/v1/threats/[id]/override`
- Auth: `Authorization: Bearer <CRON_SECRET>`
- Body: `{ status, reviewedBy, overrideReason }`

### Env
- `AUTO_REPORT_ENABLED`
- `AUTO_REPORT_RISK_THRESHOLD`
- `AUTO_REPORT_CONFIDENCE_THRESHOLD`
- `AUTO_REPORT_REPORTER_COOLDOWN_PER_HOUR`
- `AUTO_REPORT_ADDRESS_COOLDOWN_HOURS`
- `AUTO_REPORT_SYSTEM_REPORTER`

## System Status

Endpoint `GET /api/v1/system-status` sekarang live probe:
- 0G Network: RPC `eth_blockNumber`
- AI Analysis: hit `/api/health` pakai origin request (fallback kalau `NEXT_PUBLIC_APP_URL` kosong)
- 0G Storage: GET probe (beberapa endpoint tolak HEAD)

Jika sebelumnya AI/Storage offline, penyebab utama:
- `NEXT_PUBLIC_APP_URL` kosong -> URL relatif invalid untuk server-side fetch
- storage endpoint tidak support HEAD

Sudah dipatch.
