import { getAuthState } from '../store/useAuthStore';

export type AuditAction = 
  | 'LOGIN'
  | 'VIEW_DASHBOARD'
  | 'DOWNLOAD_BEYANNAME'
  | 'CREATE_USER'
  | 'DELETE_USER'
  | 'CREATE_COMPANY'
  | 'SWITCH_COMPANY';

export interface AuditLogEntry {
  userId: string;
  role: string;
  action: AuditAction;
  companyContextId: string;
  targetId?: string;
  details?: any;
  timestamp: string;
}

export const auditLogger = {
  log: (action: AuditAction, targetId?: string, details?: any) => {
    const state = getAuthState();
    if (!state.currentUser || !state.activeCompanyContext) return;

    const entry: AuditLogEntry = {
      userId: state.currentUser.id,
      role: state.currentUser.role,
      action: action,
      companyContextId: state.activeCompanyContext.id,
      targetId,
      details,
      timestamp: new Date().toISOString()
    };

    console.log(`%c[AUDIT LOG] ${action}`, 'color: #3b82f6; font-weight: bold;', entry);
  }
};
