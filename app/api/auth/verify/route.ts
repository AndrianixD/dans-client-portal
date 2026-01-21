/**
 * API Route: Verificação de Autenticação
 * POST /api/auth/verify
 * 
 * Verifica se o RO Number e Email correspondem a um veículo válido
 */

import { NextRequest, NextResponse } from 'next/server';
import { getVehicleByRO } from '@/lib/google-sheets';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roNumber, email } = body;

    // Validação de entrada
    if (!roNumber || !email) {
      return NextResponse.json(
        { error: 'RO Number e Email são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar veículo no Google Sheets
    const vehicle = await getVehicleByRO(roNumber, email);

    if (!vehicle) {
      return NextResponse.json(
        { error: 'RO Number ou Email inválidos' },
        { status: 401 }
      );
    }

    // Retornar dados do veículo (sem informações sensíveis)
    return NextResponse.json({
      success: true,
      vehicleData: {
        roNumber: vehicle.roNumber,
        clientName: vehicle.clientName,
        vin: vehicle.vin,
        model: vehicle.model,
        year: vehicle.year,
        make: vehicle.make,
      },
    });
  } catch (error) {
    console.error('Error in auth verify:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar credenciais' },
      { status: 500 }
    );
  }
}

