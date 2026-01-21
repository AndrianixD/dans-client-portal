/**
 * API Route: Verificação de Autenticação
 * POST /api/auth/verify
 * 
 * Verifica se o RO Number e Email correspondem a um veículo válido
 */

import { NextRequest, NextResponse } from 'next/server';
import { getVehicleByROAndPassword } from '@/lib/google-sheets';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'dansauto2026';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Rocket2025!';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validação de entrada
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and Password are required' },
        { status: 400 }
      );
    }

    // Verificar se é login admin primeiro
    if (username.trim() === ADMIN_USERNAME && password.trim() === ADMIN_PASSWORD) {
      return NextResponse.json({
        success: true,
        isAdmin: true,
        message: 'Admin authentication successful',
      });
    }

    // Se não for admin, tratar como login de cliente (RO Number + Password)
    const vehicle = await getVehicleByROAndPassword(username.trim(), password.trim());

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (vehicle.origin?.toString().trim().toLowerCase() === 'delivered') {
      return NextResponse.json(
        { error: 'Access closed: the repair has been completed.' },
        { status: 403 }
      );
    }

    // Retornar dados do veículo (sem informações sensíveis)
    return NextResponse.json({
      success: true,
      isAdmin: false,
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

