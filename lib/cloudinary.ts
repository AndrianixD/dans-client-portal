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
 * Deletar imagem do Cloudinary (opcional)
 * @param publicId - Public ID da imagem no Cloudinary
 */
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw new Error('Failed to delete image');
  }
}

