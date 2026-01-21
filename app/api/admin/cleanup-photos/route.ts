import { NextRequest, NextResponse } from 'next/server';
import { getDeliveredVehiclesWithOldPhotos, clearVehiclePhoto } from '@/lib/google-sheets';
import { deleteImage, extractPublicIdFromUrl } from '@/lib/cloudinary';

/**
 * API Route: Limpeza de Fotos Antigas
 * DELETE /api/admin/cleanup-photos
 * 
 * Remove fotos de veículos entregues há mais de 7 dias
 * Pode ser chamada manualmente ou via cron job
 */
export async function DELETE(request: NextRequest) {
  try {
    // Validar sessão admin (opcional - pode ser chamada via cron também)
    const authHeader = request.headers.get('x-admin-session');
    const cronSecret = request.headers.get('x-cron-secret');
    
    // Permitir acesso via cron secret ou admin session
    if (!authHeader && cronSecret !== process.env.CRON_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Obter dias (padrão: 7)
    const daysParam = request.nextUrl.searchParams.get('days');
    const daysOld = daysParam ? parseInt(daysParam, 10) : 7;

    if (isNaN(daysOld) || daysOld < 1) {
      return NextResponse.json(
        { error: 'Invalid days parameter. Must be a positive number.' },
        { status: 400 }
      );
    }

    // Buscar veículos entregues com fotos antigas
    const vehicles = await getDeliveredVehiclesWithOldPhotos(daysOld);

    if (vehicles.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No old photos to clean up',
        deleted: 0,
        vehicles: [],
      });
    }

    const results = {
      deleted: 0,
      failed: 0,
      vehicles: [] as Array<{ roNumber: string; status: 'deleted' | 'failed'; error?: string }>,
    };

    // Deletar fotos de cada veículo
    for (const vehicle of vehicles) {
      try {
        // Extrair public_id da URL do Cloudinary
        const publicId = extractPublicIdFromUrl(vehicle.photoUrl || '');
        
        if (!publicId) {
          console.error(`Could not extract public_id from URL for RO ${vehicle.roNumber}`);
          results.failed++;
          results.vehicles.push({
            roNumber: vehicle.roNumber,
            status: 'failed',
            error: 'Could not extract public_id from URL',
          });
          continue;
        }

        // Deletar do Cloudinary
        await deleteImage(publicId);

        // Limpar do Google Sheets
        await clearVehiclePhoto(vehicle.roNumber);

        results.deleted++;
        results.vehicles.push({
          roNumber: vehicle.roNumber,
          status: 'deleted',
        });

        console.log(`Successfully deleted photo for RO ${vehicle.roNumber}`);
      } catch (error: any) {
        console.error(`Error deleting photo for RO ${vehicle.roNumber}:`, error);
        results.failed++;
        results.vehicles.push({
          roNumber: vehicle.roNumber,
          status: 'failed',
          error: error.message || 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Cleanup completed: ${results.deleted} deleted, ${results.failed} failed`,
      deleted: results.deleted,
      failed: results.failed,
      vehicles: results.vehicles,
    });
  } catch (error) {
    console.error('Error in cleanup photos:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error cleaning up photos' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint para verificar quais fotos seriam deletadas (sem deletar)
 */
export async function GET(request: NextRequest) {
  try {
    // Validar sessão admin
    const authHeader = request.headers.get('x-admin-session');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Obter dias (padrão: 7)
    const daysParam = request.nextUrl.searchParams.get('days');
    const daysOld = daysParam ? parseInt(daysParam, 10) : 7;

    if (isNaN(daysOld) || daysOld < 1) {
      return NextResponse.json(
        { error: 'Invalid days parameter. Must be a positive number.' },
        { status: 400 }
      );
    }

    // Buscar veículos entregues com fotos antigas
    const vehicles = await getDeliveredVehiclesWithOldPhotos(daysOld);

    return NextResponse.json({
      success: true,
      daysOld,
      count: vehicles.length,
      vehicles: vehicles.map((v) => ({
        roNumber: v.roNumber,
        photoDate: v.photoDate,
        photoUrl: v.photoUrl,
      })),
    });
  } catch (error) {
    console.error('Error checking old photos:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error checking old photos' },
      { status: 500 }
    );
  }
}

