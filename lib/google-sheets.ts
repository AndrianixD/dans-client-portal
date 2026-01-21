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
 * Cliente autenticado do Google Sheets
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
    const authResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEETS_ID,
      range: 'allvehiclesmonday!A:Z',
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
 * Valida se as credenciais do Google Sheets estão configuradas
 */
export function validateGoogleSheetsConfig(): boolean {
  return !!(SHEETS_ID && SERVICE_ACCOUNT_EMAIL && PRIVATE_KEY);
}

