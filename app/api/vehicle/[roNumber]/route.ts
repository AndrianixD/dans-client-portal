/**
 * API Route: Informações do Veículo
 * GET /api/vehicle/[roNumber]
 * 
 * Retorna informações do veículo pelo RO Number
 */

import { NextRequest, NextResponse } from 'next/server';
import { getVehicleByRO } from '@/lib/google-sheets';

export async function GET(
  request: NextRequest,
  { params }: { params: { roNumber: string } }
) {
  try {
    const { roNumber } = params;

    // Obter email dos query params ou headers (sessão)
    const email = request.nextUrl.searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar veículo
    const vehicle = await getVehicleByRO(roNumber, email);

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Veículo não encontrado' },
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
    });
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar informações do veículo' },
      { status: 500 }
    );
  }
}

