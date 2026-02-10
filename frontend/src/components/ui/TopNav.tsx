import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface TopNavProps {
  logo?: ReactNode;
  children?: ReactNode;
}

export function TopNav({ logo, children }: TopNavProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center">
              {logo || (
                <div className="text-xl font-bold text-gray-900">
                  Job Board AI
                </div>
              )}
            </Link>
          </div>
          {children && <div className="flex items-center gap-4">{children}</div>}
        </div>
      </div>
    </header>
  );
}
