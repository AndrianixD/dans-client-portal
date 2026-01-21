'use client';

import { Car, User, FileText, Shield } from 'lucide-react';

interface VehicleInfoProps {
  vin?: string;
  roNumber: string;
  vehicle?: string;
  model?: string;
  year?: string;
  make?: string;
  clientName?: string;
  insurance?: string;
  claim?: string;
}

export default function VehicleInfo({ 
  vin, 
  roNumber, 
  vehicle, 
  model, 
  year, 
  make, 
  clientName,
  insurance,
  claim 
}: VehicleInfoProps) {
  // Build vehicle description
  const vehicleDesc = vehicle || (year || make || model ? `${year || ''} ${make || ''} ${model || ''}`.trim() : null);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
      {/* Header with customer name */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Customer</p>
            <p className="text-gray-900 font-bold">{clientName || 'N/A'}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">RO #</p>
          <p className="text-red-600 font-bold text-lg">{roNumber}</p>
        </div>
      </div>

      {/* Vehicle description */}
      {vehicleDesc && (
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-red-50 rounded-lg">
            <Car className="w-4 h-4 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Vehicle</p>
            <p className="text-gray-900 font-medium text-sm leading-snug">{vehicleDesc}</p>
          </div>
        </div>
      )}

      {/* Grid: VIN, Insurance, Claim */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        {vin && (
          <div className="col-span-2 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
            <span className="text-[10px] font-semibold text-gray-400 uppercase">VIN:</span>
            <span className="font-mono text-xs text-gray-700 truncate">{vin}</span>
          </div>
        )}
        
        {insurance && (
          <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2">
            <Shield className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            <span className="text-xs text-gray-700 truncate" title={insurance}>{insurance}</span>
          </div>
        )}
        
        {claim && (
          <div className="flex items-center gap-2 bg-amber-50 rounded-lg px-3 py-2">
            <FileText className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <span className="text-xs text-gray-700 font-mono">{claim}</span>
          </div>
        )}
      </div>
    </div>
  );
}
