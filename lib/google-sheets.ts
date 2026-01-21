/**
 * Google Sheets API Integration
 * 
 * Este módulo gerencia a conexão com o Google Sheets para buscar
 * informações de veículos e mensagens dos estágios.
 */

import { google } from 'googleapis';

const SHEETS_ID = process.env.GOOGLE_SHEETS_ID;
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
  email: string;
  vin: string;
  clientName: string;
  model: string;
  year: string;
  make?: string;
  phone?: string;
}

/**
 * Interface para mensagens dos estágios
 */
export interface StageMessage {
  stage: string;
  message: string;
  description?: string;
}

/**
 * Busca veículo por RO Number e Email
 */
export async function getVehicleByRO(
  roNumber: string,
  email: string
): Promise<VehicleData | null> {
  try {
    if (!SHEETS_ID) {
      throw new Error('GOOGLE_SHEETS_ID not configured');
    }

    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    // Buscar dados da aba "Vehicles"
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEETS_ID,
      range: 'Vehicles!A:H', // RO Number | Email | VIN | Nome | Modelo | Ano | Marca | Telefone
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return null;
    }

    // Primeira linha são os headers, pular
    const dataRows = rows.slice(1);

    // Buscar veículo correspondente
    const vehicleRow = dataRows.find((row) => {
      const rowRO = row[0]?.toString().trim();
      const rowEmail = row[1]?.toString().trim().toLowerCase();
      return (
        rowRO === roNumber.trim() &&
        rowEmail === email.trim().toLowerCase()
      );
    });

    if (!vehicleRow) {
      return null;
    }

    return {
      roNumber: vehicleRow[0] || '',
      email: vehicleRow[1] || '',
      vin: vehicleRow[2] || '',
      clientName: vehicleRow[3] || '',
      model: vehicleRow[4] || '',
      year: vehicleRow[5] || '',
      make: vehicleRow[6] || '',
      phone: vehicleRow[7] || '',
    };
  } catch (error) {
    console.error('Error fetching vehicle from Google Sheets:', error);
    throw error;
  }
}

/**
 * Busca mensagem para um estágio específico
 */
export async function getMessageForStage(
  stage: string
): Promise<StageMessage | null> {
  try {
    if (!SHEETS_ID) {
      throw new Error('GOOGLE_SHEETS_ID not configured');
    }

    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    // Buscar dados da aba "Messages"
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEETS_ID,
      range: 'Messages!A:C', // Stage | Message | Description
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return null;
    }

    // Primeira linha são os headers, pular
    const dataRows = rows.slice(1);

    // Buscar mensagem correspondente ao estágio
    const messageRow = dataRows.find((row) => {
      const rowStage = row[0]?.toString().trim().toLowerCase();
      return rowStage === stage.trim().toLowerCase();
    });

    if (!messageRow) {
      return null;
    }

    return {
      stage: messageRow[0] || '',
      message: messageRow[1] || '',
      description: messageRow[2] || '',
    };
  } catch (error) {
    console.error('Error fetching message from Google Sheets:', error);
    throw error;
  }
}

/**
 * Busca todas as mensagens de estágios (para cache)
 */
export async function getAllStageMessages(): Promise<StageMessage[]> {
  try {
    if (!SHEETS_ID) {
      throw new Error('GOOGLE_SHEETS_ID not configured');
    }

    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEETS_ID,
      range: 'Messages!A:C',
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return [];
    }

    const dataRows = rows.slice(1);

    return dataRows.map((row) => ({
      stage: row[0] || '',
      message: row[1] || '',
      description: row[2] || '',
    }));
  } catch (error) {
    console.error('Error fetching all messages from Google Sheets:', error);
    throw error;
  }
}

/**
 * Valida se as credenciais do Google Sheets estão configuradas
 */
export function validateGoogleSheetsConfig(): boolean {
  return !!(SHEETS_ID && SERVICE_ACCOUNT_EMAIL && PRIVATE_KEY);
}

