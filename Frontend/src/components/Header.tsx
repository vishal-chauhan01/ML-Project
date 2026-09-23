import React from 'react';
import { Bell, TrendingUp, User } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'watchlist', label: 'Watchlist' },
    { id: 'market-insights', label: 'Market insights' },
    { id: 'models', label: 'Models' },
  ];

  return (
    <header className="bg-white border-b border-slate-100 px-6 py-3.5 flex items-center justify-between sticky top-0 z-50">
      {/* Brand Logo */}
      <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('overview')}>
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
          <TrendingUp className="w-5 h-5" />
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-900">sharewise</span>
      </div>

      {/* Nav Links */}
      <nav className="flex items-center gap-8">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative py-1 text-sm font-medium transition-colors ${
                isActive ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {item.label}
              {isActive && (
                <div className="absolute bottom-[-14px] left-0 right-0 h-[2.5px] bg-blue-600 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User Controls */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-50">
          <Bell className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs flex items-center justify-center border border-blue-200 shadow-xs">
          <User className="w-4 h-4 text-blue-700" />
        </div>
      </div>
    </header>
  );
};
