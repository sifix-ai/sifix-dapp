// Type definitions for SIFIX models

export * from '@prisma/client';

// Custom types
export type ThreatType = string;
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ReportStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'DISPUTED';
export type AddressType = 'EOA' | 'SMART_CONTRACT' | 'PROXY';
