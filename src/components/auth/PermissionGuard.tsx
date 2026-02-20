import React from 'react';
import { useAuth } from '@/context/AuthContext';

type Role = 'Admin' | 'Manager' | 'Viewer';

interface PermissionGuardProps {
    allowedRoles: Role[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
    allowedRoles,
    children,
    fallback = null,
}) => {
    const { user } = useAuth();

    if (!user) {
        return <>{fallback}</>;
    }

    if (allowedRoles.includes(user.role as Role)) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
};
