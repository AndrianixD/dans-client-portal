/**
 * API Route: Envio de Mensagens
 * POST /api/messages/send
 * 
 * Envia mensagem do cliente para a oficina via email
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendClientMessage } from '@/lib/email';
import { getVehicleByROAndPassword } from '@/lib/google-sheets';
import { getMockVehicle, mockSendMessage } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roNumber, password, message, demo } = body;

    // Validação
    if (!roNumber || !password || !message) {
      return NextResponse.json(
        { error: 'RO Number, Password and Message are required' },
        { status: 400 }
      );
    }

    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters' },
        { status: 400 }
      );
    }

    if (demo === true) {
      // Modo DEMO - simular envio
      await mockSendMessage();
      
      return NextResponse.json({
        success: true,
        message: 'Message sent successfully (demo mode)',
        demo: true,
      });
    }

    // Modo REAL - Buscar dados do veículo
    const vehicle = await getVehicleByROAndPassword(roNumber, password);

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Invalid RO Number or Password' },
        { status: 401 }
      );
    }

    // Enviar email para a oficina
    await sendClientMessage({
      clientName: vehicle.clientName || 'Client',
      clientEmail: vehicle.email || 'no-email@example.com',
      roNumber: vehicle.roNumber,
      vin: vehicle.vin || 'N/A',
      message: message.trim(),
    });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Error sending message' },
      { status: 500 }
    );
  }
}

