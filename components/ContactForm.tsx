'use client';

import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

interface ContactFormProps {
  roNumber: string;
  password: string;
  demo?: boolean;
}

export default function ContactForm({ roNumber, password, demo }: ContactFormProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roNumber,
          password,
          message: message.trim(),
          demo: demo || false,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao enviar mensagem');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setMessage('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200/50 hover:shadow-2xl transition-all duration-300">
      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
            Contact Us
          </h2>
          <p className="text-2xl font-bold text-gray-900">
            Send Us a Message
          </p>
        </div>
          
          {success && (
            <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-xl flex items-center gap-3 shadow-sm">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <p className="text-green-800 text-sm font-semibold">
                Message sent successfully! We&apos;ll respond soon.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-center gap-3 shadow-sm">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <p className="text-red-800 text-sm font-semibold">{error}</p>
            </div>
          )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={6}
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none text-gray-900 text-base transition-all duration-200 bg-gray-50 focus:bg-white"
              required
              minLength={10}
              disabled={loading}
            />
            <div className="mt-3 flex items-center justify-between text-xs">
              <p className="text-gray-500 font-medium">
                Minimum 10 characters
              </p>
              <p className={`font-semibold ${message.length >= 10 ? 'text-emerald-600' : 'text-gray-400'}`}>
                {message.length} characters
              </p>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading || message.trim().length < 10}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending Message...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" strokeWidth={2.5} />
                Send Message
              </>
            )}
          </button>
        </form>

        <div className="pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Or call us directly: {' '}
            <a href="tel:(978)587-3341" className="text-emerald-600 hover:text-emerald-700 font-bold transition">
              (978) 587-3341
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

