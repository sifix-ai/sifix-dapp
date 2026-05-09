/**
 * 0G Storage stub — upload functionality not yet implemented.
 * Replace with actual 0G Storage SDK when ready.
 */

export async function uploadThreatEvidence(data: {
  address: string
  evidence: string
  reporter: string
}): Promise<{ hash: string; url: string }> {
  console.warn("[0G Storage] Upload not implemented, returning stub hash")
  return {
    hash: "0x" + "0".repeat(64),
    url: "",
  }
}
