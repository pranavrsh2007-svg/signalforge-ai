import React, { useState, useEffect, useCallback } from 'react';
import {
  DataRow,
  ValidationResult,
  MetricSummary,
  DailyTrend,
  CategoryTrend,
  AnomalyFinding,
  ActionPlan,
  AuditLogEvent,
  NavigationTab,
  RecommendedAction,
  AnomalyReviewStatus,
  UserProfile,
} from './types';
import { parseAndValidateCsv } from './lib/csv/parseCsv';
import {
  calculateMetrics,
  calculateDailyTrends,
  calculateCategoryTrends,
} from './lib/analytics/metrics';
import {
  detectAnomalies,
  generateDeterministicFallbackExplanation,
} from './lib/analytics/anomalies';
import {
  requestAIExplanation,
  checkProviderStatus,
  AIProviderStatus,
} from './lib/ai/client';
import {
  createPlanFromRecommendation,
  approveActionPlan,
  dismissActionPlan,
  completeActionPlan,
} from './lib/actions/simulateAction';
import {
  getAuditEvents,
  logAuditEvent,
  clearAuditLog,
} from './lib/audit/auditLog';

import { AppHeader } from './components/Header/AppHeader';
import { Sidebar } from './components/Navigation/Sidebar';
import { MobileDrawer } from './components/Navigation/MobileDrawer';
import { MethodologyModal } from './components/MethodologyModal/MethodologyModal';

// 10 Full Application Pages
import { HomeTab } from './components/Home/HomeTab';
import { DashboardTab } from './components/Dashboard/DashboardTab';
import { DataExplorerTab } from './components/DataExplorer/DataExplorerTab';
import { InsightsTab } from './components/Insights/InsightsTab';
import { AnomaliesTab } from './components/Anomalies/AnomaliesTab';
import { ReportsTab } from './components/Reports/ReportsTab';
import { ActionCenterTab } from './components/ActionCenter/ActionCenterTab';
import { AuditLogTab } from './components/AuditLog/AuditLogTab';
import { ProfileTab } from './components/Profile/ProfileTab';
import { SettingsTab } from './components/Settings/SettingsTab';

// Embedded fallback of public_sample_data_sales.csv for absolute resilience
const EMBEDDED_SAMPLE_CSV = `date,order_id,category,product,quantity,unit_price,unit_cost,stock_on_hand
2026-09-01,O-1001,Home,Storage Box,4,18,10,80
2026-09-01,O-1002,Office,Notebook Set,8,7,3,120
2026-09-02,O-1003,Home,Desk Lamp,3,32,18,34
2026-09-02,O-1004,Kitchen,Water Bottle,10,12,5,55
2026-09-03,O-1005,Office,Notebook Set,12,7,3,108
2026-09-03,O-1006,Home,Storage Box,5,18,10,75
2026-09-04,O-1007,Kitchen,Water Bottle,8,12,5,47
2026-09-04,O-1008,Home,Desk Lamp,2,32,18,29
2026-09-05,O-1009,Office,Notebook Set,15,7,3,93
2026-09-05,O-1010,Home,Storage Box,6,18,10,69
2026-09-06,O-1011,Kitchen,Water Bottle,9,12,5,38
2026-09-06,O-1012,Home,Desk Lamp,2,32,18,25
2026-09-07,O-1013,Office,Notebook Set,11,7,3,82
2026-09-08,O-1014,Home,Storage Box,4,18,10,65
2026-09-08,O-1015,Kitchen,Water Bottle,7,12,5,31
2026-09-09,O-1016,Office,Notebook Set,14,7,3,68
2026-09-09,O-1017,Home,Desk Lamp,1,32,18,22
2026-09-10,O-1018,Home,Storage Box,5,18,10,60
2026-09-10,O-1019,Kitchen,Water Bottle,6,12,5,25
2026-09-11,O-1020,Office,Notebook Set,16,7,3,52
2026-09-12,O-1021,Home,Desk Lamp,1,32,18,18
2026-09-12,O-1022,Home,Storage Box,3,18,10,55
2026-09-13,O-1023,Kitchen,Water Bottle,4,12,5,21
2026-09-13,O-1024,Office,Notebook Set,18,7,3,40
2026-09-14,O-1025,Home,Storage Box,3,18,10,49
2026-09-15,O-1026,Kitchen,Water Bottle,3,12,5,18`;

