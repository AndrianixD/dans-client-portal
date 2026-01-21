'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LogOut, Car, Shield, FileText, Hash, Mail, MessageCircle, Phone } from 'lucide-react';

interface VehicleData {
  vin?: string;
  model?: string;
  year?: string;
  make?: string;
  clientName?: string;
  roNumber: string;
  vehicle?: string;
  insurance?: string;
  claim?: string;
}

interface StatusData {
  currentStage: string;
  message: string;
  description?: string;
  lastUpdated: string;
}


export default function DashboardPage() {
  const [session, setSession] = useState<any>(null);
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const loadData = async (isRefresh = false) => {
    try {
      setLoading(true);

      const sessionData = localStorage.getItem('clientSession');
      if (!sessionData) {
        router.push('/login');
        return;
      }

      const parsedSession = JSON.parse(sessionData);
      setSession(parsedSession);

      const demoParam = parsedSession.demo ? '&demo=true' : '';
      const passwordParam = parsedSession.password ? `&password=${encodeURIComponent(parsedSession.password)}` : '';
      const vehicleResponse = await fetch(
        `/api/vehicle/${parsedSession.roNumber}?${passwordParam}${demoParam}`
      );
      
      if (!vehicleResponse.ok) {
        throw new Error('Error loading vehicle data');
      }

      const vehicle = await vehicleResponse.json();
      setVehicleData(vehicle);

      const statusParams = new URLSearchParams();
      if (parsedSession.demo) statusParams.append('demo', 'true');
      if (parsedSession.password) statusParams.append('password', parsedSession.password);
      const statusResponse = await fetch(
        `/api/status/${parsedSession.roNumber}?${statusParams.toString()}`
      );

      if (!statusResponse.ok) {
        throw new Error('Error loading status');
      }

      const status = await statusResponse.json();
      setStatusData(status);
    } catch (err: any) {
      console.error('Error loading dashboard data:', err);
      setError(err.message || 'Error loading data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('clientSession');
    router.push('/login');
  };


  // Get first name
  const firstName = vehicleData?.clientName?.split(' ')[0] || session?.clientName?.split(' ')[0] || 'Customer';
  
  // Contact info
  const shopEmail = 'info@dansautobodyma.com';
  const shopPhone = '9785873341';
  const roNumber = vehicleData?.roNumber || '';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1f2e] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-400 font-medium">Loading your data...</p>
        </div>
      </div>
    );
  }

  if (error && !vehicleData) {
    return (
      <div className="min-h-screen bg-[#1a1f2e] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#242938] rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Data</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1f2e]">
      {/* Header */}
      <header className="bg-[#242938] border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="Dan's Auto Body"
              width={160}
              height={60}
              className="h-10 w-auto"
              priority
            />
            <div>
              <p className="text-red-400 text-xs font-semibold tracking-wider">CLIENT PORTAL</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {session?.demo && (
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded font-semibold">
                DEMO
              </span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Welcome Message */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Welcome back, {firstName}</h2>
          <p className="text-gray-400">Here&apos;s what&apos;s happening with your repair today.</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Status & Message */}
          <div className="lg:col-span-2 space-y-6">
            {statusData && (
              <div className="bg-[#242938] rounded-xl p-6">
                <div className="mb-4">
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Current Status</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div className="bg-[#1a1f2e] rounded-lg p-4">
                    <p className="text-gray-400 text-xs uppercase font-semibold mb-2">Stage</p>
                    <h3 className="text-white font-bold text-2xl">{statusData.currentStage}</h3>
                  </div>

                  <div className="bg-[#1a1f2e] rounded-lg p-4">
                    <p className="text-gray-400 text-xs uppercase font-semibold mb-2">Message</p>
                    <p className="text-gray-300 leading-relaxed">{statusData.message}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Vehicle Photos Placeholder */}
            <div className="bg-[#242938] rounded-xl p-6">
              <div className="mb-3">
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Vehicle Photos</span>
              </div>
              <div className="border border-dashed border-gray-600/70 rounded-lg p-8 text-center">
                <p className="text-gray-400 text-sm">
                  Photos will appear here as your vehicle progresses through each stage.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Vehicle Details */}
          <div className="space-y-6">
            {/* Vehicle Details Card */}
            {vehicleData && (
              <div className="bg-[#242938] rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-semibold">Vehicle Details</h3>
                </div>
                  <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-semibold">
                    RO #{vehicleData.roNumber}
                  </span>
                </div>

                {/* Vehicle Image/Icon */}
                <div className="bg-[#1a1f2e] rounded-lg p-6 mb-6">
                  <div className="text-center">
                    <h4 className="text-white font-bold text-lg">
                      {vehicleData.year} {vehicleData.make || ''} {vehicleData.model || ''}
                    </h4>
                    {vehicleData.vehicle && (
                      <p className="text-gray-400 text-sm mt-1">{vehicleData.vehicle.split(' ').slice(3).join(' ')}</p>
                    )}
                  </div>
                </div>

                {/* Vehicle Info Grid */}
                <div className="space-y-3">
                  {vehicleData.vin && (
                    <div className="flex items-start gap-3 p-3 bg-[#1a1f2e] rounded-lg">
                      <Hash className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-gray-500 text-xs uppercase font-semibold">VIN</p>
                        <p className="text-gray-300 text-sm font-mono">{vehicleData.vin}</p>
                      </div>
                    </div>
                  )}
                  
                  {vehicleData.insurance && (
                    <div className="flex items-start gap-3 p-3 bg-[#1a1f2e] rounded-lg">
                      <Shield className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-gray-500 text-xs uppercase font-semibold">Insurance</p>
                        <p className="text-gray-300 text-sm">{vehicleData.insurance}</p>
                      </div>
                    </div>
                  )}
                  
                  {vehicleData.claim && (
                    <div className="flex items-start gap-3 p-3 bg-[#1a1f2e] rounded-lg">
                      <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-gray-500 text-xs uppercase font-semibold">Claim Number</p>
                        <p className="text-gray-300 text-sm font-mono">{vehicleData.claim}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Need Assistance Card */}
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-lg">?</span>
                </div>
                <div>
                  <h4 className="text-gray-900 font-semibold">Need Assistance?</h4>
                  <p className="text-gray-500 text-sm">We&apos;re here to help.</p>
                </div>
              </div>

              {/* Call Button - Primary */}
              <a
                href={`tel:${shopPhone}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition font-medium mb-3"
              >
                <Phone className="w-4 h-4" />
                Call Us
              </a>

              {/* Text & Email - Secondary */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`sms:${shopPhone}?body=${encodeURIComponent(`Hi, question about RO #${roNumber}`)}`}
                  className="flex items-center justify-center gap-2 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition font-medium"
                >
                  <MessageCircle className="w-4 h-4" />
                  Text
                </a>
                <a
                  href={`mailto:${shopEmail}?subject=${encodeURIComponent(`Question about RO #${roNumber}`)}`}
                  className="flex items-center justify-center gap-2 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition font-medium"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </a>
              </div>

              {/* Business Hours */}
              <p className="text-gray-400 text-xs text-center mt-4">
                Business Hours: Mon-Fri 8am - 5pm
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
