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
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <CheckCircle className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Status Atual
          </h2>
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold mb-4">
            {currentStage}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Última atualização: {formatDate(lastUpdated)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