const DEFAULT_PROFILE: UserProfile = {
  displayName: 'Alex Rivera',
  email: 'alex.rivera@signalforge.internal',
  role: 'Lead BI Operations Specialist',
  avatarInitials: 'AR',
  preferences: {
    theme: 'royal-violet',
    reducedMotion: false,
    autoAuditLogging: true,
    defaultExportFormat: 'csv',
  },
};

const TAB_TO_PATH_MAP: Record<NavigationTab, string> = {
  'home': '/',
  'dashboard': '/dashboard',
  'data-explorer': '/data',
  'insights': '/insights',
  'anomalies': '/anomalies',
  'reports': '/reports',
  'action-center': '/actions',
  'audit-log': '/activity',
  'profile': '/profile',
  'settings': '/settings',
};

const PATH_TO_TAB_MAP: Record<string, NavigationTab> = {
  '/': 'home',
  '/dashboard': 'dashboard',
  '/data': 'data-explorer',
  '/insights': 'insights',
  '/anomalies': 'anomalies',
  '/reports': 'reports',
  '/actions': 'action-center',
  '/activity': 'audit-log',
  '/profile': 'profile',
  '/settings': 'settings',
};

export const App: React.FC = () => {
  // Navigation State with History API Synchronization
  const [currentTab, setCurrentTab] = useState<NavigationTab>(() => {
    const path = window.location.pathname;
    return PATH_TO_TAB_MAP[path] || 'home';
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem('signalforge_user_profile_v1');
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_PROFILE;
  });

  // Core Data State
  const [rows, setRows] = useState<DataRow[]>([]);
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: true,
    errors: [],
    warnings: [],
    rowCount: 0,
    columnCount: 0,
    columns: [],
    hasCost: false,
    hasStock: false,
    fileSize: 0,
    fileName: '',
    isSample: true,
  });

  // Analytics State
  const [metrics, setMetrics] = useState<MetricSummary>({
    totalRevenue: 0,
    totalOrders: 0,
    totalUnitsSold: 0,
    averageOrderValue: 0,
    hasGrossMargin: false,
    grossMarginPercent: null,
    totalGrossProfit: null,
    dateRange: { start: '', end: '' },
    uniqueCategories: [],
    uniqueProducts: [],
  });
  const [dailyTrends, setDailyTrends] = useState<DailyTrend[]>([]);
  const [categoryTrends, setCategoryTrends] = useState<CategoryTrend[]>([]);
  const [findings, setFindings] = useState<AnomalyFinding[]>([]);
  const [selectedFindingId, setSelectedFindingId] = useState<string>('');

  // Actions & Audit
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);
  const [auditEvents, setAuditEvents] = useState<AuditLogEvent[]>([]);

  // Provider
  const [providerStatus, setProviderStatus] = useState<AIProviderStatus>({
    configured: false,
    provider: 'Google Gemini',
    model: 'gemini-2.5-flash',
    message: 'Checking provider status...',
  });

  // Navigation tab switcher that synchronizes with browser History API
  const handleSelectTab = useCallback((tab: NavigationTab, pushHistory: boolean = true) => {
    setCurrentTab(tab);
    if (pushHistory) {
      const targetPath = TAB_TO_PATH_MAP[tab] || '/';
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ tab }, '', targetPath);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Listen to browser Back/Forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const matchingTab = PATH_TO_TAB_MAP[path] || 'home';
      setCurrentTab(matchingTab);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Ingest & Validate CSV string
  const ingestCsvString = useCallback((csvText: string, fileName: string, fileSize: number, isSample: boolean) => {
    const { rows: parsedRows, validation: valResult } = parseAndValidateCsv(csvText, {
      fileName,
      fileSize,
      isSample,
    });

    setValidation(valResult);

    if (valResult.isValid) {
      setRows(parsedRows);
      const computedMetrics = calculateMetrics(parsedRows, valResult.hasCost);
      const computedDaily = calculateDailyTrends(parsedRows);
      const computedCat = calculateCategoryTrends(parsedRows, valResult.hasCost);
      const detectedFindings = detectAnomalies(parsedRows, computedMetrics, valResult.hasCost, valResult.hasStock);

      setMetrics(computedMetrics);
      setDailyTrends(computedDaily);
      setCategoryTrends(computedCat);
      setFindings(detectedFindings);

      // Clear stale action plans & reset finding selection for fresh dataset
      setSelectedFindingId(detectedFindings[0]?.id || '');
      if (detectedFindings.length > 0) {
        const topFinding = detectedFindings[0];
        const fallbackExpl = generateDeterministicFallbackExplanation(topFinding);
        if (fallbackExpl.recommendedActions.length > 0) {
          const samplePlan = createPlanFromRecommendation(topFinding, fallbackExpl.recommendedActions[0]);
          setActionPlans([samplePlan]);
        } else {
          setActionPlans([]);
        }
      } else {
        setActionPlans([]);
      }

      logAuditEvent(
        'dataset',
        isSample ? 'Load Sample Dataset' : 'Ingest Uploaded CSV',
        `Successfully validated and loaded ${parsedRows.length} rows from '${fileName}'. Total Revenue: $${computedMetrics.totalRevenue.toFixed(2)}.`,
        { rows: parsedRows.length, columns: valResult.columnCount }
      );
      setAuditEvents(getAuditEvents());
    } else {
      logAuditEvent(
        'dataset',
        'Dataset Validation Error',
        `File '${fileName}' rejected with ${valResult.errors.length} validation errors: ${valResult.errors[0]}`,
        { errorCount: valResult.errors.length }
      );
      setAuditEvents(getAuditEvents());
    }

    return {
      isValid: valResult.isValid,
      rowCount: valResult.rowCount,
      errors: valResult.errors,
    };
  }, []);

  // Load sample dataset
  const loadSampleDataset = useCallback(async (): Promise<{ success: boolean; rowCount: number; error?: string }> => {
    try {
      const res = await fetch('/sample-data/sales.csv');
      if (res.ok) {
        const text = await res.text();
        if (text && text.trim().length > 0) {
          const result = ingestCsvString(text, 'public_sample_data_sales.csv', text.length, true);
          if (result.isValid) {
            return { success: true, rowCount: result.rowCount };
          }
        }
      }
    } catch (e) {
      console.warn('Could not fetch sample CSV, using embedded fallback:', e);
    }

    // High-fidelity fallback containing verified 26-row schema
    const fallbackResult = ingestCsvString(EMBEDDED_SAMPLE_CSV, 'public_sample_data_sales.csv', EMBEDDED_SAMPLE_CSV.length, true);
    if (fallbackResult.isValid) {
      return { success: true, rowCount: fallbackResult.rowCount };
    }
    return {
      success: false,
      rowCount: 0,
      error: fallbackResult.errors.join('; ') || 'Failed to parse sample data',
    };
  }, [ingestCsvString]);

  // Initial load
  useEffect(() => {
    setAuditEvents(getAuditEvents());

    checkProviderStatus().then((status) => {
      setProviderStatus(status);
    });

    loadSampleDataset();
  }, [loadSampleDataset]);

  // File upload handler
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        ingestCsvString(content, file.name, file.size, false);
        handleSelectTab('dashboard');
      }
    };
    reader.readAsText(file);
  };

  // AI Explanation Handler
  const handleRequestAIExplanation = async (finding: AnomalyFinding) => {
    setFindings((prev) =>
      prev.map((f) => (f.id === finding.id ? { ...f, aiStatus: 'loading' } : f))
    );

    const result = await requestAIExplanation(finding);

    setFindings((prev) =>
      prev.map((f) =>
        f.id === finding.id
          ? {
              ...f,
              aiExplanation: result.explanation,
              aiStatus: result.status,
              aiSource: result.source,
              aiErrorMessage: result.errorDetails,
            }
          : f
      )
    );

    logAuditEvent(
      'ai',
      result.source === 'gemini' ? 'Gemini AI Explanation Generated' : 'Deterministic Fallback Generated',
      `Analysis generated for signal '${finding.title}' via ${result.explanation.providerLabel}.`,
      { findingId: finding.id, source: result.source }
    );
    setAuditEvents(getAuditEvents());
  };

  // Update Anomaly Review Status
  const handleUpdateFindingStatus = (findingId: string, status: AnomalyReviewStatus) => {
    setFindings((prev) =>
      prev.map((f) =>
        f.id === findingId
          ? {
              ...f,
              reviewStatus: status,
              reviewedAt: new Date().toISOString(),
            }
          : f
      )
    );

    logAuditEvent(
      'anomaly_review',
      `Anomaly Marked as ${status.toUpperCase()}`,
      `Signal ID '${findingId}' marked as ${status} by operator.`,
      { findingId, status }
    );
    setAuditEvents(getAuditEvents());
  };

  // Create action plan
  const handleCreatePlan = (finding: AnomalyFinding, rec: RecommendedAction) => {
    const newPlan = createPlanFromRecommendation(finding, rec);
    setActionPlans((prev) => [newPlan, ...prev]);
    handleSelectTab('action-center');

    logAuditEvent(
      'action_simulation',
      'Action Plan Draft Created',
      `Draft plan created for '${rec.title}' targeting '${rec.targetEntity}'.`,
      { planId: newPlan.id, findingId: finding.id }
    );
    setAuditEvents(getAuditEvents());
  };

  // Approve action plan simulation
  const handleApprovePlan = (plan: ActionPlan) => {
    const approved = approveActionPlan(plan);
    setActionPlans((prev) => prev.map((p) => (p.id === plan.id ? approved : p)));

    logAuditEvent(
      'action_simulation',
      'Simulation Approved by Operator',
      `Approved local simulation sandbox execution: '${plan.title}'. (No external side effects).`,
      { planId: plan.id }
    );
    setAuditEvents(getAuditEvents());
  };

  // Dismiss plan
  const handleDismissPlan = (plan: ActionPlan, reason?: string) => {
    const dismissed = dismissActionPlan(plan, reason);
    setActionPlans((prev) => prev.map((p) => (p.id === plan.id ? dismissed : p)));

    logAuditEvent(
      'action_simulation',
      'Action Plan Dismissed',
      `Dismissed proposal '${plan.title}'. Reason: ${reason || 'Operator discretion'}.`,
      { planId: plan.id }
    );
    setAuditEvents(getAuditEvents());
  };

  // Complete plan
  const handleCompletePlan = (plan: ActionPlan) => {
    const completed = completeActionPlan(plan);
    setActionPlans((prev) => prev.map((p) => (p.id === plan.id ? completed : p)));

    logAuditEvent(
      'action_simulation',
      'Simulation Cycle Completed',
      `Simulation test run marked completed for '${plan.title}'.`,
      { planId: plan.id }
    );
    setAuditEvents(getAuditEvents());
  };

  // Update plan calibration
  const handleUpdatePlan = (updatedPlan: ActionPlan) => {
    setActionPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
    logAuditEvent(
      'action_simulation',
      'Action Plan Calibrated',
      `Updated parameters for plan '${updatedPlan.title}'.`,
      { planId: updatedPlan.id }
    );
    setAuditEvents(getAuditEvents());
  };

  // Clear Dataset
  const handleClearData = () => {
    setRows([]);
    setFindings([]);
    setActionPlans([]);
    setMetrics({
      totalRevenue: 0,
      totalOrders: 0,
      totalUnitsSold: 0,
      averageOrderValue: 0,
      hasGrossMargin: false,
      grossMarginPercent: null,
      totalGrossProfit: null,
      dateRange: { start: '', end: '' },
      uniqueCategories: [],
      uniqueProducts: [],
    });
    setDailyTrends([]);
    setCategoryTrends([]);
    setValidation({
      isValid: false,
      errors: ['No dataset currently loaded in session.'],
      warnings: [],
      rowCount: 0,
      columnCount: 0,
      columns: [],
      hasCost: false,
      hasStock: false,
      fileSize: 0,
      fileName: 'None',
      isSample: false,
    });

    logAuditEvent('dataset', 'Clear Dataset', 'Purged all records and derived findings from browser session.');
    setAuditEvents(getAuditEvents());
  };

  // Reset Demo
  const handleResetDemo = () => {
    clearAuditLog();
    setActionPlans([]);
    loadSampleDataset();
    handleSelectTab('dashboard');
    logAuditEvent('reset', 'Demo Environment Reset', 'Restored verified sample sales dataset and fresh state.');
    setAuditEvents(getAuditEvents());
  };

  // Save User Profile
  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    try {
      localStorage.setItem('signalforge_user_profile_v1', JSON.stringify(updatedProfile));
    } catch {}
    logAuditEvent('profile_update', 'User Profile Saved', `Updated operator preferences for ${updatedProfile.displayName}.`);
    setAuditEvents(getAuditEvents());
  };

  // Reset Profile
  const handleResetProfile = () => {
    setUserProfile(DEFAULT_PROFILE);
    try {
      localStorage.setItem('signalforge_user_profile_v1', JSON.stringify(DEFAULT_PROFILE));
    } catch {}
    logAuditEvent('profile_update', 'User Profile Reset', 'Reset operator profile preferences to default.');
    setAuditEvents(getAuditEvents());
  };

  // Export CSV of visible rows
  const handleExportCsv = (rowsToExport: DataRow[]) => {
    const headers = ['date', 'order_id', 'category', 'product', 'quantity', 'unit_price', 'unit_cost', 'stock_on_hand', 'revenue', 'profit'];
    const csvContent = [
      headers.join(','),
      ...rowsToExport.map((r) =>
        [
          r.date,
          `"${r.order_id}"`,
          `"${r.category}"`,
          `"${r.product}"`,
          r.quantity,
          r.unit_price,
          r.unit_cost !== null && r.unit_cost !== undefined ? r.unit_cost : '',
          r.stock_on_hand !== null && r.stock_on_hand !== undefined ? r.stock_on_hand : '',
          r.revenue,
          r.profit !== null && r.profit !== undefined ? r.profit : '',
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `signalforge_data_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logAuditEvent('export', 'Export Dataset CSV', `Exported ${rowsToExport.length} filtered rows to CSV.`);
    setAuditEvents(getAuditEvents());
  };

  // Export Findings
  const handleExportFindings = (format: 'json' | 'csv') => {
    let content = '';
    let mimeType = '';
    const filename = `signalforge_findings_${Date.now()}.${format}`;

    if (format === 'json') {
      content = JSON.stringify(findings, null, 2);
      mimeType = 'application/json';
    } else {
      const headers = ['id', 'title', 'type', 'severity', 'metric', 'observedValue', 'baselineValue', 'delta', 'timeWindow', 'description'];
      content = [
        headers.join(','),
        ...findings.map((f) =>
          [
            f.id,
            `"${f.title.replace(/"/g, '""')}"`,
            f.type,
            f.severity,
            `"${f.metric.replace(/"/g, '""')}"`,
            `"${String(f.observedValue).replace(/"/g, '""')}"`,
            `"${String(f.baselineValue).replace(/"/g, '""')}"`,
            `"${f.delta}"`,
            `"${f.timeWindow}"`,
            `"${f.description.replace(/"/g, '""')}"`,
          ].join(',')
        ),
      ].join('\n');
      mimeType = 'text/csv;charset=utf-8;';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logAuditEvent('export', `Export Findings (${format.toUpperCase()})`, `Exported ${findings.length} findings to ${format}.`);
    setAuditEvents(getAuditEvents());
  };

  // Clear Audit Log
  const handleClearLog = () => {
    clearAuditLog();
    setAuditEvents([]);
    logAuditEvent('reset', 'Clear Audit Log', 'Local audit log cleared by operator.');
    setAuditEvents(getAuditEvents());
  };

  const unreviewedAnomaliesCount = findings.filter((f) => (f.reviewStatus || 'unreviewed') === 'unreviewed').length;

  return (
    <div className="app-container">
      {/* Desktop Collapsible Left Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        findingsCount={findings.length}
        actionPlansCount={actionPlans.filter((p) => p.status === 'draft').length}
        anomaliesCount={unreviewedAnomaliesCount}
      />

      {/* Mobile Slide-Out Drawer Navigation */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        findingsCount={findings.length}
        actionPlansCount={actionPlans.filter((p) => p.status === 'draft').length}
        anomaliesCount={unreviewedAnomaliesCount}
      />

      {/* Main View Area */}
      <div className="main-content">
        <AppHeader
          onToggleMobileNav={() => setIsMobileDrawerOpen((prev) => !prev)}
          isMobileDrawerOpen={isMobileDrawerOpen}
          onOpenMethodology={() => setIsMethodologyOpen(true)}
          onResetDemo={handleResetDemo}
          onNavigateHome={() => handleSelectTab('home')}
          providerStatus={providerStatus}
        />

        <main style={{ flex: 1 }}>
          {currentTab === 'home' && (
            <HomeTab
              metrics={metrics}
              onNavigate={handleSelectTab}
              onLoadSampleData={loadSampleDataset}
            />
          )}

          {currentTab === 'dashboard' && (
            <DashboardTab
              metrics={metrics}
              dailyTrends={dailyTrends}
              categoryTrends={categoryTrends}
              findings={findings}
              validation={validation}
              onNavigate={handleSelectTab}
              onSelectFinding={(f) => {
                setSelectedFindingId(f.id);
                handleSelectTab('insights');
              }}
              onLoadSampleData={loadSampleDataset}
              onOpenUpload={() => handleSelectTab('data-explorer')}
            />
          )}

          {currentTab === 'data-explorer' && (
            <DataExplorerTab
              rows={rows}
              validation={validation}
              onFileUpload={handleFileUpload}
              onLoadSample={loadSampleDataset}
              onClearData={handleClearData}
              onExportCsv={handleExportCsv}
            />
          )}

          {currentTab === 'insights' && (
            <InsightsTab
              findings={findings}
              selectedFindingId={selectedFindingId}
              onRequestAIExplanation={handleRequestAIExplanation}
              onCreatePlan={handleCreatePlan}
              onExportFindings={handleExportFindings}
            />
          )}

          {currentTab === 'anomalies' && (
            <AnomaliesTab
              findings={findings}
              onSelectFinding={(f) => {
                setSelectedFindingId(f.id);
                handleSelectTab('insights');
              }}
              onUpdateFindingStatus={handleUpdateFindingStatus}
              onNavigate={handleSelectTab}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsTab
              metrics={metrics}
              findings={findings}
              plans={actionPlans}
              validation={validation}
              onNavigate={handleSelectTab}
            />
          )}

          {currentTab === 'action-center' && (
            <ActionCenterTab
              plans={actionPlans}
              onApprovePlan={handleApprovePlan}
              onDismissPlan={handleDismissPlan}
              onCompletePlan={handleCompletePlan}
              onUpdatePlan={handleUpdatePlan}
              onNavigateToFinding={(id) => {
                setSelectedFindingId(id);
                handleSelectTab('insights');
              }}
              onNavigate={handleSelectTab}
            />
          )}

          {currentTab === 'audit-log' && (
            <AuditLogTab events={auditEvents} onClearLog={handleClearLog} />
          )}

          {currentTab === 'profile' && (
            <ProfileTab
              userProfile={userProfile}
              onSaveProfile={handleSaveProfile}
              onResetProfile={handleResetProfile}
              onNavigate={handleSelectTab}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsTab
              providerStatus={providerStatus}
              onClearDataset={handleClearData}
              onResetDemo={handleResetDemo}
            />
          )}
        </main>
      </div>

      {/* Methodology & Transparency Modal */}
      <MethodologyModal isOpen={isMethodologyOpen} onClose={() => setIsMethodologyOpen(false)} />
    </div>
  );
};
export default App;
