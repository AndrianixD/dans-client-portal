/**
 * Cloudinary Integration
 * 
 * Gerencia upload e gerenciamento de imagens no Cloudinary
 */

import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload de imagem para Cloudinary
 * @param fileBuffer - Buffer do arquivo de imagem
 * @param roNumber - RO Number do veículo (usado no nome do arquivo)
 * @returns URL da imagem no Cloudinary
 */
export async function uploadImage(
  fileBuffer: Buffer,
  roNumber: string,
  mimeType: string
): Promise<string> {
  try {
    // Determinar formato baseado no mime type
    const format = mimeType.split('/')[1] || 'jpg';
    
    // Sanitizar RO Number para usar no nome do arquivo
    const sanitizedRO = roNumber.replace(/[^a-zA-Z0-9]/g, '-');
    
    // Upload para Cloudinary
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'dans-auto-body/vehicles',
          public_id: `RO-${sanitizedRO}`,
          format: format,
          overwrite: true, // Substituir foto anterior
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result);
          } else {
            reject(new Error('Upload failed: no result'));
          }
        }
      );
      
      uploadStream.end(fileBuffer);
    });

    return result.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
}

/**
 * Deletar imagem do Cloudinary
 * @param publicId - Public ID da imagem no Cloudinary (ex: "dans-auto-body/vehicles/RO-4355")
 */
export async function deleteImage(publicId: string): Promise<void> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === 'not found') {
      console.log(`Image ${publicId} not found in Cloudinary (may have been already deleted)`);
    } else {
      console.log(`Successfully deleted image: ${publicId}`);
    }
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw new Error('Failed to delete image');
  }
}

/**
 * Extrai o public_id de uma URL do Cloudinary
 * @param url - URL completa do Cloudinary (ex: "https://res.cloudinary.com/.../dans-auto-body/vehicles/RO-4355.jpg")
 * @returns public_id (ex: "dans-auto-body/vehicles/RO-4355")
 */
export function extractPublicIdFromUrl(url: string): string | null {
  try {
    // Formato da URL: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
    // Exemplo: https://res.cloudinary.com/dqsgscpfx/image/upload/v1234567890/dans-auto-body/vehicles/RO-4355.jpg
    
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.(jpg|jpeg|png|webp|gif)$/i);
    if (match && match[1]) {
      return match[1]; // Retorna "dans-auto-body/vehicles/RO-4355"
    }
    
    // Tentar formato alternativo sem versão
    const altMatch = url.match(/\/upload\/(.+?)\.(jpg|jpeg|png|webp|gif)$/i);
    if (altMatch && altMatch[1]) {
      return altMatch[1];
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting public_id from URL:', error);
    return null;
  }
}

