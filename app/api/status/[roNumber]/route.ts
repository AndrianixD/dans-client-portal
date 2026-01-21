/**
 * API Route: Status do Veículo
 * GET /api/status/[roNumber]
 * 
 * Retorna o status atual e mensagem do Monday.com
 */

import { NextRequest, NextResponse } from 'next/server';
import { getVehicleStatusByRO } from '@/lib/monday';
import { getMessageForStage } from '@/lib/google-sheets';

export async function GET(
  request: NextRequest,
  { params }: { params: { roNumber: string } }
) {
  try {
    const { roNumber } = params;

    // Buscar status no Monday.com
    const mondayData = await getVehicleStatusByRO(roNumber);

    if (!mondayData) {
      return NextResponse.json(
        { error: 'Status não encontrado no Monday.com' },
        { status: 404 }
      );
    }

    // Buscar mensagem correspondente ao estágio
    const stageMessage = await getMessageForStage(mondayData.status);

    return NextResponse.json({
      currentStage: mondayData.status,
      message: stageMessage?.message || 'Seu veículo está sendo processado.',
      description: stageMessage?.description || '',
      lastUpdated: mondayData.updatedAt,
      itemId: mondayData.itemId,
      history: [], // Pode ser implementado depois com getItemWithUpdates
    });
  } catch (error) {
    console.error('Error fetching status:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar status do veículo' },
      { status: 500 }
    );
  }
}

