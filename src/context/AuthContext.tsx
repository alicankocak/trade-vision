import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type Role = 'Admin' | 'Manager' | 'User';

interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    company: string;
}

interface AuthContextType {
    user: User | null;
    login: (role?: Role) => void;
    logout: () => void;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock Initial User
const INITIAL_USER: User = {
    id: '1',
    name: 'Alican Admin',
    email: 'alican@tradevision.com',
    role: 'Admin',
    company: 'TradeVision HQ',
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(INITIAL_USER);

    const login = (role: Role = 'Admin') => {
        setUser({
            ...INITIAL_USER,
            role: role,
            name: `Alican ${role}`,
        });
    };

    const logout = () => {
        setUser(null);
    };

    const isAdmin = user?.role === 'Admin';

    return (
        <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
