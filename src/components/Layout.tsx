import { NavLink, Outlet } from 'react-router-dom';

export function Layout() {
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
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
}
