/**
 * Google Sheets API Integration
 * 
 * Este módulo gerencia a conexão com o Google Sheets para buscar
 * informações de veículos e mensagens dos estágios.
 */

import { google } from 'googleapis';

const SHEETS_ID = process.env.GOOGLE_SHEETS_ID || '1f84Je0PQTn-D93YQe1RWQeAHBQ8Uosyr8N7CCcKRifw';
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

/**
 * Cliente autenticado do Google Sheets (readonly)
 */
function getAuthClient() {
  if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
    throw new Error('Google Sheets credentials not configured');
  }

  return new google.auth.JWT({
    email: SERVICE_ACCOUNT_EMAIL,
    key: PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
}

/**
 * Cliente autenticado do Google Sheets (readwrite)
 */
function getAuthClientWrite() {
  if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
    throw new Error('Google Sheets credentials not configured');
  }

  return new google.auth.JWT({
    email: SERVICE_ACCOUNT_EMAIL,
    key: PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

/**
 * Interface para dados do veículo
 */
export interface VehicleData {
  roNumber: string;
  mondayItemId: string;
  vin?: string;
  clientName?: string;
  insurance?: string;
  claim?: string;
  vehicle?: string;
  model?: string;
  year?: string;
  make?: string;
  phone?: string;
  email?: string;
  updates?: string; // Status atual
  origin?: string;
  photoUrl?: string; // URL da foto no Cloudinary
  photoDate?: string; // Data/hora ISO da foto
}

/**
 * Interface para mensagens dos estágios
 */
export interface StageMessage {
  status: string;
  message: string;
}

/**
 * Busca informações do cliente na aba customer-info usando RO Number
 * Busca as colunas: CUSTOMER, INSURANCE, CLAIM, VEHICLE, VIN
 */
async function getCustomerInfoByRO(roNumber: string): Promise<Partial<VehicleData> | null> {
  try {
    if (!SHEETS_ID) {
      return null;
    }

    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    // Buscar dados da aba "customer-info"
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEETS_ID,
      range: 'customer-info!A:Z', // Buscar todas as colunas
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return null;
    }

    // Primeira linha são os headers
    const headers = rows[0];
    const dataRows = rows.slice(1);

    // Encontrar índice da coluna RO
    const roIndex = headers.findIndex((h: string) => h?.toString().trim().toLowerCase() === 'ro');
    
    if (roIndex === -1) {
      return null;
    }

    // Buscar cliente correspondente pelo RO
    const customerRow = dataRows.find((row) => {
      const rowRO = row[roIndex]?.toString().trim();
      return rowRO === roNumber.trim();
    });

    if (!customerRow) {
      return null;
    }

    // Encontrar índices das colunas específicas que o usuário quer
    const customerIndex = headers.findIndex((h: string) => h?.toString().trim().toUpperCase() === 'CUSTOMER');
    const insuranceIndex = headers.findIndex((h: string) => h?.toString().trim().toUpperCase() === 'INSURANCE');
    const claimIndex = headers.findIndex((h: string) => h?.toString().trim().toUpperCase() === 'CLAIM');
    const vehicleIndex = headers.findIndex((h: string) => h?.toString().trim().toUpperCase() === 'VEHICLE');
    const vinIndex = headers.findIndex((h: string) => h?.toString().trim().toUpperCase() === 'VIN');
    
    // Colunas opcionais (caso existam)
    const phoneIndex = headers.findIndex((h: string) => 
      h?.toString().trim().toLowerCase().includes('phone') ||
      h?.toString().trim().toUpperCase() === 'CUSTOMER PHONE'
    );
    const emailIndex = headers.findIndex((h: string) => h?.toString().trim().toLowerCase() === 'email');

    return {
      clientName: customerIndex !== -1 ? (customerRow[customerIndex] || '') : '',
      insurance: insuranceIndex !== -1 ? (customerRow[insuranceIndex] || '') : '',
      claim: claimIndex !== -1 ? (customerRow[claimIndex] || '') : '',
      vehicle: vehicleIndex !== -1 ? (customerRow[vehicleIndex] || '') : '',
      vin: vinIndex !== -1 ? (customerRow[vinIndex] || '') : '',
      phone: phoneIndex !== -1 ? (customerRow[phoneIndex] || '') : '',
      email: emailIndex !== -1 ? (customerRow[emailIndex] || '') : '',
    };
  } catch (error) {
    console.error('Error fetching customer info from Google Sheets:', error);
    return null;
  }
}

/**
 * Busca veículo por RO Number e Monday_Item_ID (senha)
 * Combina dados de allvehiclesmonday (autenticação) com customer-info (dados do cliente)
 */
export async function getVehicleByROAndPassword(
  roNumber: string,
  mondayItemId: string
): Promise<VehicleData | null> {
  try {
    if (!SHEETS_ID) {
      throw new Error('GOOGLE_SHEETS_ID not configured');
    }

    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    // 1. Buscar dados de autenticação na aba "allvehiclesmonday"
    // Usar range maior para capturar colunas photo_url e photo_date que podem estar além de Z
    const authResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEETS_ID,
      range: 'allvehiclesmonday!A:AA', // Estendido para AA para capturar colunas adicionais
    });

    const authRows = authResponse.data.values;
    if (!authRows || authRows.length <= 1) {
      return null;
    }

    const authHeaders = authRows[0];
    const authDataRows = authRows.slice(1);

    // Encontrar índices das colunas de autenticação
    const roIndex = authHeaders.findIndex((h: string) => h?.toString().trim().toLowerCase() === 'ro');
    const mondayItemIdIndex = authHeaders.findIndex((h: string) => h?.toString().trim().toLowerCase() === 'monday_item_id');
    const updatesIndex = authHeaders.findIndex((h: string) => h?.toString().trim().toLowerCase() === 'updates');
    const originIndex = authHeaders.findIndex((h: string) => h?.toString().trim().toLowerCase() === 'origin');
    
    // Buscar colunas de foto (pode ter variações no nome)
    const photoUrlIndex = authHeaders.findIndex((h: string) => {
      const header = h?.toString().trim().toLowerCase();
      return header === 'photo_url' || header === 'photourl' || header === 'photo url';
    });
    const photoDateIndex = authHeaders.findIndex((h: string) => {
      const header = h?.toString().trim().toLowerCase();
      return header === 'photo_date' || header === 'photodate' || header === 'photo date';
    });

    // Debug: log dos headers encontrados
    if (photoUrlIndex === -1 || photoDateIndex === -1) {
      console.log('Photo columns not found. Available headers:', authHeaders);
    }

    if (roIndex === -1 || mondayItemIdIndex === -1) {
      throw new Error('Required columns (RO or Monday_Item_ID) not found in allvehiclesmonday');
    }

    // Buscar veículo correspondente para autenticação
    const vehicleRow = authDataRows.find((row) => {
      const rowRO = row[roIndex]?.toString().trim();
      const rowMondayId = row[mondayItemIdIndex]?.toString().trim();
      return (
        rowRO === roNumber.trim() &&
        rowMondayId === mondayItemId.trim()
      );
    });

    if (!vehicleRow) {
      return null; // Credenciais inválidas
    }

    // 2. Buscar informações do cliente na aba "customer-info" usando RO Number
    const customerInfo = await getCustomerInfoByRO(roNumber);

    // 3. Combinar dados de autenticação com dados do cliente
    return {
      roNumber: roNumber.trim(),
      mondayItemId: vehicleRow[mondayItemIdIndex] || '',
      updates: vehicleRow[updatesIndex] || '',
      origin: originIndex !== -1 ? (vehicleRow[originIndex] || '') : '',
      photoUrl: photoUrlIndex !== -1 ? (vehicleRow[photoUrlIndex] || '') : '',
      photoDate: photoDateIndex !== -1 ? (vehicleRow[photoDateIndex] || '') : '',
      // Dados do cliente (da aba customer-info)
      clientName: customerInfo?.clientName || '',
      insurance: customerInfo?.insurance || '',
      claim: customerInfo?.claim || '',
      vehicle: customerInfo?.vehicle || '',
      vin: customerInfo?.vin || '',
      phone: customerInfo?.phone || '',
      email: customerInfo?.email || '',
    };
  } catch (error) {
    console.error('Error fetching vehicle from Google Sheets:', error);
    throw error;
  }
}

