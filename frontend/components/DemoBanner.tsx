import React from 'react';
import { Info } from 'lucide-react';

export default function DemoBanner() {
  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-center text-xs text-amber-300 font-medium flex items-center justify-center gap-2">
      <Info className="w-4 h-4 text-amber-400 shrink-0" />
      <span>
        <strong>DEMO MODE ACTIVE</strong> — Evaluated scores and company readiness indicators are practice guidance, not hiring guarantees.
      </span>
    </div>
  );
}
