import { NextRequest } from 'next/server'
import { apiSuccess, errors, withErrorHandler } from '@/lib/api-response'
import { runAllSyncs, syncDefiLlama, syncScamSniffer, syncCryptoScamDB } from '@/services/sync-service'
import { CRON_SECRET } from '@/lib/constants'

export const POST = withErrorHandler(async (request: NextRequest) => {
  if (!CRON_SECRET) return errors.unauthorized('CRON_SECRET not configured')
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (token !== CRON_SECRET) return errors.unauthorized('Invalid cron secret')

  const body = await request.json().catch(() => ({}))
  const source = body?.source || 'all'

  if (source === 'defillama') return apiSuccess(await syncDefiLlama())
  if (source === 'scamsniffer') return apiSuccess(await syncScamSniffer())
  if (source === 'cryptoscamdb') return apiSuccess(await syncCryptoScamDB())
  if (source === 'all') {
    const batch = await runAllSyncs()
    return apiSuccess({ success: true, source: 'all', recordsAdded: batch.totalAdded, recordsUpdated: batch.totalUpdated, duration: batch.totalDuration, details: batch.results })
  }

  return errors.validation('Invalid sync source', { validSources: ['defillama', 'scamsniffer', 'cryptoscamdb', 'all'] })
})
