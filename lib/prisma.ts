import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Initialize Prisma with error handling for production
export const prisma = 
  globalForPrisma.prisma ?? 
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    errorFormat: "minimal",
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

// Verify database connection on initialization
if (process.env.NODE_ENV === "production") {
  prisma.$connect()
    .then(() => {
      console.log("✅ Database connected successfully")
    })
    .catch((error) => {
      console.error("❌ Database connection failed:", error.message)
      console.error("DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Missing")
    })
}

export async function disconnectPrisma() {
  await prisma.$disconnect()
}
