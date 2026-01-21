import { NextRequest, NextResponse } from 'next/server';
import { getVehicleByROAndPassword, getMessageForStatus } from '@/lib/google-sheets';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roNumber: string }> }
) {
  try {
    const { roNumber } = await params;
    const password = request.nextUrl.searchParams.get('password');

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Modo REAL - buscar no Google Sheets
    const vehicle = await getVehicleByROAndPassword(roNumber, password);

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    // Buscar mensagem correspondente ao status na coluna "updates"
    const status = vehicle.updates || '';
    const statusMessage = await getMessageForStatus(status);

    return NextResponse.json({
      currentStage: status || 'Processing',
      message: statusMessage?.message || 'Your vehicle is being processed.',
      description: '',
      lastUpdated: new Date().toISOString(), // Pode ser ajustado se tiver coluna de data
    });
  } catch (error) {
    console.error('Error fetching status:', error);
    return NextResponse.json(
      { error: 'Error fetching vehicle status' },
      { status: 500 }
    );
  }
}
