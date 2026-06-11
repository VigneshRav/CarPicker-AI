import React from 'react';

function Footer() {
  return (
    <footer className="border-t border-darkbg-border bg-darkbg-deep/40 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} CarCompass AI. Helping car buyers find their perfect match.</p>
      </div>
    </footer>
  );
}

export default Footer;