/**
 * Busca mensagem para um status específico na aba updatelist
 * Faz mirror match: UPDATES (allvehiclesmonday) <-> STATUS (updatelist)
 * Retorna a mensagem da coluna PORTAL
 */
export async function getMessageForStatus(
  status: string
): Promise<StageMessage | null> {
  try {
    if (!SHEETS_ID) {
      throw new Error('GOOGLE_SHEETS_ID not configured');
    }

    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    // Buscar dados da aba "updatelist" - todas as colunas
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEETS_ID,
      range: 'updatelist!A:Z', // Buscar todas as colunas
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return null;
    }

    // Primeira linha são os headers
    const headers = rows[0];
    const dataRows = rows.slice(1);

    // Encontrar índices das colunas STATUS e PORTAL
    const statusIndex = headers.findIndex((h: string) => 
      h?.toString().trim().toUpperCase() === 'STATUS'
    );
    const portalIndex = headers.findIndex((h: string) => 
      h?.toString().trim().toUpperCase() === 'PORTAL'
    );

    if (statusIndex === -1) {
      console.error('Column STATUS not found in updatelist');
      return null;
    }

    if (portalIndex === -1) {
      console.error('Column PORTAL not found in updatelist');
      return null;
    }

    // Buscar mensagem correspondente ao status (mirror match)
    const messageRow = dataRows.find((row) => {
      const rowStatus = row[statusIndex]?.toString().trim().toLowerCase();
      return rowStatus === status.trim().toLowerCase();
    });

    if (!messageRow) {
      console.log(`No message found for status: "${status}"`);
      return null;
    }

    return {
      status: messageRow[statusIndex] || '',
      message: messageRow[portalIndex] || '', // Mensagem da coluna PORTAL
    };
  } catch (error) {
    console.error('Error fetching message from Google Sheets:', error);
    throw error;
  }
}

