import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { TopNav } from '../components/ui/TopNav';
import { Sidebar } from '../components/ui/Sidebar';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';

interface AppLayoutProps {
  children: ReactNode;
  sidebarItems: Array<{ label: string; href: string; icon?: ReactNode }>;
}

export function AppLayout({ children, sidebarItems }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav>
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <Avatar name={user.full_name} size="sm" />
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          )}
          <Button onClick={logout} variant="outline" size="sm">
            Logout
          </Button>
        </div>
      </TopNav>
      <div className="flex">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed bottom-4 right-4 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Sidebar */}
        <div
          className={`
            fixed md:static inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          <div className="h-[calc(100vh-4rem)] overflow-y-auto">
            <Sidebar items={sidebarItems} />
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
