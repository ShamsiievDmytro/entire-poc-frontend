import { NavLink } from 'react-router-dom';

export function NavBar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1 text-sm font-medium ${
      isActive
        ? 'text-indigo-600 border-b-2 border-indigo-600'
        : 'text-gray-500 hover:text-gray-700'
    }`;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Entire PoC Dashboard</h1>
        <nav className="flex gap-2">
          <NavLink to="/" end className={linkClass}>Dashboard</NavLink>
          <NavLink to="/commits" className={linkClass}>Commits</NavLink>
        </nav>
      </div>
    </header>
  );
}
