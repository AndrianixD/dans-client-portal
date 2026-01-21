/**
 * API Route: Verificação de Autenticação
 * POST /api/auth/verify
 * 
 * Verifica se o RO Number e Email correspondem a um veículo válido
 */

import { NextRequest, NextResponse } from 'next/server';
import { getVehicleByROAndPassword } from '@/lib/google-sheets';
import { getMockVehicle } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roNumber, password, demo } = body;

    // Validação de entrada
    if (!roNumber || !password) {
      return NextResponse.json(
        { error: 'RO Number and Password are required' },
        { status: 400 }
      );
    }

    let vehicle;

    // Modo DEMO - usar dados mock (mantém compatibilidade)
    if (demo === true) {
      // Para demo, usar email como password temporariamente
      vehicle = getMockVehicle(roNumber, password);
      
      if (!vehicle) {
        return NextResponse.json(
          { error: 'Use DEMO001/demo@cliente.com, DEMO002/maria@cliente.com or DEMO003/pedro@cliente.com' },
          { status: 401 }
        );
      }
    } else {
      // Modo REAL - usar Google Sheets com RO + Monday_Item_ID
      vehicle = await getVehicleByROAndPassword(roNumber, password);

      if (!vehicle) {
        return NextResponse.json(
          { error: 'Invalid RO Number or Password' },
          { status: 401 }
        );
      }
    }

    // Retornar dados do veículo (sem informações sensíveis)
    return NextResponse.json({
      success: true,
      demo: demo === true,
      vehicleData: {
        roNumber: vehicle.roNumber,
        clientName: vehicle.clientName,
        vin: vehicle.vin,
        model: vehicle.model,
        year: vehicle.year,
        make: vehicle.make,
        updates: vehicle.updates, // Status atual
      },
    });
  } catch (error) {
    console.error('Error in auth verify:', error);
    return NextResponse.json(
      { error: 'Error verifying credentials' },
      { status: 500 }
    );
  }
}

