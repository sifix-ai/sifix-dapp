// SIFIX API Types

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    cached?: boolean;
    [key: string]: any;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginatedResponse<T> extends ApiSuccessResponse<T> {
  total: number;
  page: number;
  limit: number;
}

// Address API
export interface AddressResponse {
  address: string;
  chain: string;
  addressType: string;
  riskScore: number;
  riskLevel: string;
  totalReports: number;
  reports: ThreatReportSummary[];
  reputation: ReputationSummary | null;
  firstSeenAt: string;
  lastSeenAt: string;
}

export interface ThreatReportSummary {
  id: string;
  threatType: string;
  severity: number;
  riskLevel: string;
  explanation: string;
  status: string;
  createdAt: string;
}

export interface ReputationSummary {
  overallScore: number;
  reporterScore: number;
  accuracyScore: number;
  reportsSubmitted: number;
  reportsVerified: number;
  reportsRejected: number;
}

// Scan API
export interface ScanRequest {
  from: string;
  to: string;
  value?: string;
  data?: string;
  userAddress?: string;
}

export interface ScanResponse {
  from: string;
  to: string;
  simulationSuccess: boolean;
  gasUsed?: string;
  stateChanges?: string;
  riskScore: number;
  riskLevel: string;
  recommendation: 'APPROVE' | 'REJECT' | 'WARN';
  explanation: string;
  detectedThreats?: string[];
}

// Stats API
export interface StatsResponse {
  totalAddresses: number;
  totalReports: number;
  totalScans: number;
  criticalThreats: number;
  recentReports: number;
  topReporters: TopReporter[];
}

export interface TopReporter {
  address: string;
  score: number;
  reportsSubmitted: number;
  reportsVerified: number;
}

// Leaderboard API
export interface LeaderboardEntry {
  address: string;
  overallScore: number;
  reporterScore: number;
  accuracyScore: number;
  reportsSubmitted: number;
  reportsVerified: number;
}
