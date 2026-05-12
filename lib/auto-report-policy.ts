export const AUTO_REPORT_POLICY = {
  enabled: (process.env.AUTO_REPORT_ENABLED || 'true') === 'true',
  riskThreshold: Number(process.env.AUTO_REPORT_RISK_THRESHOLD || 85),
  confidenceThreshold: Number(process.env.AUTO_REPORT_CONFIDENCE_THRESHOLD || 80),
  reporterHourlyLimit: Number(process.env.AUTO_REPORT_REPORTER_COOLDOWN_PER_HOUR || 5),
  addressCooldownHours: Number(process.env.AUTO_REPORT_ADDRESS_COOLDOWN_HOURS || 24),
  systemReporter: (process.env.AUTO_REPORT_SYSTEM_REPORTER || '0x000000000000000000000000000000000000dead').toLowerCase(),
}

export function shouldAutoReport(input: { riskScore: number; confidence: number; isAddress: boolean; existsOnChain: boolean }) {
  if (!AUTO_REPORT_POLICY.enabled) return false
  if (!input.isAddress || !input.existsOnChain) return false
  if (input.riskScore < AUTO_REPORT_POLICY.riskThreshold) return false
  if (input.confidence < AUTO_REPORT_POLICY.confidenceThreshold) return false
  return true
}
