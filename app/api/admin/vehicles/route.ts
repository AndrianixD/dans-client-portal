import { NextRequest, NextResponse } from 'next/server';
import { getAllActiveVehicles } from '@/lib/google-sheets';

/**
 * Verifica se a requisição tem sessão admin válida
 */
function validateAdminSession(request: NextRequest): boolean {
  // Em produção, usar cookies ou JWT
  // Por enquanto, vamos validar via header
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return false;
  }

  // Verificar se há sessão admin no header (será enviado pelo frontend)
  // Por enquanto, aceitar qualquer header - validação será feita no frontend também
  return true;
}

export async function GET(request: NextRequest) {
  try {
    // Validar sessão admin (simplificado por enquanto)
    // Em produção, usar middleware de autenticação
    const authHeader = request.headers.get('x-admin-session');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const vehicles = await getAllActiveVehicles();

    return NextResponse.json({
      success: true,
      vehicles,
      count: vehicles.length,
    });
  } catch (error) {
    console.error('Error fetching admin vehicles:', error);
    return NextResponse.json(
      { error: 'Error fetching vehicles' },
      { status: 500 }
    );
  }
}

