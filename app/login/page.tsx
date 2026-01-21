'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Verificar se é admin ou cliente
      if (data.isAdmin) {
        // Salvar sessão admin
        localStorage.setItem('adminSession', JSON.stringify({
          username: username.trim(),
          loginTime: new Date().toISOString(),
        }));
        router.push('/admin/dashboard');
      } else {
        // Salvar dados na sessão do cliente
        localStorage.setItem('clientSession', JSON.stringify({
          roNumber: data.vehicleData.roNumber,
          password: password.trim(), // Guardar password para requests futuros
          clientName: data.vehicleData.clientName,
          loginTime: new Date().toISOString(),
        }));
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to connect to server');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.png"
              alt="Dan's Auto Body"
              width={220}
              height={84}
              priority
              className="h-16 w-auto"
            />
          </div>
          <div className="w-16 h-1 bg-red-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-white">PORTAL</h2>
          <p className="text-gray-400 mt-2">
            Access your vehicle repair status or admin dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                Username / RO Number *
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your RO number or admin username"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition text-gray-900 text-base"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password *
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition text-gray-900 text-base"
                required
                disabled={loading}
              />
              <p className="mt-2 text-xs text-gray-500">
                For clients: Use your RO number and code provided by our team<br />
                For admins: Use your admin credentials
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Accessing Portal...
                </span>
              ) : (
                'ACCESS PORTAL →'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center font-medium">
              Need help accessing your account?
            </p>
            <p className="text-sm text-center mt-2">
              <a href="tel:(978)587-3341" className="text-black hover:text-gray-800 font-semibold transition">
                (978) 587-3341
              </a>
              <span className="text-black"> or </span>
              <a href="mailto:info@dansautobodyma.com" className="text-black hover:text-gray-800 font-semibold transition">
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

