import { AuditLogEvent } from '../../types';

const AUDIT_STORAGE_KEY = 'signalforge_audit_log_v1';

export function getAuditEvents(): AuditLogEvent[] {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse audit log from localStorage:', e);
  }
  return [];
}

export function saveAuditEvents(events: AuditLogEvent[]): void {
  try {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(events));
  } catch (e) {
    console.warn('Failed to save audit log to localStorage:', e);
  }
}

export function logAuditEvent(
  category: AuditLogEvent['category'],
  action: string,
  details: string,
  metadata?: Record<string, unknown>,
  actor: string = 'User Operator'
): AuditLogEvent {
  const event: AuditLogEvent = {
    id: `EVT-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    category,
    action,
    actor,
    details,
    metadata,
  };

  const existing = getAuditEvents();
  const updated = [event, ...existing].slice(0, 500); // Keep max 500 records
  saveAuditEvents(updated);
  return event;
}

export function clearAuditLog(): void {
  try {
    localStorage.removeItem(AUDIT_STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear audit log:', e);
  }
}

export function exportAuditLogToCsv(events: AuditLogEvent[]): string {
  const headers = ['id', 'timestamp', 'category', 'action', 'actor', 'details'];
  const rows = events.map((e) => {
    return [
      `"${e.id}"`,
      `"${e.timestamp}"`,
      `"${e.category}"`,
      `"${e.action.replace(/"/g, '""')}"`,
      `"${e.actor.replace(/"/g, '""')}"`,
      `"${e.details.replace(/"/g, '""')}"`,
    ].join(',');
  });
  return [headers.join(','), ...rows].join('\n');
}

export function exportAuditLogToJson(events: AuditLogEvent[]): string {
  return JSON.stringify(events, null, 2);
}
