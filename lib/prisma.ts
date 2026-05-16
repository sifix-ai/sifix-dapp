import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    errorFormat: "minimal",
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

if (process.env.NODE_ENV === "production") {
  prisma.$connect().catch((error) => {
    console.error("❌ Database connection failed:", error.message)
    console.error("DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Missing")
  })
}

export async function disconnectPrisma() {
  await prisma.$disconnect()
}
