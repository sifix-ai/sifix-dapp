// API Endpoints for SIFIX

export const API_BASE = '/api/v1';

export const ENDPOINTS = {
  // Address endpoints
  ADDRESS: `${API_BASE}/address`,
  ADDRESS_DETAIL: (address: string) => `${API_BASE}/address/${address}`,
  ADDRESS_REPUTATION: (address: string) => `${API_BASE}/address/${address}/reputation`,
  
  // Threat endpoints
  THREATS: `${API_BASE}/threats`,
  THREAT_DETAIL: (id: string) => `${API_BASE}/threats/${id}`,
  REPORT_THREAT: `${API_BASE}/report`,
  
  // Scan endpoints
  SCAN: `${API_BASE}/scan`,
  SCAN_HISTORY: `${API_BASE}/scan/history`,
  
  // Stats endpoints
  STATS: `${API_BASE}/stats`,
  LEADERBOARD: `${API_BASE}/leaderboard`,
  
  // User endpoints
  USER_PROFILE: (address: string) => `${API_BASE}/user/${address}`,
  SEARCH_HISTORY: `${API_BASE}/history`,
  
  // Sync endpoints
  SYNC: `${API_BASE}/sync`,
  
  // Health check
  HEALTH: '/api/health',
} as const;

// External services
export const EXTERNAL_SERVICES = {
  ZEROG_STORAGE: process.env.ZEROG_STORAGE_URL || 'https://storage-testnet.0g.ai',
  SIFIX_AGENT: process.env.SIFIX_AGENT_URL || 'http://localhost:3001',
  OPENAI_API: 'https://api.openai.com/v1',
} as const;
