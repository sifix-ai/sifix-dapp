# Auto Report Policy (SIFIX)

## Purpose
Auto-create a report when an analysis result is highly risky, without auto-verifying it.

## Trigger rules
- riskScore >= 85
- confidence >= 80
- target is a valid on-chain address
- initial report status is always `PENDING`

## Guardrails
- dedupe one reporter per address
- limit reports per reporter each hour
- cooldown per address every 24 hours

## Status validation
- `PENDING` by default
- `VERIFIED` / `REJECTED` only through review (manual/admin) or the voting engine
- AI must never set `VERIFIED` directly

## Admin override
Endpoint: `POST /api/v1/threats/[id]/override`
Header: `Authorization: Bearer <CRON_SECRET>`
Body:
```json
{
  "status": "VERIFIED",
  "reviewedBy": "admin@mula",
  "overrideReason": "confirmed by analyst"
}
```

## Environment variables
- AUTO_REPORT_ENABLED=true
- AUTO_REPORT_RISK_THRESHOLD=85
- AUTO_REPORT_CONFIDENCE_THRESHOLD=80
- AUTO_REPORT_REPORTER_COOLDOWN_PER_HOUR=5
- AUTO_REPORT_ADDRESS_COOLDOWN_HOURS=24
- AUTO_REPORT_SYSTEM_REPORTER=0x000000000000000000000000000000000000dead
