'use client';

import { Mail, MessageCircle, Phone } from 'lucide-react';

interface ContactButtonsProps {
  roNumber?: string;
}

export default function ContactButtons({ roNumber }: ContactButtonsProps) {
  const shopEmail = 'info@dansautobodyma.com';
  const shopPhone = '9785873341';
  
  const emailSubject = roNumber 
    ? `Question about RO #${roNumber}` 
    : 'Question about my vehicle';
  
  const emailBody = roNumber
    ? `Hi,\n\nI have a question about RO #${roNumber}.\n\n`
    : `Hi,\n\nI have a question about my vehicle.\n\n`;

  const smsBody = roNumber
    ? `Hi, question about RO #${roNumber}`
    : `Hi, I have a question`;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-3">Need Help?</p>
      
      <div className="flex gap-2">
        <a
          href={`mailto:${shopEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Mail className="w-4 h-4" />
          <span className="font-semibold text-sm">Email</span>
        </a>

        <a
          href={`sms:${shopPhone}?body=${encodeURIComponent(smsBody)}`}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="font-semibold text-sm">Text</span>
        </a>

        <a
          href={`tel:${shopPhone}`}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Phone className="w-4 h-4" />
          <span className="font-semibold text-sm">Call</span>
        </a>
      </div>
    </div>
  );
}
