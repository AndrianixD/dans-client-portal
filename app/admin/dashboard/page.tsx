'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LogOut, Upload, Camera, Calendar, X, CheckCircle, Loader, Search, RefreshCw } from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface Vehicle {
  roNumber: string;
  clientName?: string;
  vehicle?: string;
  updates?: string;
  photoUrl?: string;
  photoDate?: string;
}

interface QueuedPhoto {
  roNumber: string;
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export default function AdminDashboardPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [photoQueue, setPhotoQueue] = useState<QueuedPhoto[]>([]);
  const [isUploadingAll, setIsUploadingAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const router = useRouter();

  // Filtrar e ordenar veículos (maior RO para menor)
  const filteredAndSortedVehicles = useMemo(() => {
    let filtered = vehicles;
    
    // Filtrar por busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = vehicles.filter(v => 
        v.roNumber.toLowerCase().includes(query) ||
        v.clientName?.toLowerCase().includes(query) ||
        v.vehicle?.toLowerCase().includes(query)
      );
    }
    
    // Ordenar do maior RO para o menor
    return [...filtered].sort((a, b) => {
      const roA = parseInt(a.roNumber) || 0;
      const roB = parseInt(b.roNumber) || 0;
      return roB - roA; // Maior para menor
    });
  }, [vehicles, searchQuery]);

  useEffect(() => {
    // Verificar sessão admin
    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession) {
      router.push('/admin/login');
      return;
    }

    loadVehicles();
  }, [router]);

  // Cleanup: revogar URLs de preview quando componente desmontar ou fila mudar
  useEffect(() => {
    return () => {
      photoQueue.forEach((p) => {
        if (p.preview) {
          URL.revokeObjectURL(p.preview);
        }
      });
    };
  }, []);

  const loadVehicles = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      setError('');

      const adminSession = localStorage.getItem('adminSession');
      if (!adminSession) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch('/api/admin/vehicles', {
        headers: {
          'x-admin-session': 'true',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to load vehicles');
      }

      const data = await response.json();
      setVehicles(data.vehicles || []);
      setLastRefresh(new Date());
    } catch (err: any) {
      console.error('Error loading vehicles:', err);
      setError(err.message || 'Error loading vehicles');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadVehicles(true);
  };

  const formatLastRefresh = () => {
    if (!lastRefresh) return '';
    const now = new Date();
    const diffMs = now.getTime() - lastRefresh.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    
    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    return lastRefresh.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleFileSelect = async (roNumber: string, file: File | null) => {
    if (!file) return;

    try {
      // Validar tipo de arquivo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type.toLowerCase())) {
        setError('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
        return;
      }

      // Validar tamanho (máximo 5MB antes da compressão)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setError('File too large. Maximum size is 5MB.');
        return;
      }

      // Criar preview
      const preview = URL.createObjectURL(file);

      // Adicionar à fila
      setPhotoQueue((prev) => {
        // Remover foto anterior do mesmo veículo se existir
        const filtered = prev.filter((p) => p.roNumber !== roNumber);
        return [
          ...filtered,
          {
            roNumber,
            file,
            preview,
            status: 'pending' as const,
          },
        ];
      });

      setError('');
    } catch (err: any) {
      console.error('Error adding photo to queue:', err);
      setError(err.message || 'Error adding photo to queue');
    }
  };

  const removeFromQueue = (roNumber: string) => {
    setPhotoQueue((prev) => {
      const item = prev.find((p) => p.roNumber === roNumber);
      if (item) {
        URL.revokeObjectURL(item.preview);
      }
      return prev.filter((p) => p.roNumber !== roNumber);
    });
  };

  const uploadAllPhotos = async () => {
    if (photoQueue.length === 0 || isUploadingAll) return;

    setIsUploadingAll(true);
    setError('');

    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession) {
      router.push('/admin/login');
      return;
    }

    // Atualizar status para uploading
    setPhotoQueue((prev) =>
      prev.map((p) => ({ ...p, status: 'uploading' as const }))
    );

    // Upload paralelo de todas as fotos
    const uploadPromises = photoQueue.map(async (queuedPhoto) => {
      try {
        // Comprimir imagem antes do upload
        const options = {
          maxSizeMB: 1, // Máximo 1MB após compressão
          maxWidthOrHeight: 1920, // Máximo 1920px
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(queuedPhoto.file, options);

        const formData = new FormData();
        formData.append('file', compressedFile);
        formData.append('roNumber', queuedPhoto.roNumber);

        const response = await fetch('/api/admin/upload-photo', {
          method: 'POST',
          headers: {
            'x-admin-session': 'true',
          },
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Upload failed');
        }

        // Atualizar status para success
        setPhotoQueue((prev) =>
          prev.map((p) =>
            p.roNumber === queuedPhoto.roNumber
              ? { ...p, status: 'success' as const }
              : p
          )
        );

        return { success: true, roNumber: queuedPhoto.roNumber };
      } catch (err: any) {
        // Atualizar status para error
        setPhotoQueue((prev) =>
          prev.map((p) =>
            p.roNumber === queuedPhoto.roNumber
              ? {
                  ...p,
                  status: 'error' as const,
                  error: err.message || 'Upload failed',
                }
              : p
          )
        );
        return { success: false, roNumber: queuedPhoto.roNumber, error: err.message };
      }
    });

    // Aguardar todos os uploads
    await Promise.all(uploadPromises);

    // Limpar fila após 2 segundos (para mostrar status de sucesso)
    setTimeout(() => {
      // Revogar URLs de preview
      photoQueue.forEach((p) => URL.revokeObjectURL(p.preview));
      setPhotoQueue([]);
      // Recarregar lista de veículos
      loadVehicles();
    }, 2000);

    setIsUploadingAll(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    router.push('/admin/login');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No photo';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const isPhotoFromToday = (photoDate?: string): boolean => {
    if (!photoDate) return false;
    try {
      const photoDateObj = new Date(photoDate);
      const today = new Date();
      
      // Comparar apenas data (sem hora)
      return (
        photoDateObj.getFullYear() === today.getFullYear() &&
        photoDateObj.getMonth() === today.getMonth() &&
        photoDateObj.getDate() === today.getDate()
      );
    } catch {
      return false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1f2e] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading vehicles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1f2e]">
      {/* Header */}
      <header className="bg-[#242938] border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Dan's Auto Body"
              width={120}
              height={48}
              className="h-8 w-auto"
            />
            <div>
              <h1 className="text-white font-bold text-lg">Admin Portal</h1>
              <p className="text-gray-400 text-xs">Vehicle Photo Management</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Active Vehicles</h2>
                <p className="text-gray-400">
                  {filteredAndSortedVehicles.length} of {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} in shop
                  {searchQuery && ` (filtered)`}
                </p>
              </div>
              
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-[#242938] hover:bg-[#2d3548] border border-gray-700 text-white rounded-lg transition font-medium disabled:opacity-50"
                title="Refresh vehicle list"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              
              {lastRefresh && (
                <span className="text-gray-500 text-xs hidden md:block">
                  Updated {formatLastRefresh()}
                </span>
              )}
            </div>
            
            {/* Search Box */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by RO, client name, or vehicle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#242938] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Photo Queue */}
        {photoQueue.length > 0 && (
          <div className="mb-6 bg-[#242938] rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold text-lg">
                  Photo Queue ({photoQueue.length})
                </h3>
                <p className="text-gray-400 text-sm">
                  {photoQueue.filter((p) => p.status === 'pending').length} ready to upload
                </p>
              </div>
              <button
                onClick={uploadAllPhotos}
                disabled={isUploadingAll || photoQueue.every((p) => p.status !== 'pending')}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition font-medium"
              >
                {isUploadingAll ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload All ({photoQueue.filter((p) => p.status === 'pending').length})</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {photoQueue.map((queuedPhoto) => {
                const vehicle = vehicles.find((v) => v.roNumber === queuedPhoto.roNumber);
                return (
                  <div
                    key={queuedPhoto.roNumber}
                    className="relative bg-[#1a1f2e] rounded-lg overflow-hidden border-2 border-gray-700"
                  >
                    <div className="aspect-video relative">
                      <Image
                        src={queuedPhoto.preview}
                        alt={`RO ${queuedPhoto.roNumber}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                      />
                      {queuedPhoto.status === 'success' && (
                        <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                          <CheckCircle className="w-8 h-8 text-green-400" />
                        </div>
                      )}
                      {queuedPhoto.status === 'error' && (
                        <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                          <X className="w-8 h-8 text-red-400" />
                        </div>
                      )}
                      {queuedPhoto.status === 'uploading' && (
                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                          <Loader className="w-8 h-8 text-blue-400 animate-spin" />
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <p className="text-white text-xs font-semibold">
                        RO #{queuedPhoto.roNumber}
                      </p>
                      {vehicle?.clientName && (
                        <p className="text-gray-400 text-xs truncate">
                          {vehicle.clientName}
                        </p>
                      )}
                      {queuedPhoto.status === 'error' && queuedPhoto.error && (
                        <p className="text-red-400 text-xs mt-1 truncate">
                          {queuedPhoto.error}
                        </p>
                      )}
                    </div>
                    {queuedPhoto.status === 'pending' && (
                      <button
                        onClick={() => removeFromQueue(queuedPhoto.roNumber)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedVehicles.map((vehicle) => (
            <div
              key={vehicle.roNumber}
              className="bg-[#242938] rounded-xl p-6 border border-gray-700/50"
            >
              {/* Vehicle Info */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      isPhotoFromToday(vehicle.photoDate)
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    RO #{vehicle.roNumber}
                  </span>
                  {vehicle.updates && (
                    <span className="text-gray-400 text-xs">{vehicle.updates}</span>
                  )}
                </div>
                {vehicle.clientName && (
                  <h3 className="text-white font-semibold text-lg mb-1">
                    {vehicle.clientName}
                  </h3>
                )}
                {vehicle.vehicle && (
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {vehicle.vehicle}
                  </p>
                )}
              </div>

              {/* Current Photo */}
              <div className="mb-4">
                {vehicle.photoUrl ? (
                  <div className="relative aspect-video bg-[#1a1f2e] rounded-lg overflow-hidden mb-2">
                    <Image
                      src={vehicle.photoUrl}
                      alt={`Vehicle RO ${vehicle.roNumber}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-[#1a1f2e] rounded-lg flex items-center justify-center mb-2">
                    <Camera className="w-12 h-12 text-gray-600" />
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(vehicle.photoDate)}</span>
                </div>
              </div>

              {/* Upload Button */}
              <label className="block">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file) {
                      handleFileSelect(vehicle.roNumber, file);
                    }
                    // Reset input para permitir selecionar o mesmo arquivo novamente
                    e.target.value = '';
                  }}
                  disabled={isUploadingAll}
                />
                <div
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition font-medium cursor-pointer ${
                    isUploadingAll
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : photoQueue.some((p) => p.roNumber === vehicle.roNumber)
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {photoQueue.some((p) => p.roNumber === vehicle.roNumber) ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>In Queue</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4" />
                      <span>Take Photo</span>
                    </>
                  )}
                </div>
              </label>
            </div>
          ))}
        </div>

        {filteredAndSortedVehicles.length === 0 && !loading && (
          <div className="text-center py-12">
            {searchQuery ? (
              <div>
                <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No vehicles found for "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-red-500 hover:text-red-400 font-medium"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <p className="text-gray-400">No active vehicles found</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