/**
 * Busca todos os veículos ativos (onde origin != "delivered")
 * Usado no admin dashboard
 */
export async function getAllActiveVehicles(): Promise<VehicleData[]> {
  try {
    if (!SHEETS_ID) {
      throw new Error('GOOGLE_SHEETS_ID not configured');
    }

    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    // Buscar dados da aba "allvehiclesmonday"
    // Usar range maior para capturar colunas photo_url e photo_date
    const authResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEETS_ID,
      range: 'allvehiclesmonday!A:AA', // Estendido para AA
    });

    const authRows = authResponse.data.values;
    if (!authRows || authRows.length <= 1) {
      return [];
    }

    const authHeaders = authRows[0];
    const authDataRows = authRows.slice(1);

    // Encontrar índices das colunas
    const roIndex = authHeaders.findIndex((h: string) => h?.toString().trim().toLowerCase() === 'ro');
    const updatesIndex = authHeaders.findIndex((h: string) => h?.toString().trim().toLowerCase() === 'updates');
    const originIndex = authHeaders.findIndex((h: string) => h?.toString().trim().toLowerCase() === 'origin');
    // Buscar colunas de foto (pode ter variações no nome)
    const photoUrlIndex = authHeaders.findIndex((h: string) => {
      const header = h?.toString().trim().toLowerCase();
      return header === 'photo_url' || header === 'photourl' || header === 'photo url';
    });
    const photoDateIndex = authHeaders.findIndex((h: string) => {
      const header = h?.toString().trim().toLowerCase();
      return header === 'photo_date' || header === 'photodate' || header === 'photo date';
    });

    if (roIndex === -1) {
      throw new Error('Column RO not found in allvehiclesmonday');
    }

    const activeVehicles: VehicleData[] = [];

    // Status que devem ser ocultados (não são veículos ativos na oficina)
    const excludedOrigins = ['delivered', 'leads'];

    // Filtrar veículos onde origin não está na lista de excluídos
    for (const row of authDataRows) {
      const origin = originIndex !== -1 ? (row[originIndex] || '').toString().trim().toLowerCase() : '';
      
      if (!excludedOrigins.includes(origin) && row[roIndex]) {
        const roNumber = row[roIndex].toString().trim();
        
        // Buscar informações do cliente
        const customerInfo = await getCustomerInfoByRO(roNumber);
        
        activeVehicles.push({
          roNumber,
          mondayItemId: '', // Não necessário para admin
          updates: updatesIndex !== -1 ? (row[updatesIndex] || '') : '',
          origin: origin || '',
          photoUrl: photoUrlIndex !== -1 ? (row[photoUrlIndex] || '') : '',
          photoDate: photoDateIndex !== -1 ? (row[photoDateIndex] || '') : '',
          clientName: customerInfo?.clientName || '',
          insurance: customerInfo?.insurance || '',
          claim: customerInfo?.claim || '',
          vehicle: customerInfo?.vehicle || '',
          vin: customerInfo?.vin || '',
          phone: customerInfo?.phone || '',
          email: customerInfo?.email || '',
        });
      }
    }

    return activeVehicles;
  } catch (error) {
    console.error('Error fetching active vehicles:', error);
    throw error;
  }
}

