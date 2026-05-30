'use client';

import React from 'react';
import { Sparkles, LogIn, LogOut, User, ChevronDown } from 'lucide-react';

interface NavbarProps {
  user: { email: string; credits: number } | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onScrollToSection: (id: string) => void;
  onNavigateToDashboard: () => void;
  onNavigateToWorkspace: () => void;
  view: 'landing' | 'workspace' | 'dashboard';
}

export default function Navbar({
  user,
  onLoginClick,
  onLogout,
  onScrollToSection,
  onNavigateToDashboard,
  onNavigateToWorkspace,
  view,
}: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5 bg-[#030303]/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={onNavigateToWorkspace}
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-purple to-brand-blue p-[1px]">
              <div className="flex items-center justify-center w-full h-full rounded-lg bg-[#030303] transition-colors group-hover:bg-[#030303]/80">
                <Sparkles className="w-4.5 h-4.5 text-brand-purple group-hover:text-brand-blue transition-colors" />
              </div>
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
              HumanDoc<span className="text-brand-purple">AI</span>
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {view === 'landing' ? (
              <>
                <button 
                  onClick={() => onScrollToSection('features')} 
                  className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  Features
                </button>
                <button 
                  onClick={() => onScrollToSection('pricing')} 
                  className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  Pricing
                </button>
                <button 
                  onClick={() => onScrollToSection('testimonials')} 
                  className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  Testimonials
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={onNavigateToWorkspace} 
                  className={`text-sm cursor-pointer transition-colors ${view === 'workspace' ? 'text-white font-semibold' : 'text-gray-400 hover:text-white'}`}
                >
                  Humanizer Workspace
                </button>
                {user && (
                  <button 
                    onClick={onNavigateToDashboard} 
                    className={`text-sm cursor-pointer transition-colors ${view === 'dashboard' ? 'text-white font-semibold' : 'text-gray-400 hover:text-white'}`}
                  >
                    Dashboard
                  </button>
                )}
              </>
            )}
          </div>

          {/* Action Area */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                {/* Logged In User Dropdown Trigger */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-white/3 hover:bg-white/5 transition-all text-sm text-gray-300 hover:text-white cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                  <span className="max-w-[120px] truncate hidden sm:inline">{user.email}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/5 bg-[#0A0A0A]/95 backdrop-blur-xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-3 py-2 border-b border-white/5 text-xs text-gray-500">
                        Logged in as <br />
                        <span className="font-semibold text-gray-300">{user.email}</span>
                      </div>
                      
                      <div className="p-1 space-y-1">
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            onNavigateToWorkspace();
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                        >
                          Workspace
                        </button>
                        
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            onNavigateToDashboard();
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                        >
                          Dashboard History
                        </button>
                        
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            onLogout();
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-brand-purple to-brand-blue rounded-lg shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:opacity-90 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Get Started</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
