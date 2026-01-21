import { NextRequest, NextResponse } from 'next/server';
import { updateVehiclePhoto } from '@/lib/google-sheets';
import { uploadImage } from '@/lib/cloudinary';

/**
 * Valida tipo de arquivo
 */
function isValidImageType(mimeType: string): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return validTypes.includes(mimeType.toLowerCase());
}

/**
 * Valida tamanho do arquivo (máximo 5MB)
 */
function isValidFileSize(size: number): boolean {
  const maxSize = 5 * 1024 * 1024; // 5MB
  return size <= maxSize;
}

export async function POST(request: NextRequest) {
  try {
    // Validar sessão admin
    const authHeader = request.headers.get('x-admin-session');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Obter FormData
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const roNumber = formData.get('roNumber') as string | null;

    // Validações
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!roNumber) {
      return NextResponse.json(
        { error: 'RO Number is required' },
        { status: 400 }
      );
    }

    // Validar tipo de arquivo
    if (!isValidImageType(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validar tamanho
    if (!isValidFileSize(file.size)) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Converter File para Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload para Cloudinary
    const photoUrl = await uploadImage(buffer, roNumber, file.type);

    // Salvar URL e data no Google Sheets
    const photoDate = new Date().toISOString();
    await updateVehiclePhoto(roNumber, photoUrl, photoDate);

    return NextResponse.json({
      success: true,
      photoUrl,
      photoDate,
      message: 'Photo uploaded successfully',
    });
  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error uploading photo' },
      { status: 500 }
    );
  }
}

