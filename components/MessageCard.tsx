'use client';

import { MessageSquare } from 'lucide-react';

interface MessageCardProps {
  message: string;
  description?: string;
}

export default function MessageCard({ message, description }: MessageCardProps) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md">
          <MessageSquare className="w-7 h-7 text-gray-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Message from Shop
          </h3>
          <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-gray-300">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
              {message}
            </p>
            {description && (
              <p className="text-sm text-gray-500 mt-4 pt-4 border-t border-gray-200 italic">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

