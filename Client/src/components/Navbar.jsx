import React from 'react';

function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-darkbg-deep/80 backdrop-blur-md border-b border-darkbg-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            {/* Logo Icon */}
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 to-accent flex items-center justify-center shadow-lg shadow-brand-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-white">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-300 bg-clip-text text-transparent">
                CarCompass
              </span>
              <span className="font-display font-semibold text-xs ml-1 bg-gradient-to-r from-brand-400 to-accent bg-clip-text text-transparent">
                AI
              </span>
            </div>
          </div>
          <nav className="flex space-x-4">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-800/80 text-brand-300 border border-slate-700/50">
              v1.0.0
            </span>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
