import React from 'react';

function FormField({ label, description, error, children, className = '' }) {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-slate-200 tracking-wide">
          {label}
        </label>
      )}
      {description && (
        <p className="text-xs text-slate-400">
          {description}
        </p>
      )}
      <div className="relative">
        {children}
      </div>
      {error && (
        <p className="text-xs text-red-400 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

export default FormField;
