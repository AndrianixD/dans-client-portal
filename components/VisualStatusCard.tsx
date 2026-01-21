'use client';

import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

interface VisualStatusCardProps {
  currentStage: string;
  message: string;
  lastUpdated: string;
}

// Ilustrações SVG para cada status
const StatusIllustrations: { [key: string]: JSX.Element } = {
  'vehicle received': (
    <svg viewBox="0 0 120 80" className="w-full h-full">
      {/* Garage/Building */}
      <rect x="10" y="25" width="45" height="45" fill="#374151" rx="3"/>
      <rect x="15" y="35" width="35" height="35" fill="#1f2937"/>
      <rect x="20" y="40" width="25" height="25" fill="#4b5563" rx="2"/>
      {/* Garage door lines */}
      <line x1="20" y1="47" x2="45" y2="47" stroke="#6b7280" strokeWidth="1"/>
      <line x1="20" y1="54" x2="45" y2="54" stroke="#6b7280" strokeWidth="1"/>
      <line x1="20" y1="61" x2="45" y2="61" stroke="#6b7280" strokeWidth="1"/>
      {/* Car entering */}
      <g className="animate-pulse">
        <rect x="60" y="48" width="45" height="18" fill="#dc2626" rx="4"/>
        <rect x="65" y="42" width="25" height="10" fill="#dc2626" rx="3"/>
        <circle cx="70" cy="68" r="5" fill="#1f2937"/>
        <circle cx="95" cy="68" r="5" fill="#1f2937"/>
        <rect x="67" y="44" width="8" height="6" fill="#93c5fd" rx="1"/>
        <rect x="78" y="44" width="8" height="6" fill="#93c5fd" rx="1"/>
      </g>
      {/* Arrow */}
      <path d="M55 55 L58 52 L58 54 L62 54 L62 56 L58 56 L58 58 Z" fill="#22c55e" className="animate-bounce"/>
    </svg>
  ),
  'work in progress': (
    <svg viewBox="0 0 120 80" className="w-full h-full">
      {/* Car body */}
      <rect x="25" y="40" width="70" height="22" fill="#dc2626" rx="4"/>
      <rect x="35" y="30" width="40" height="14" fill="#dc2626" rx="3"/>
      {/* Windows */}
      <rect x="38" y="32" width="14" height="10" fill="#93c5fd" rx="2"/>
      <rect x="55" y="32" width="14" height="10" fill="#93c5fd" rx="2"/>
      {/* Wheels */}
      <circle cx="40" cy="64" r="7" fill="#1f2937"/>
      <circle cx="80" cy="64" r="7" fill="#1f2937"/>
      <circle cx="40" cy="64" r="3" fill="#4b5563"/>
      <circle cx="80" cy="64" r="3" fill="#4b5563"/>
      {/* Wrench */}
      <g className="animate-bounce" style={{ transformOrigin: '100px 35px' }}>
        <rect x="95" y="20" width="6" height="30" fill="#fbbf24" rx="2"/>
        <circle cx="98" cy="18" r="6" fill="none" stroke="#fbbf24" strokeWidth="4"/>
        <rect x="95" y="50" width="6" height="8" fill="#fbbf24"/>
        <rect x="92" y="55" width="12" height="4" fill="#fbbf24" rx="1"/>
      </g>
      {/* Sparks */}
      <circle cx="70" cy="45" r="2" fill="#fbbf24" className="animate-ping"/>
      <circle cx="65" cy="50" r="1.5" fill="#fbbf24" className="animate-ping" style={{ animationDelay: '0.2s' }}/>
    </svg>
  ),
  'ready for pickup': (
    <svg viewBox="0 0 120 80" className="w-full h-full">
      {/* Car body - shiny */}
      <rect x="25" y="40" width="70" height="22" fill="#dc2626" rx="4"/>
      <rect x="35" y="30" width="40" height="14" fill="#dc2626" rx="3"/>
      {/* Shine effect */}
      <rect x="30" y="42" width="20" height="2" fill="#fca5a5" rx="1"/>
      <rect x="40" y="32" width="10" height="2" fill="#fca5a5" rx="1"/>
      {/* Windows */}
      <rect x="38" y="32" width="14" height="10" fill="#93c5fd" rx="2"/>
      <rect x="55" y="32" width="14" height="10" fill="#93c5fd" rx="2"/>
      {/* Wheels */}
      <circle cx="40" cy="64" r="7" fill="#1f2937"/>
      <circle cx="80" cy="64" r="7" fill="#1f2937"/>
      <circle cx="40" cy="64" r="3" fill="#4b5563"/>
      <circle cx="80" cy="64" r="3" fill="#4b5563"/>
      {/* Checkmark badge */}
      <circle cx="100" cy="25" r="12" fill="#22c55e" className="animate-pulse"/>
      <path d="M94 25 L98 29 L106 21" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Sparkles */}
      <circle cx="15" cy="35" r="2" fill="#fbbf24" className="animate-ping"/>
      <circle cx="110" cy="50" r="2" fill="#fbbf24" className="animate-ping" style={{ animationDelay: '0.3s' }}/>
    </svg>
  ),
  'awaiting approval': (
    <svg viewBox="0 0 120 80" className="w-full h-full">
      {/* Car body */}
      <rect x="25" y="40" width="70" height="22" fill="#6b7280" rx="4"/>
      <rect x="35" y="30" width="40" height="14" fill="#6b7280" rx="3"/>
      {/* Windows */}
      <rect x="38" y="32" width="14" height="10" fill="#9ca3af" rx="2"/>
      <rect x="55" y="32" width="14" height="10" fill="#9ca3af" rx="2"/>
      {/* Wheels */}
      <circle cx="40" cy="64" r="7" fill="#1f2937"/>
      <circle cx="80" cy="64" r="7" fill="#1f2937"/>
      {/* Document/clipboard */}
      <rect x="85" y="15" width="25" height="32" fill="white" stroke="#d1d5db" strokeWidth="2" rx="2"/>
      <rect x="90" y="22" width="15" height="2" fill="#d1d5db"/>
      <rect x="90" y="27" width="12" height="2" fill="#d1d5db"/>
      <rect x="90" y="32" width="15" height="2" fill="#d1d5db"/>
      <rect x="90" y="37" width="8" height="2" fill="#d1d5db"/>
      {/* Hourglass/clock */}
      <circle cx="97" cy="58" r="10" fill="#fbbf24" className="animate-pulse"/>
      <circle cx="97" cy="58" r="6" fill="white"/>
      <line x1="97" y1="58" x2="97" y2="53" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
      <line x1="97" y1="58" x2="101" y2="58" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  'awaiting parts': (
    <svg viewBox="0 0 120 80" className="w-full h-full">
      {/* Car body - partial */}
      <rect x="25" y="40" width="55" height="22" fill="#dc2626" rx="4"/>
      <rect x="35" y="30" width="30" height="14" fill="#dc2626" rx="3"/>
      {/* Windows */}
      <rect x="38" y="32" width="10" height="10" fill="#93c5fd" rx="2"/>
      <rect x="50" y="32" width="10" height="10" fill="#93c5fd" rx="2"/>
      {/* Wheels */}
      <circle cx="40" cy="64" r="7" fill="#1f2937"/>
      <circle cx="70" cy="64" r="7" fill="#1f2937"/>
      {/* Missing part outline */}
      <rect x="80" y="40" width="15" height="22" fill="none" stroke="#9ca3af" strokeWidth="2" strokeDasharray="4"/>
      {/* Box */}
      <g className="animate-bounce">
        <rect x="88" y="12" width="24" height="20" fill="#a3763d"/>
        <rect x="88" y="12" width="24" height="5" fill="#8b5a2b"/>
        <line x1="100" y1="12" x2="100" y2="32" stroke="#6b4423" strokeWidth="2"/>
        <line x1="88" y1="22" x2="112" y2="22" stroke="#6b4423" strokeWidth="1"/>
      </g>
      {/* Arrow down */}
      <path d="M100 35 L96 40 L99 40 L99 45 L101 45 L101 40 L104 40 Z" fill="#22c55e"/>
    </svg>
  ),
  'paint in progress': (
    <svg viewBox="0 0 120 80" className="w-full h-full">
      {/* Car body - being painted */}
      <rect x="25" y="40" width="70" height="22" fill="#fca5a5" rx="4"/>
      <rect x="35" y="30" width="40" height="14" fill="#fca5a5" rx="3"/>
      {/* Gradient overlay for paint effect */}
      <rect x="25" y="40" width="35" height="22" fill="#dc2626" rx="4"/>
      <rect x="35" y="30" width="20" height="14" fill="#dc2626" rx="3"/>
      {/* Windows */}
      <rect x="38" y="32" width="14" height="10" fill="#93c5fd" rx="2"/>
      <rect x="55" y="32" width="14" height="10" fill="#bfdbfe" rx="2"/>
      {/* Wheels */}
      <circle cx="40" cy="64" r="7" fill="#1f2937"/>
      <circle cx="80" cy="64" r="7" fill="#d1d5db"/>
      {/* Spray gun */}
      <g className="animate-pulse">
        <rect x="95" y="25" width="8" height="20" fill="#4b5563" rx="2"/>
        <rect x="93" y="22" width="12" height="6" fill="#6b7280" rx="1"/>
        <rect x="90" y="45" width="6" height="12" fill="#374151" rx="1"/>
        {/* Spray particles */}
        <circle cx="75" cy="35" r="2" fill="#dc2626" opacity="0.6"/>
        <circle cx="78" cy="40" r="1.5" fill="#dc2626" opacity="0.4"/>
        <circle cx="72" cy="38" r="1" fill="#dc2626" opacity="0.5"/>
        <circle cx="80" cy="33" r="1.5" fill="#dc2626" opacity="0.3"/>
      </g>
    </svg>
  ),
  'quality control': (
    <svg viewBox="0 0 120 80" className="w-full h-full">
      {/* Car body */}
      <rect x="25" y="40" width="70" height="22" fill="#dc2626" rx="4"/>
      <rect x="35" y="30" width="40" height="14" fill="#dc2626" rx="3"/>
      {/* Shine effect */}
      <rect x="30" y="42" width="20" height="2" fill="#fca5a5" rx="1"/>
      {/* Windows */}
      <rect x="38" y="32" width="14" height="10" fill="#93c5fd" rx="2"/>
      <rect x="55" y="32" width="14" height="10" fill="#93c5fd" rx="2"/>
      {/* Wheels */}
      <circle cx="40" cy="64" r="7" fill="#1f2937"/>
      <circle cx="80" cy="64" r="7" fill="#1f2937"/>
      {/* Magnifying glass */}
      <g className="animate-pulse">
        <circle cx="95" cy="35" r="15" fill="none" stroke="#3b82f6" strokeWidth="4"/>
        <circle cx="95" cy="35" r="12" fill="#bfdbfe" opacity="0.3"/>
        <line x1="106" y1="46" x2="115" y2="58" stroke="#3b82f6" strokeWidth="5" strokeLinecap="round"/>
      </g>
      {/* Check marks */}
      <path d="M45 55 L47 57 L51 53" stroke="#22c55e" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M60 55 L62 57 L66 53" stroke="#22c55e" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M75 55 L77 57 L81 53" stroke="#22c55e" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  'disassembly': (
    <svg viewBox="0 0 120 80" className="w-full h-full">
      {/* Car parts scattered */}
      {/* Main body */}
      <rect x="35" y="42" width="50" height="18" fill="#dc2626" rx="3"/>
      {/* Hood - separated */}
      <rect x="10" y="35" width="20" height="12" fill="#dc2626" rx="2" className="animate-pulse"/>
      {/* Door - separated */}
      <rect x="90" y="38" width="15" height="20" fill="#dc2626" rx="2"/>
      <rect x="92" y="42" width="8" height="8" fill="#93c5fd" rx="1"/>
      {/* Bumper */}
      <rect x="25" y="65" width="30" height="6" fill="#4b5563" rx="2"/>
      {/* Wheels - separated */}
      <circle cx="15" cy="60" r="6" fill="#1f2937"/>
      <circle cx="105" cy="65" r="6" fill="#1f2937"/>
      {/* Tools */}
      <rect x="55" y="15" width="4" height="20" fill="#fbbf24" rx="1"/>
      <rect x="65" y="18" width="4" height="17" fill="#9ca3af" rx="1"/>
      {/* Screws */}
      <circle cx="48" cy="25" r="2" fill="#6b7280"/>
      <circle cx="78" cy="22" r="2" fill="#6b7280"/>
      <circle cx="88" cy="28" r="2" fill="#6b7280"/>
    </svg>
  ),
  'default': (
    <svg viewBox="0 0 120 80" className="w-full h-full">
      {/* Simple car */}
      <rect x="25" y="40" width="70" height="22" fill="#dc2626" rx="4"/>
      <rect x="35" y="30" width="40" height="14" fill="#dc2626" rx="3"/>
      <rect x="38" y="32" width="14" height="10" fill="#93c5fd" rx="2"/>
      <rect x="55" y="32" width="14" height="10" fill="#93c5fd" rx="2"/>
      <circle cx="40" cy="64" r="7" fill="#1f2937"/>
      <circle cx="80" cy="64" r="7" fill="#1f2937"/>
      <circle cx="40" cy="64" r="3" fill="#4b5563"/>
      <circle cx="80" cy="64" r="3" fill="#4b5563"/>
    </svg>
  ),
};

