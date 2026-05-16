# SIFIX Internal Docs

## Auto-Report Policy

### How it works
1. The `/api/v1/analyze` endpoint completes transaction analysis.
2. If the policy conditions are met (`riskScore`, `confidence`, on-chain existence), the system auto-creates a threat report.
3. Auto-created reports always start with `PENDING` status and are never auto-`VERIFIED`.
4. The analysis response now includes `autoReported: boolean`.

### Default rules
- riskScore >= 85
- confidence >= 80
- address is valid on-chain

### Admin override
- Endpoint: `POST /api/v1/threats/[id]/override`
- Auth: `Authorization: Bearer <CRON_SECRET>`
- Body: `{ status, reviewedBy, overrideReason }`

### Environment variables
- `AUTO_REPORT_ENABLED`
- `AUTO_REPORT_RISK_THRESHOLD`
- `AUTO_REPORT_CONFIDENCE_THRESHOLD`
- `AUTO_REPORT_REPORTER_COOLDOWN_PER_HOUR`
- `AUTO_REPORT_ADDRESS_COOLDOWN_HOURS`
- `AUTO_REPORT_SYSTEM_REPORTER`

## Community Verifier Voting

Available endpoints:
- `POST /api/v1/threats/{id}/vote`
- `GET /api/v1/threats/{id}/vote`

Rules:
- Vote values: `FOR` or `AGAINST`
- One wallet gets one vote per report, but the same wallet may update its vote
- Minimum reputation required (`VOTE_REPUTATION_MIN`, default 50)
- Vote weight: `max(1, floor(overallScore/50))`

Consensus:
- `VERIFIED` if unique voters >= `VOTE_MIN_UNIQUE_VOTERS` and net score >= `VOTE_VERIFY_THRESHOLD`
- `REJECTED` if unique voters >= `VOTE_MIN_UNIQUE_VOTERS` and net score <= -`VOTE_REJECT_THRESHOLD`
- Otherwise status remains `PENDING`

Environment variables:
- `VOTE_VERIFY_THRESHOLD`
- `VOTE_REJECT_THRESHOLD`
- `VOTE_MIN_UNIQUE_VOTERS`
- `VOTE_REPUTATION_MIN`

## System Status

The `GET /api/v1/system-status` endpoint now performs live probes for:
- 0G Network: RPC `eth_blockNumber`
- AI Analysis: requests `/api/health` using the request origin (fallback if `NEXT_PUBLIC_APP_URL` is empty)
- 0G Storage: GET probe because some endpoints reject `HEAD`

If AI or Storage previously appeared offline, the main causes were:
- `NEXT_PUBLIC_APP_URL` was empty, so server-side fetch built an invalid relative URL
- the storage endpoint did not support `HEAD`

Those issues are already patched.
