/**
 * API Route: Informações do Veículo
 * GET /api/vehicle/[roNumber]
 * 
 * Retorna informações do veículo pelo RO Number
 */

import { NextRequest, NextResponse } from 'next/server';
import { getVehicleByROAndPassword } from '@/lib/google-sheets';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roNumber: string }> }
) {
  try {
    const { roNumber } = await params;

    // Obter password dos query params
    const password = request.nextUrl.searchParams.get('password');

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Modo REAL - usar Google Sheets
    const vehicle = await getVehicleByROAndPassword(roNumber, password);

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      vin: vehicle.vin,
      model: vehicle.model,
      year: vehicle.year,
      make: vehicle.make,
      clientName: vehicle.clientName,
      roNumber: vehicle.roNumber,
      phone: vehicle.phone,
      email: vehicle.email,
      updates: vehicle.updates,
      // Novos campos da customer-info
      vehicle: vehicle.vehicle,
      insurance: vehicle.insurance,
      claim: vehicle.claim,
    });
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return NextResponse.json(
      { error: 'Error fetching vehicle information' },
      { status: 500 }
    );
  }
}