// Função para obter ilustração baseada no status
function getStatusIllustration(status: string): JSX.Element {
  const normalizedStatus = status.toLowerCase().trim();
  
  // Busca exata ou parcial
  for (const [key, illustration] of Object.entries(StatusIllustrations)) {
    if (normalizedStatus.includes(key) || key.includes(normalizedStatus)) {
      return illustration;
    }
  }
  
  return StatusIllustrations['default'];
}

// Cores de fundo baseadas no status
function getStatusColor(status: string): string {
  const s = status.toLowerCase();
  if (s.includes('ready') || s.includes('pickup')) return 'from-green-50 to-emerald-50 border-green-200';
  if (s.includes('progress') || s.includes('work')) return 'from-blue-50 to-indigo-50 border-blue-200';
  if (s.includes('awaiting') || s.includes('waiting')) return 'from-amber-50 to-yellow-50 border-amber-200';
  if (s.includes('paint')) return 'from-rose-50 to-red-50 border-rose-200';
  if (s.includes('quality')) return 'from-purple-50 to-violet-50 border-purple-200';
  if (s.includes('disassembly')) return 'from-slate-50 to-gray-50 border-slate-200';
  if (s.includes('received')) return 'from-cyan-50 to-sky-50 border-cyan-200';
  return 'from-gray-50 to-slate-50 border-gray-200';
}

export default function VisualStatusCard({ currentStage, message, lastUpdated }: VisualStatusCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 60) {
        return `${diffMins}m ago`;
      } else if (diffHours < 24) {
        return `${diffHours}h ago`;
      } else if (diffDays < 7) {
        return `${diffDays}d ago`;
      } else {
        return new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
        }).format(date);
      }
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className={`bg-gradient-to-br ${getStatusColor(currentStage)} rounded-2xl shadow-lg border p-6 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Header row: Illustration + Status */}
      <div className="flex items-center gap-5">
        {/* Illustration */}
        <div className="w-28 h-20 flex-shrink-0">
          {getStatusIllustration(currentStage)}
        </div>
        
        {/* Status info */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Current Status</p>
          <h3 className="text-xl font-bold text-gray-900 leading-tight truncate">{currentStage}</h3>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{formatDate(lastUpdated)}</span>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="mt-4 pt-4 border-t border-gray-200/50">
          <p className="text-sm text-gray-700 leading-relaxed">
            {message}
          </p>
        </div>
      )}
    </div>
  );
}
