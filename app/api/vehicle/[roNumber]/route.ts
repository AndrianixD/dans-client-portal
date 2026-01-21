/**
 * API Route: Informações do Veículo
 * GET /api/vehicle/[roNumber]
 * 
 * Retorna informações do veículo pelo RO Number
 */

import { NextRequest, NextResponse } from 'next/server';
import { getVehicleByROAndPassword } from '@/lib/google-sheets';
import { getMockVehicle } from '@/lib/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roNumber: string }> }
) {
  try {
    const { roNumber } = await params;

    // Obter password e modo demo dos query params
    const password = request.nextUrl.searchParams.get('password');
    const demo = request.nextUrl.searchParams.get('demo') === 'true';

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    let vehicle;

    // Modo DEMO - usar dados mock
    if (demo) {
      vehicle = getMockVehicle(roNumber, password);
    } else {
      // Modo REAL - usar Google Sheets
      vehicle = await getVehicleByROAndPassword(roNumber, password);
    }

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

