'use client';

import { Car } from 'lucide-react';

interface VehicleInfoProps {
  vin: string;
  roNumber: string;
  model: string;
  year: string;
  make?: string;
}

export default function VehicleInfo({ vin, roNumber, model, year, make }: VehicleInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-600">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-red-50 rounded-lg">
          <Car className="w-6 h-6 text-red-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Informações do Veículo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">RO Number</p>
              <p className="text-gray-900 font-semibold">{roNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">VIN</p>
              <p className="text-gray-900 font-semibold break-all">{vin}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Veículo</p>
              <p className="text-gray-900 font-semibold">
                {year} {make || ''} {model}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

