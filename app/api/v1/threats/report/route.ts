import { NextRequest, NextResponse } from "next/server"
import { uploadThreatEvidence } from "@/lib/zerog-storage"
import { reportThreatToContract, severityToNumber } from "@/lib/contract"
import { prisma } from "@/lib/prisma"
import { isValidEthereumAddress } from "@/lib/address-validation"
import { verifyApiAuth } from "@/lib/extension-auth"

export async function POST(request: NextRequest) {
  // Auth check
  const auth = await verifyApiAuth()
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { address, severity, type, description, evidence } = body

    if (!address || !severity || !type || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate address format
    if (!isValidEthereumAddress(address)) {
      return NextResponse.json(
        { error: "Invalid Ethereum address format" },
        { status: 400 }
      )
    }

    // 1. Upload evidence to 0G Storage
    let evidenceCid = null
    try {
      const storageResult = await uploadThreatEvidence({
        address,
        severity,
        type,
        description,
        timestamp: Date.now(),
        transactionData: evidence?.transactionData,
        simulationResult: evidence?.simulationResult,
        aiAnalysis: evidence?.aiAnalysis
      })
      evidenceCid = storageResult.cid
      console.log("[API] Evidence uploaded to 0G Storage:", evidenceCid)
    } catch (error) {
      console.error("[API] 0G Storage upload failed:", error)
    }

    // 2. Report to smart contract
    let contractTxHash = null
    if (evidenceCid && (severity === "HIGH" || severity === "CRITICAL")) {
      try {
        const contractResult = await reportThreatToContract(
          address as `0x${string}`,
          severityToNumber(severity),
          evidenceCid
        )
        if (contractResult.success) {
          contractTxHash = contractResult.txHash
          console.log("[API] Threat reported to contract:", contractTxHash)
        }
      } catch (error) {
        console.error("[API] Contract report failed:", error)
      }
    }

    // 3. Get or create Address record
    let addressRecord = await prisma.address.findUnique({
      where: { address }
    })

    if (!addressRecord) {
      addressRecord = await prisma.address.create({
        data: { address }
      })
    }

    // 4. Save threat report to database
    const severityMap: Record<string, number> = {
      LOW: 25,
      MEDIUM: 50,
      HIGH: 75,
      CRITICAL: 100
    }

    const threat = await prisma.threatReport.create({
      data: {
        addressId: addressRecord.id,
        reporterAddress: "0x0000000000000000000000000000000000000000", // TODO: Get from auth
        threatType: type,
        severity: severityMap[severity] || 50,
        riskLevel: severity,
        evidenceHash: evidenceCid || `mock-${Date.now()}`,
        explanation: description,
        confidence: 85,
        simulationData: JSON.stringify(evidence),
        onchainTxHash: contractTxHash || undefined
      }
    })

    return NextResponse.json({
      id: threat.id,
      address: address,
      severity: threat.riskLevel,
      type: threat.threatType,
      description: threat.explanation,
      reportedAt: threat.createdAt.toISOString(),
      storageCid: evidenceCid,
      contractTxHash: contractTxHash
    })
  } catch (error) {
    console.error("Report threat error:", error)
    return NextResponse.json(
      { error: "Failed to report threat" },
      { status: 500 }
    )
  }
}
