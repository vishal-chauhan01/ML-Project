import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 pt-6 border-t border-slate-200/60 pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400 font-medium">
      <p>Sharewise uses simulated AI predictions for educational purposes only. Not financial advice.</p>
      <span>Data by Sharewise AI v1.4.2</span>
    </footer>
  );
};
