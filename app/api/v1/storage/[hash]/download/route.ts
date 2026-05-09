import { NextRequest, NextResponse } from "next/server"

/**
 * GET /api/v1/storage/[hash]/download
 * Download analysis JSON with proper Content-Type header
 * Solves "unknown file type" issue when downloading from 0G Storage
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hash: string }> }
) {
  try {
    const { hash } = await params

    if (!hash || !hash.startsWith("0x")) {
      return NextResponse.json(
        { error: "Invalid storage hash" },
        { status: 400 }
      )
    }

    // Fetch analysis data from 0G Storage via indexer
    const indexerUrl = process.env.ZG_INDEXER_URL || "https://indexer-storage-testnet-turbo.0g.ai"
    
    // Get file locations from indexer
    const locationsRes = await fetch(`${indexerUrl}/rpc`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method: "indexer_getFileLocations",
        params: [hash]
      })
    })

    const locations = await locationsRes.json()

    if (!locations?.result || locations.result.length === 0) {
      // Fallback: return hash info as JSON if file not found on network
      return NextResponse.json(
        { error: "Analysis data not found on 0G Storage", hash },
        { status: 404 }
      )
    }

    // Try to download from first available node
    const nodeUrl = locations.result[0].url
    const downloadRes = await fetch(
      `${nodeUrl}/file/${hash}`,
      { headers: { "Accept": "application/json" } }
    )

    if (!downloadRes.ok) {
      return NextResponse.json(
        { error: "Failed to download from storage node" },
        { status: 502 }
      )
    }

    const analysisData = await downloadRes.text()

    // Validate it's valid JSON
    try {
      JSON.parse(analysisData)
    } catch {
      return NextResponse.json(
        { error: "Stored data is not valid JSON" },
        { status: 500 }
      )
    }

    // Return with proper Content-Type and filename
    return new NextResponse(analysisData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="sifix-analysis-${hash.slice(0, 10)}.json"`,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Storage-Hash": hash,
        "X-Storage-Network": "0G Galileo Testnet",
      }
    })

  } catch (error) {
    console.error("[Storage Download] Error:", error)
    return NextResponse.json(
      { error: "Failed to download analysis" },
      { status: 500 }
    )
  }
}
