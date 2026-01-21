'use client';

import { Clock, CheckCircle } from 'lucide-react';

interface StatusTimelineProps {
  currentStage: string;
  lastUpdated: string;
}

export default function StatusTimeline({ currentStage, lastUpdated }: StatusTimelineProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600 hover:shadow-xl transition">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
          <CheckCircle className="w-7 h-7 text-blue-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Current Status
          </h2>
          <div className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-bold text-base shadow-md mb-4">
            {currentStage}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Last updated: {formatDate(lastUpdated)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

