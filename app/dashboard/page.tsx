'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, RefreshCw } from 'lucide-react';
import VehicleInfo from '@/components/VehicleInfo';
import StatusTimeline from '@/components/StatusTimeline';
import MessageCard from '@/components/MessageCard';
import ContactForm from '@/components/ContactForm';

interface VehicleData {
  vin: string;
  model: string;
  year: string;
  make?: string;
  clientName: string;
  roNumber: string;
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
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const loadData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      // Verificar sessão
      const sessionData = localStorage.getItem('clientSession');
      if (!sessionData) {
        router.push('/login');
        return;
      }

      const parsedSession = JSON.parse(sessionData);
      setSession(parsedSession);

      // Buscar dados do veículo
      const vehicleResponse = await fetch(
        `/api/vehicle/${parsedSession.roNumber}?email=${encodeURIComponent(parsedSession.email)}`
      );
      
      if (!vehicleResponse.ok) {
        throw new Error('Erro ao carregar dados do veículo');
      }

      const vehicle = await vehicleResponse.json();
      setVehicleData(vehicle);

      // Buscar status
      const statusResponse = await fetch(
        `/api/status/${parsedSession.roNumber}`
      );

      if (!statusResponse.ok) {
        throw new Error('Erro ao carregar status');
      }

      const status = await statusResponse.json();
      setStatusData(status);
    } catch (err: any) {
      console.error('Error loading dashboard data:', err);
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('clientSession');
    router.push('/login');
  };

  const handleRefresh = () => {
    loadData(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error && !vehicleData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Erro</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Voltar para Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ fontFamily: 'cursive' }}>
                Dan&apos;s Auto Body
              </h1>
              <p className="text-red-500 text-sm font-semibold">CLIENT PORTAL</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition disabled:opacity-50"
                title="Atualizar dados"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Atualizar</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Bem-vindo, {session?.clientName || 'Cliente'}!
          </h2>
          <p className="text-gray-600">
            Aqui você pode acompanhar o status do reparo do seu veículo e entrar em contato conosco.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="space-y-6">
          {/* Vehicle Info */}
          {vehicleData && (
            <VehicleInfo
              vin={vehicleData.vin}
              roNumber={vehicleData.roNumber}
              model={vehicleData.model}
              year={vehicleData.year}
              make={vehicleData.make}
            />
          )}

          {/* Status Timeline */}
          {statusData && (
            <StatusTimeline
              currentStage={statusData.currentStage}
              lastUpdated={statusData.lastUpdated}
            />
          )}

          {/* Message Card */}
          {statusData && (
            <MessageCard
              message={statusData.message}
              description={statusData.description}
            />
          )}

          {/* Contact Form */}
          {session && (
            <ContactForm
              roNumber={session.roNumber}
              email={session.email}
            />
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Dan&apos;s Auto Body - 147 Summit St, Suite 10, Peabody, MA 01960</p>
          <p className="mt-2">
            <a href="tel:(978)587-3341" className="text-red-600 hover:text-red-700 font-medium">
              (978) 587-3341
            </a>
            {' • '}
            <a href="mailto:info@dansautobodyma.com" className="text-red-600 hover:text-red-700 font-medium">
              info@dansautobodyma.com
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}

