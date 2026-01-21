'use client';

import { MessageSquare } from 'lucide-react';

interface MessageCardProps {
  message: string;
  description?: string;
}

export default function MessageCard({ message, description }: MessageCardProps) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-white rounded-lg shadow-sm">
          <MessageSquare className="w-6 h-6 text-gray-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Mensagem da Oficina
          </h3>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {message}
            </p>
            {description && (
              <p className="text-sm text-gray-500 mt-3 pt-3 border-t border-gray-200">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

