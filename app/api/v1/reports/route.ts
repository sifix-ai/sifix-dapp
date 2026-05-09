/**
 * Threat Reports API
 * GET  /api/v1/reports — List threat reports
 * POST /api/v1/reports — Create a threat report
 */

import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { isValidEthereumAddress } from '@/lib/address-validation'
import { prisma } from '@/lib/prisma'

/**
 * GET — List reports
 * Query: ?address=0x...&status=PENDING&limit=20
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')
    const status = searchParams.get('status')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (address && isValidEthereumAddress(address)) {
      const addr = await prisma.address.findUnique({
        where: { address: address.toLowerCase() },
      })
      if (addr) {
        where.addressId = addr.id
      } else {
        return apiSuccess({ data: [], pagination: { page, limit, total: 0, totalPages: 0 } })
      }
    }

    if (status) {
      const validStatuses = ['PENDING', 'VERIFIED', 'REJECTED', 'DISPUTED']
      if (validStatuses.includes(status.toUpperCase())) {
        where.status = status.toUpperCase()
      }
    }

    const [reports, total] = await Promise.all([
      prisma.threatReport.findMany({
        where,
        include: {
          address: {
            select: { address: true, riskScore: true, riskLevel: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.threatReport.count({ where }),
    ])

    const data = reports.map((r) => ({
      id: r.id,
      address: r.address.address,
      addressRisk: r.address.riskLevel,
      reporterAddress: r.reporterAddress,
      threatType: r.threatType,
      severity: r.severity,
      riskLevel: r.riskLevel,
      status: r.status,
      explanation: r.explanation,
      evidenceHash: r.evidenceHash,
      confidence: r.confidence,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }))

    return apiSuccess({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('List reports error:', error)
    return apiError('Internal server error', '500')
  }
}

/**
 * POST — Create a threat report
 * Body: { addressId, reporterAddress, threatType, severity, explanation, evidenceHash? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { addressId, reporterAddress, threatType, severity, explanation, evidenceHash } = body

    // Validate required fields
    if (!addressId || typeof addressId !== 'string') {
      return apiError('addressId is required', '400')
    }

    if (!reporterAddress || !isValidEthereumAddress(reporterAddress)) {
      return apiError('Valid reporterAddress is required', '400')
    }

    if (!threatType || typeof threatType !== 'string') {
      return apiError('threatType is required', '400')
    }

    if (severity === undefined || typeof severity !== 'number' || severity < 0 || severity > 100) {
      return apiError('severity must be a number between 0 and 100', '400')
    }

    if (!explanation || typeof explanation !== 'string') {
      return apiError('explanation is required', '400')
    }

    // Verify the address exists
    const addressRecord = await prisma.address.findUnique({
      where: { id: addressId },
    })

    if (!addressRecord) {
      return apiError('Address not found', '404')
    }

    // Determine risk level from severity
    const riskLevel =
      severity >= 80 ? 'CRITICAL' :
      severity >= 60 ? 'HIGH' :
      severity >= 40 ? 'MEDIUM' :
      severity >= 20 ? 'LOW' : 'LOW'

    // Create the threat report
    const report = await prisma.threatReport.create({
      data: {
        addressId,
        reporterAddress: reporterAddress.toLowerCase(),
        threatType: threatType.toUpperCase(),
        severity,
        riskLevel,
        explanation,
        evidenceHash: evidenceHash || '',
        confidence: 50, // Default confidence; can be updated by AI analysis
      },
    })

    // Update address total reports count
    await prisma.address.update({
      where: { id: addressId },
      data: {
        totalReports: { increment: 1 },
        lastSeenAt: new Date(),
      },
    })

    return apiSuccess({
      id: report.id,
      addressId: report.addressId,
      reporterAddress: report.reporterAddress,
      threatType: report.threatType,
      severity: report.severity,
      riskLevel: report.riskLevel,
      status: report.status,
      explanation: report.explanation,
      evidenceHash: report.evidenceHash,
      confidence: report.confidence,
      createdAt: report.createdAt.toISOString(),
    }, { message: 'Report created successfully' })
  } catch (error) {
    console.error('Create report error:', error)
    return apiError('Internal server error', '500')
  }
}
