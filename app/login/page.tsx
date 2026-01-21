'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const [roNumber, setRoNumber] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roNumber: roNumber.trim(),
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao fazer login');
        setLoading(false);
        return;
      }

      // Salvar dados na sessão (usando localStorage temporariamente)
      localStorage.setItem('clientSession', JSON.stringify({
        roNumber: data.vehicleData.roNumber,
        email: email.trim().toLowerCase(),
        clientName: data.vehicleData.clientName,
        loginTime: new Date().toISOString(),
      }));

      // Redirecionar para dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Erro ao conectar com o servidor');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'cursive' }}>
            Dan&apos;s Auto Body
          </h1>
          <div className="w-16 h-1 bg-red-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-white">CLIENT PORTAL</h2>
          <p className="text-gray-400 mt-2">
            Acesse o status do seu veículo
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="roNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Claim Number / RO Number *
              </label>
              <input
                id="roNumber"
                type="text"
                value={roNumber}
                onChange={(e) => setRoNumber(e.target.value)}
                placeholder="Digite seu número de claim"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition text-gray-900"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition text-gray-900"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Acessando...
                </span>
              ) : (
                'ACCESS PORTAL'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Precisa de ajuda para acessar?
            </p>
            <p className="text-sm text-center mt-2">
              <a href="tel:(978)587-3341" className="text-red-600 hover:text-red-700 font-medium">
                (978) 587-3341
              </a>
              {' ou '}
              <a href="mailto:info@dansautobodyma.com" className="text-red-600 hover:text-red-700 font-medium">
                info@dansautobodyma.com
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            147 Summit St, Suite 10, Peabody, MA 01960
          </p>
        </div>
      </div>
    </div>
  );
}

