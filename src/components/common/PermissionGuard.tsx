'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/data/mockAuthData';

interface PermissionGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  requireSuperAdmin?: boolean;
  fallbackPath?: string;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  children, 
  allowedRoles, 
  requireSuperAdmin = false,
  fallbackPath = '/dashboard' 
}) => {
  const { currentUser } = useAuthStore();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setIsAuthorized(false);
      router.push('/login');
      return;
    }

    const isSuperAdmin = currentUser.role === 'ADMIN' && currentUser.primaryCompanyId === 'comp_atez';

    if (requireSuperAdmin && !isSuperAdmin) {
      setIsAuthorized(false);
      router.push(fallbackPath);
      return;
    }

    if (!allowedRoles.includes(currentUser.role)) {
      setIsAuthorized(false);
      router.push(fallbackPath);
    } else {
      setIsAuthorized(true);
    }
  }, [currentUser, allowedRoles, requireSuperAdmin, fallbackPath, router]);

  // Loading state while checking
  if (isAuthorized === null) {
    return <div className="p-8 flex items-center justify-center">Yetki kontrol ediliyor...</div>;
  }

  // Not authorized
  if (!isAuthorized) {
    return null; // Will trigger redirect in useEffect
  }

  // Authorized
  return <>{children}</>;
};
