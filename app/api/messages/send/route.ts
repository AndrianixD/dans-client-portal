/**
 * API Route: Envio de Mensagens
 * POST /api/messages/send
 * 
 * Envia mensagem do cliente para a oficina via email
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendClientMessage } from '@/lib/email';
import { getVehicleByRO } from '@/lib/google-sheets';
import { getVehicleStatusByRO, createClientMessage } from '@/lib/monday';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roNumber, email, message } = body;

    // Validação
    if (!roNumber || !email || !message) {
      return NextResponse.json(
        { error: 'RO Number, Email e Mensagem são obrigatórios' },
        { status: 400 }
      );
    }

    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: 'Mensagem deve ter pelo menos 10 caracteres' },
        { status: 400 }
      );
    }

    // Buscar dados do veículo
    const vehicle = await getVehicleByRO(roNumber, email);

    if (!vehicle) {
      return NextResponse.json(
        { error: 'RO Number ou Email inválidos' },
        { status: 401 }
      );
    }

    // Enviar email para a oficina
    await sendClientMessage({
      clientName: vehicle.clientName,
      clientEmail: vehicle.email,
      roNumber: vehicle.roNumber,
      vin: vehicle.vin,
      message: message.trim(),
    });

    // Tentar adicionar update no Monday.com (opcional, não falha se der erro)
    try {
      const mondayData = await getVehicleStatusByRO(roNumber);
      if (mondayData?.itemId) {
        await createClientMessage(mondayData.itemId, message.trim(), {
          name: vehicle.clientName,
          email: vehicle.email,
          roNumber: vehicle.roNumber,
        });
      }
    } catch (mondayError) {
      console.warn('Could not add update to Monday.com:', mondayError);
      // Continua mesmo se falhar
    }

    return NextResponse.json({
      success: true,
      message: 'Mensagem enviada com sucesso',
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem' },
      { status: 500 }
    );
  }
}

