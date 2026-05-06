// SIFIX Type Definitions

import type {
  Address,
  ThreatReport,
  TransactionScan,
  ReputationScore,
  UserProfile,
  SearchHistory,
  SyncLog,
  ThreatType,
  RiskLevel,
  ReportStatus,
  AddressType,
} from '@prisma/client';

// Re-export Prisma types
export type {
  Address,
  ThreatReport,
  TransactionScan,
  ReputationScore,
  UserProfile,
  SearchHistory,
  SyncLog,
  ThreatType,
  RiskLevel,
  ReportStatus,
  AddressType,
};

// Extended types with relations
export type AddressWithReports = Address & {
  reports: ThreatReport[];
  scans: TransactionScan[];
  reputation: ReputationScore | null;
};

export type ThreatReportWithAddress = ThreatReport & {
  address: Address;
};
