import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../lib/auth';

type RequireAdminProps = {
  children: ReactNode;
};

export function RequireAdmin({ children }: RequireAdminProps) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