/**
 * Atualiza a foto de um veículo no Google Sheets
 * Adiciona/atualiza as colunas photo_url e photo_date
 */
export async function updateVehiclePhoto(
  roNumber: string,
  photoUrl: string,
  photoDate: string
): Promise<void> {
  try {
    if (!SHEETS_ID) {
      throw new Error('GOOGLE_SHEETS_ID not configured');
    }

    const auth = getAuthClientWrite();
    const sheets = google.sheets({ version: 'v4', auth });

    // Buscar dados da aba "allvehiclesmonday" para encontrar a linha
    // Usar range maior para capturar colunas photo_url e photo_date
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEETS_ID,
      range: 'allvehiclesmonday!A:AA', // Estendido para AA
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      throw new Error('No data found in allvehiclesmonday');
    }

    const headers = rows[0];
    const dataRows = rows.slice(1);

    // Encontrar índices das colunas
    const roIndex = headers.findIndex((h: string) => h?.toString().trim().toLowerCase() === 'ro');
    
    // Buscar colunas de foto (pode ter variações no nome)
    const photoUrlIndex = headers.findIndex((h: string) => {
      const header = h?.toString().trim().toLowerCase();
      return header === 'photo_url' || header === 'photourl' || header === 'photo url';
    });
    const photoDateIndex = headers.findIndex((h: string) => {
      const header = h?.toString().trim().toLowerCase();
      return header === 'photo_date' || header === 'photodate' || header === 'photo date';
    });

    if (roIndex === -1) {
      throw new Error('Column RO not found');
    }

    // Encontrar a linha do veículo
    const vehicleRowIndex = dataRows.findIndex((row) => {
      const rowRO = row[roIndex]?.toString().trim();
      return rowRO === roNumber.trim();
    });

    if (vehicleRowIndex === -1) {
      throw new Error(`Vehicle with RO ${roNumber} not found`);
    }

    // A linha real no sheet é vehicleRowIndex + 2 (header + 1-indexed)
    const sheetRowIndex = vehicleRowIndex + 2;

    // Se as colunas não existem, precisamos adicioná-las primeiro
    if (photoUrlIndex === -1 || photoDateIndex === -1) {
      // Adicionar colunas se não existirem
      const lastColumn = String.fromCharCode(65 + headers.length - 1); // Última coluna
      const nextColumn1 = String.fromCharCode(65 + headers.length); // Próxima coluna
      const nextColumn2 = String.fromCharCode(66 + headers.length); // Próxima coluna + 1

      // Adicionar headers
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEETS_ID,
        range: `allvehiclesmonday!${nextColumn1}1:${nextColumn2}1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [['photo_url', 'photo_date']],
        },
      });

      // Buscar novamente para obter os novos índices
      const newResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEETS_ID,
        range: 'allvehiclesmonday!A:AA', // Estendido para AA
      });

      const newHeaders = newResponse.data.values?.[0] || [];
      const newPhotoUrlIndex = newHeaders.findIndex((h: string) => h?.toString().trim().toLowerCase() === 'photo_url');
      const newPhotoDateIndex = newHeaders.findIndex((h: string) => h?.toString().trim().toLowerCase() === 'photo_date');

      // Atualizar valores
      const photoUrlCol = String.fromCharCode(65 + newPhotoUrlIndex);
      const photoDateCol = String.fromCharCode(65 + newPhotoDateIndex);

      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: SHEETS_ID,
        requestBody: {
          valueInputOption: 'RAW',
          data: [
            {
              range: `allvehiclesmonday!${photoUrlCol}${sheetRowIndex}`,
              values: [[photoUrl]],
            },
            {
              range: `allvehiclesmonday!${photoDateCol}${sheetRowIndex}`,
              values: [[photoDate]],
            },
          ],
        },
      });
    } else {
      // Colunas já existem, apenas atualizar valores
      const photoUrlCol = String.fromCharCode(65 + photoUrlIndex);
      const photoDateCol = String.fromCharCode(65 + photoDateIndex);

      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: SHEETS_ID,
        requestBody: {
          valueInputOption: 'RAW',
          data: [
            {
              range: `allvehiclesmonday!${photoUrlCol}${sheetRowIndex}`,
              values: [[photoUrl]],
            },
            {
              range: `allvehiclesmonday!${photoDateCol}${sheetRowIndex}`,
              values: [[photoDate]],
            },
          ],
        },
      });
    }
  } catch (error) {
    console.error('Error updating vehicle photo:', error);
    throw error;
  }
}

/**
 * Busca veículos entregues (delivered) com fotos antigas (mais de 7 dias)
 * Usado para limpeza automática de fotos
 */
export async function getDeliveredVehiclesWithOldPhotos(daysOld: number = 7): Promise<VehicleData[]> {
  try {
    if (!SHEETS_ID) {
      throw new Error('GOOGLE_SHEETS_ID not configured');
    }

    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    // Buscar dados da aba "allvehiclesmonday"
    const authResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEETS_ID,
      range: 'allvehiclesmonday!A:AA',
    });

    const authRows = authResponse.data.values;
    if (!authRows || authRows.length <= 1) {
      return [];
    }

    const authHeaders = authRows[0];
    const authDataRows = authRows.slice(1);

    // Encontrar índices das colunas
    const roIndex = authHeaders.findIndex((h: string) => h?.toString().trim().toLowerCase() === 'ro');
    const originIndex = authHeaders.findIndex((h: string) => h?.toString().trim().toLowerCase() === 'origin');
    const photoUrlIndex = authHeaders.findIndex((h: string) => {
      const header = h?.toString().trim().toLowerCase();
      return header === 'photo_url' || header === 'photourl' || header === 'photo url';
    });
    const photoDateIndex = authHeaders.findIndex((h: string) => {
      const header = h?.toString().trim().toLowerCase();
      return header === 'photo_date' || header === 'photodate' || header === 'photo date';
    });

    if (roIndex === -1) {
      throw new Error('Column RO not found in allvehiclesmonday');
    }

    const oldPhotoVehicles: VehicleData[] = [];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    // Filtrar veículos entregues com fotos antigas
    for (const row of authDataRows) {
      const origin = originIndex !== -1 ? (row[originIndex] || '').toString().trim().toLowerCase() : '';
      const photoUrl = photoUrlIndex !== -1 ? (row[photoUrlIndex] || '') : '';
      const photoDate = photoDateIndex !== -1 ? (row[photoDateIndex] || '') : '';

      // Verificar se é entregue e tem foto
      if (origin === 'delivered' && photoUrl && photoDate) {
        try {
          const photoDateObj = new Date(photoDate);
          
          // Se a foto é mais antiga que o cutoff date
          if (photoDateObj < cutoffDate) {
            const roNumber = row[roIndex]?.toString().trim();
            if (roNumber) {
              oldPhotoVehicles.push({
                roNumber,
                mondayItemId: '',
                origin: origin,
                photoUrl: photoUrl.toString(),
                photoDate: photoDate.toString(),
              });
            }
          }
        } catch (error) {
          console.error(`Error parsing photo date for RO ${row[roIndex]}:`, error);
        }
      }
    }

    return oldPhotoVehicles;
  } catch (error) {
    console.error('Error fetching delivered vehicles with old photos:', error);
    throw error;
  }
}

/**
 * Remove foto de um veículo do Google Sheets (limpa photo_url e photo_date)
 */
export async function clearVehiclePhoto(roNumber: string): Promise<void> {
  try {
    if (!SHEETS_ID) {
      throw new Error('GOOGLE_SHEETS_ID not configured');
    }

    const auth = getAuthClientWrite();
    const sheets = google.sheets({ version: 'v4', auth });

    // Buscar dados da aba "allvehiclesmonday"
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEETS_ID,
      range: 'allvehiclesmonday!A:AA',
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      throw new Error('No data found in allvehiclesmonday');
    }

    const headers = rows[0];
    const dataRows = rows.slice(1);

    // Encontrar índices das colunas
    const roIndex = headers.findIndex((h: string) => h?.toString().trim().toLowerCase() === 'ro');
    const photoUrlIndex = headers.findIndex((h: string) => {
      const header = h?.toString().trim().toLowerCase();
      return header === 'photo_url' || header === 'photourl' || header === 'photo url';
    });
    const photoDateIndex = headers.findIndex((h: string) => {
      const header = h?.toString().trim().toLowerCase();
      return header === 'photo_date' || header === 'photodate' || header === 'photo date';
    });

    if (roIndex === -1) {
      throw new Error('Column RO not found');
    }

    if (photoUrlIndex === -1 || photoDateIndex === -1) {
      // Colunas não existem, não há nada para limpar
      return;
    }

    // Encontrar a linha do veículo
    const vehicleRowIndex = dataRows.findIndex((row) => {
      const rowRO = row[roIndex]?.toString().trim();
      return rowRO === roNumber.trim();
    });

    if (vehicleRowIndex === -1) {
      throw new Error(`Vehicle with RO ${roNumber} not found`);
    }

    // A linha real no sheet é vehicleRowIndex + 2
    const sheetRowIndex = vehicleRowIndex + 2;
    const photoUrlCol = String.fromCharCode(65 + photoUrlIndex);
    const photoDateCol = String.fromCharCode(65 + photoDateIndex);

    // Limpar valores (deixar vazio)
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SHEETS_ID,
      requestBody: {
        valueInputOption: 'RAW',
        data: [
          {
            range: `allvehiclesmonday!${photoUrlCol}${sheetRowIndex}`,
            values: [['']],
          },
          {
            range: `allvehiclesmonday!${photoDateCol}${sheetRowIndex}`,
            values: [['']],
          },
        ],
      },
    });
  } catch (error) {
    console.error('Error clearing vehicle photo:', error);
    throw error;
  }
}

/**
 * Valida se as credenciais do Google Sheets estão configuradas
 */
export function validateGoogleSheetsConfig(): boolean {
  return !!(SHEETS_ID && SERVICE_ACCOUNT_EMAIL && PRIVATE_KEY);
}

