# SIFIX - AI-Powered Wallet Security for Web3

**Autonomous AI agent that protects Web3 users by intercepting wallet transactions, simulating them, analyzing risks using AI, and reporting threats to an on-chain reputation system.**

Built for 0G Chain APAC Hackathon 2026.

## 🎯 Problem

Web3 users face constant threats:
- Phishing attacks
- Malicious smart contracts
- Rug pulls
- Approval scams
- Hidden risks in complex DeFi interactions

## 💡 Solution

SIFIX adds an AI security layer between users and blockchain:

1. **Intercept** - Catches transactions before execution
2. **Simulate** - Runs transaction in safe environment
3. **Analyze** - AI evaluates risks and explains threats
4. **Report** - Shares threat intelligence on-chain
5. **Protect** - Users make informed decisions

## 🏗️ Architecture

```
┌─────────────────┐
│  Browser Wallet │
│   (MetaMask)    │
└────────┬────────┘
         │
    ┌────▼─────┐
    │ SIFIX    │
    │Extension │
    └────┬─────┘
         │
    ┌────▼─────────┐
    │ SIFIX Agent  │
    │ (AI + Sim)   │
    └────┬─────────┘
         │
    ┌────▼──────────┐
    │ 0G Chain      │
    │ (Reputation)  │
    └───────────────┘
```

## 📦 Tech Stack

- **Frontend:** Next.js 14 + TailwindCSS
- **Backend:** Next.js API Routes + Prisma
- **Extension:** Plasmo + Manifest V3
- **Agent:** TypeScript + OpenAI GPT-4 + Viem
- **Contracts:** Solidity + Foundry
- **Chain:** 0G Newton Testnet
- **Storage:** 0G Storage (threat intelligence)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL or SQLite

### Installation

```bash
# Clone repo
git clone https://github.com/sifix-ai/sifix-dapp
cd sifix-dapp

# Install dependencies
pnpm install

# Setup database
cp .env.example .env
# Edit .env with your credentials

# Run migrations
pnpm prisma migrate dev

# Seed database
pnpm prisma db seed

# Start dev server
pnpm dev
```

Open http://localhost:3000

## 🛡️ Features

### Dashboard
- **Reputation Explorer** - Query address reputation
- **Threat Monitor** - Real-time threat reports
- **Analytics** - Statistics & charts
- **Leaderboard** - Top reporters

### API Endpoints

```
GET  /api/v1/address/:address        # Get address reputation
GET  /api/v1/threats                 # List recent threats
POST /api/v1/report                  # Submit threat report
GET  /api/v1/stats                   # Platform statistics
```

### Smart Contract

**SifixReputation** - Deployed on 0G Newton Testnet
- Address: `0x544a39149d5169E4e1bDf7F8492804224CB70152`
- Chain ID: 16602

## 📊 Database Schema

```prisma
model Address {
  id          String   @id @default(cuid())
  address     String   @unique
  riskScore   Int      @default(0)
  totalReports Int     @default(0)
  reports     Report[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Report {
  id           String   @id @default(cuid())
  addressId    String
  address      Address  @relation(fields: [addressId], references: [id])
  reporter     String
  threatType   String
  severity     Int
  evidenceHash String
  explanation  String
  createdAt    DateTime @default(now())
}
```

## 🔗 Related Repos

- [sifix-agent](https://github.com/sifix-ai/sifix-agent) - Core AI security engine
- [sifix-extension](https://github.com/sifix-ai/sifix-extension) - Browser extension
- [sifix-contracts](https://github.com/sifix-ai/sifix-contracts) - Smart contracts
- [sifix-docs](https://github.com/sifix-ai/sifix-docs) - Documentation

## 📄 License

MIT

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📧 Contact

- Twitter: [@sifix_ai](https://twitter.com/sifix_ai)
- Discord: [Join our community](https://discord.gg/sifix)
- Email: team@sifix.ai

---

**Built with ❤️ for 0G Chain APAC Hackathon 2026**
