import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding SIFIX database...');

  // Create sample addresses
  const maliciousAddress = await prisma.address.create({
    data: {
      address: '0x1234567890123456789012345678901234567890',
      chain: '0g-galileo',
      addressType: 'SMART_CONTRACT',
      riskScore: 95,
      riskLevel: 'CRITICAL',
      totalReports: 5,
    },
  });

  const safeAddress = await prisma.address.create({
    data: {
      address: '0x0987654321098765432109876543210987654321',
      chain: '0g-galileo',
      addressType: 'EOA',
      riskScore: 10,
      riskLevel: 'LOW',
      totalReports: 0,
    },
  });

  // Create sample threat reports
  await prisma.threatReport.create({
    data: {
      addressId: maliciousAddress.id,
      reporterAddress: '0xreporter1234567890123456789012345678901234',
      threatType: 'MALICIOUS_CONTRACT',
      severity: 95,
      riskLevel: 'CRITICAL',
      evidenceHash: 'QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      explanation: 'This contract contains malicious code that drains user funds through hidden approval mechanisms.',
      aiModel: 'gpt-4',
      confidence: 98,
      status: 'VERIFIED',
    },
  });

  // Create sample reputation scores
  await prisma.reputationScore.create({
    data: {
      addressId: maliciousAddress.id,
      overallScore: 5,
      reporterScore: 0,
      accuracyScore: 0,
      reportsSubmitted: 0,
      reportsVerified: 0,
      reportsRejected: 5,
    },
  });

  await prisma.reputationScore.create({
    data: {
      addressId: safeAddress.id,
      overallScore: 90,
      reporterScore: 85,
      accuracyScore: 95,
      reportsSubmitted: 10,
      reportsVerified: 9,
      reportsRejected: 1,
    },
  });

  console.log('✅ Seed completed!');
  console.log(`   - Created ${await prisma.address.count()} addresses`);
  console.log(`   - Created ${await prisma.threatReport.count()} threat reports`);
  console.log(`   - Created ${await prisma.reputationScore.count()} reputation scores`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
