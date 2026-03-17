import { useState, useEffect } from 'react';
import { User, Company, mockUsers, mockCompanies } from '../data/mockAuthData';

interface AuthState {
  currentUser: User | null;
  activeCompanyContext: Company | null;
  availableCompanies: Company[];
  login: (userId: string) => void;
  logout: () => void;
  switchCompanyContext: (companyId: string) => void;
}

// Internal singleton state
let globalState: AuthState = {
  currentUser: mockUsers.find(u => u.id === 'user_dcs_musavir') || null,
  activeCompanyContext: mockCompanies.find(c => c.id === 'comp_dcs') || null,
  availableCompanies: mockCompanies.filter(c => ['comp_dcs', 'comp_trendyol'].includes(c.id)),
  login: () => {},
  logout: () => {},
  switchCompanyContext: () => {}
};

const listeners = new Set<() => void>();

function setGlobalState(newState: Partial<AuthState>) {
  globalState = { ...globalState, ...newState };
  listeners.forEach((listener) => listener());
}

// Implemented Actions
globalState.login = (userId: string) => {
  const user = mockUsers.find(u => u.id === userId);
  if (!user) return;

  const primaryComp = mockCompanies.find(c => c.id === user.primaryCompanyId);
  if (!primaryComp) return;

  let available: Company[] = [];
  
  if (primaryComp.type === 'SISTEM' && user.role === 'ADMIN') {
    // Super Admin
    available = mockCompanies;
  } else if (primaryComp.type === 'GUMRUK') {
    // Müşavirlik - sees own firm and assigned clients
    available = mockCompanies.filter(c => c.id === user.primaryCompanyId || user.assignedCompanyIds.includes(c.id));
  } else {
    // Ticaret - strictly sees only their own company
    available = mockCompanies.filter(c => c.id === user.primaryCompanyId);
  }

  setGlobalState({
    currentUser: user,
    availableCompanies: available,
    activeCompanyContext: primaryComp
  });
};

globalState.logout = () => {
  setGlobalState({
    currentUser: null,
    activeCompanyContext: null,
    availableCompanies: []
  });
};

globalState.switchCompanyContext = (companyId: string) => {
  const comp = globalState.availableCompanies.find(c => c.id === companyId);
  if (comp) {
    setGlobalState({ activeCompanyContext: comp });
  }
};

// Drop-in replacement for the Zustand hook
export const useAuthStore = (): AuthState => {
  const [state, setState] = useState<AuthState>(globalState);

  useEffect(() => {
    const listener = () => setState(globalState);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return state;
};

// Access store outside of React
export const getAuthState = () => globalState;
