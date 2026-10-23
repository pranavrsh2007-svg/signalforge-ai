export interface RawCsvRow {
  [key: string]: string | undefined;
}

export interface DataRow {
  date: string;
  order_id: string;
  category: string;
  product: string;
  quantity: number;
  unit_price: number;
  unit_cost?: number | null;
  stock_on_hand?: number | null;
  revenue: number;
  cost?: number | null;
  profit?: number | null;
  margin?: number | null;
}

export interface ColumnProfile {
  name: string;
  inferredType: 'string' | 'number' | 'date';
  validCount: number;
  invalidCount: number;
  sampleValues: (string | number)[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  rowCount: number;
  columnCount: number;
  columns: ColumnProfile[];
  hasCost: boolean;
  hasStock: boolean;
  fileSize: number;
  fileName: string;
  isSample: boolean;
  duplicateRowsCount?: number;
}

export interface MetricSummary {
  totalRevenue: number;
  totalOrders: number;
  totalUnitsSold: number;
  averageOrderValue: number;
  hasGrossMargin: boolean;
  grossMarginPercent?: number | null;
  totalGrossProfit?: number | null;
  dateRange: { start: string; end: string };
  uniqueCategories: string[];
  uniqueProducts: string[];
}

export interface DailyTrend {
  date: string;
  revenue: number;
  orders: number;
  units: number;
  profit?: number | null;
}

export interface CategoryTrend {
  category: string;
  revenue: number;
  units: number;
  orders: number;
  profit?: number | null;
  margin?: number | null;
}

export interface ProductMetric {
  product: string;
  category: string;
  unitsSold: number;
  revenue: number;
  stockOnHand?: number | null;
  runOutDays?: number | null;
}

export interface AnomalyEvidence {
  key: string;
  value: string | number;
  explanation: string;
}

export interface RecommendedAction {
  actionId: string;
  title: string;
  description: string;
  expectedImpact: string;
  actionType: 'restock' | 'price_adjust' | 'promotion' | 'investigation';
  targetEntity: string;
  parameters?: Record<string, string | number>;
}

export interface AIExplanation {
  findingId: string;
  summary: string;
  whyItMatters: string;
  underlyingDrivers: string[];
  uncertaintyNotes: string;
  recommendedActions: RecommendedAction[];
  generatedAt: string;
  providerLabel: string;
  isFallback: boolean;
}

export type AnomalyReviewStatus = 'unreviewed' | 'reviewed' | 'dismissed';

export interface AnomalyFinding {
  id: string;
  title: string;
  type: 'surge' | 'drop' | 'stockout_risk' | 'margin_leak' | 'volume_anomaly';
  severity: 'critical' | 'warning' | 'info';
  metric: string;
  observedValue: number | string;
  baselineValue: number | string;
  delta: string;
  timeWindow: string;
  description: string;
  evidence: AnomalyEvidence[];
  aiExplanation?: AIExplanation | null;
  aiStatus: 'idle' | 'loading' | 'success' | 'fallback' | 'error';
  aiSource: 'gemini' | 'deterministic-fallback' | 'unconfigured';
  aiErrorMessage?: string;
  reviewStatus?: AnomalyReviewStatus;
  reviewedAt?: string;
  dismissReason?: string;
}

export interface ActionPlan {
  id: string;
  findingId: string;
  findingTitle: string;
  title: string;
  description: string;
  status: 'draft' | 'approved_simulation' | 'dismissed' | 'completed_simulation';
  actionType: 'restock' | 'price_adjust' | 'promotion' | 'investigation';
  targetEntity: string;
  expectedImpact: string;
  simulationNotes?: string;
  createdAt: string;
  approvedAt?: string;
  dismissedAt?: string;
  dismissReason?: string;
  projectedMetrics?: {
    metric: string;
    before: string;
    after: string;
  }[];
}

export interface AuditLogEvent {
  id: string;
  timestamp: string;
  category: 'dataset' | 'analytics' | 'ai' | 'action_simulation' | 'export' | 'reset' | 'anomaly_review' | 'profile_update';
  action: string;
  actor: string;
  details: string;
  metadata?: Record<string, unknown>;
}

export interface UserProfile {
  displayName: string;
  email: string;
  role: string;
  avatarInitials: string;
  preferences: {
    theme: 'royal-violet' | 'cosmic-dark';
    reducedMotion: boolean;
    autoAuditLogging: boolean;
    defaultExportFormat: 'csv' | 'json';
  };
}

export interface GeneratedReport {
  id: string;
  timestamp: string;
  datasetName: string;
  dateRange: { start: string; end: string };
  metrics: MetricSummary;
  topFindings: AnomalyFinding[];
  actionPlans: ActionPlan[];
  executiveSummary: string;
}

export type NavigationTab = 
  | 'home'
  | 'dashboard'
  | 'data-explorer' 
  | 'insights'
  | 'anomalies'
  | 'reports'
  | 'action-center' 
  | 'audit-log'
  | 'profile'
  | 'settings';
