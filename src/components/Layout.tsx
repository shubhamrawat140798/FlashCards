import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { DataSourceBanner } from './DataSourceBanner';
import { useDataMode } from '../hooks/useDataMode';

export function Layout() {
  const location = useLocation();
  const { status, loading, refresh } = useDataMode();
  const showBanner = location.pathname.startsWith('/admin');

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="layout-header-inner">
          <NavLink to="/" className="layout-brand">
            MCQ Test
          </NavLink>
          <nav className="layout-nav">
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Home
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              History
            </NavLink>
            <NavLink
              to="/admin"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Admin Portal
            </NavLink>
          </nav>
        </div>
      </header>
      {showBanner && (
        <div className="layout-data-source">
          <DataSourceBanner
            status={status}
            loading={loading}
            variant="compact"
            onRecheck={() => void refresh(true)}
          />
        </div>
      )}
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
}
