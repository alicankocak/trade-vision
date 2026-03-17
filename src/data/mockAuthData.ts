export type CompanyType = 'GUMRUK' | 'TICARET' | 'SISTEM';
export type UserRole = 'ADMIN' | 'MUSAVIR' | 'STANDART';

export interface Company {
  id: string;
  name: string;
  taxNumber: string;
  type: CompanyType;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: UserRole;
  primaryCompanyId: string; // The firm they represent/belong to internally
  assignedCompanyIds: string[]; // For Musavirs: companies they manage. For Standard: specific trading firm points.
  status: 'ACTIVE' | 'INACTIVE';
}

export const mockCompanies: Company[] = [
  { id: 'comp_atez', name: 'ATEZ Software Technologies', taxNumber: '1111111111', type: 'SISTEM', status: 'ACTIVE' },
  { id: 'comp_dcs', name: 'DCS Customs', taxNumber: '2222222222', type: 'GUMRUK', status: 'ACTIVE' },
  { id: 'comp_trendyol', name: 'Trendyol A.Ş.', taxNumber: '3333333333', type: 'TICARET', status: 'ACTIVE' },
];

export const mockUsers: User[] = [
  // ATEZ (SISTEM)
  {
    id: 'user_atez_admin',
    firstName: 'ATEZ',
    lastName: 'Admin',
    email: 'admin@atez.com',
    password: '123',
    role: 'ADMIN',
    primaryCompanyId: 'comp_atez',
    assignedCompanyIds: ['comp_atez', 'comp_dcs', 'comp_trendyol'],
    status: 'ACTIVE'
  },
  {
    id: 'user_atez_musavir',
    firstName: 'ATEZ',
    lastName: 'Müşavir',
    email: 'musavir@atez.com',
    password: '123',
    role: 'MUSAVIR',
    primaryCompanyId: 'comp_atez',
    assignedCompanyIds: ['comp_atez'],
    status: 'ACTIVE'
  },
  {
    id: 'user_atez_standart',
    firstName: 'ATEZ',
    lastName: 'Standart',
    email: 'standart@atez.com',
    password: '123',
    role: 'STANDART',
    primaryCompanyId: 'comp_atez',
    assignedCompanyIds: ['comp_atez'],
    status: 'ACTIVE'
  },

  // DCS Customs (GUMRUK)
  {
    id: 'user_dcs_admin',
    firstName: 'DCS',
    lastName: 'Admin',
    email: 'admin@dcs.com',
    password: '123',
    role: 'ADMIN',
    primaryCompanyId: 'comp_dcs',
    assignedCompanyIds: ['comp_dcs', 'comp_trendyol'],
    status: 'ACTIVE'
  },
  {
    id: 'user_dcs_musavir',
    firstName: 'DCS',
    lastName: 'Müşavir',
    email: 'musavir@dcs.com',
    password: '123',
    role: 'MUSAVIR',
    primaryCompanyId: 'comp_dcs',
    assignedCompanyIds: ['comp_trendyol'], 
    status: 'ACTIVE'
  },
  {
    id: 'user_dcs_standart',
    firstName: 'DCS',
    lastName: 'Standart',
    email: 'standart@dcs.com',
    password: '123',
    role: 'STANDART',
    primaryCompanyId: 'comp_dcs',
    assignedCompanyIds: ['comp_dcs'],
    status: 'ACTIVE'
  },

  // Trendyol A.Ş. (TICARET)
  {
    id: 'user_trendyol_admin',
    firstName: 'Trendyol',
    lastName: 'Admin',
    email: 'admin@trendyol.com',
    password: '123',
    role: 'ADMIN',
    primaryCompanyId: 'comp_trendyol',
    assignedCompanyIds: ['comp_trendyol'],
    status: 'ACTIVE'
  },
  {
    id: 'user_trendyol_musavir',
    firstName: 'Trendyol',
    lastName: 'Müşavir',
    email: 'musavir@trendyol.com',
    password: '123',
    role: 'MUSAVIR',
    primaryCompanyId: 'comp_trendyol',
    assignedCompanyIds: ['comp_trendyol'],
    status: 'ACTIVE'
  },
  {
    id: 'user_trendyol_standart',
    firstName: 'Trendyol',
    lastName: 'Standart',
    email: 'standart@trendyol.com',
    password: '123',
    role: 'STANDART',
    primaryCompanyId: 'comp_trendyol',
    assignedCompanyIds: ['comp_trendyol'],
    status: 'ACTIVE'
  }
];
