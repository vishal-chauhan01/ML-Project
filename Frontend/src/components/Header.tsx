import React, { useState } from 'react';
import { Bell, TrendingUp, User, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'watchlist', label: 'Watchlist' },
    { id: 'market-insights', label: 'Market insights' },
    { id: 'models', label: 'Models' },
    { id: 'about', label: 'About' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white dark:bg-slate-900/95 border-b border-slate-100 dark:border-slate-800/80 px-4 sm:px-6 py-3.5 sticky top-0 z-50 transition-colors backdrop-blur-md">
      <div className="flex items-center justify-between">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => handleNavClick('overview')}
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">sharewise</span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative py-1 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {item.label}
                {isActive && (
                  <div className="absolute bottom-[-14px] left-0 right-0 h-[2.5px] bg-blue-600 dark:bg-blue-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Controls & Mobile Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Dark and Light Mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400 fill-amber-400/20" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>

          <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-full hover:bg-slate-50 dark:hover:bg-slate-800">
            <Bell className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold text-xs flex items-center justify-center border border-blue-200 dark:border-blue-800 shadow-xs">
            <User className="w-4 h-4 text-blue-700 dark:text-blue-300" />
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
