/**
 * Tipos TypeScript para Monday.com
 */

export interface MondayColumnValue {
  id: string;
  text: string;
  value: string;
  type?: string;
}

export interface MondayItem {
  id: string;
  name: string;
  column_values: MondayColumnValue[];
  created_at: string;
  updated_at: string;
  board?: {
    id: string;
    name: string;
  };
}

export interface ServiceStatus {
  id: string;
  vehicleInfo: string;
  status: string;
  estimatedCompletion: string;
  photos: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

