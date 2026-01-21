/**
 * Monday.com API Integration
 * 
 * Documentação: https://developer.monday.com/api-reference/docs
 */

const MONDAY_API_URL = 'https://api.monday.com/v2';

interface MondayQueryOptions {
  query: string;
  variables?: Record<string, any>;
}

/**
 * Faz query na API do Monday.com
 */
export async function mondayQuery({ query, variables = {} }: MondayQueryOptions) {
  const apiToken = process.env.MONDAY_API_TOKEN;
  
  if (!apiToken) {
    throw new Error('MONDAY_API_TOKEN not configured');
  }

  const response = await fetch(MONDAY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': apiToken,
      'API-Version': '2024-01',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`Monday.com API error: ${response.status}`);
  }

  const data = await response.json();

  if (data.errors) {
    console.error('Monday.com GraphQL errors:', data.errors);
    throw new Error(data.errors[0]?.message || 'Monday.com query failed');
  }

  return data.data;
}

/**
 * Busca itens de um board específico
 */
export async function getBoardItems(boardId: string) {
  const query = `
    query GetBoardItems($boardId: ID!) {
      boards(ids: [$boardId]) {
        items_page {
          items {
            id
            name
            column_values {
              id
              text
              value
            }
            created_at
            updated_at
          }
        }
      }
    }
  `;

  return mondayQuery({
    query,
    variables: { boardId },
  });
}

/**
 * Busca um item específico por ID
 */
export async function getItemById(itemId: string) {
  const query = `
    query GetItem($itemId: ID!) {
      items(ids: [$itemId]) {
        id
        name
        column_values {
          id
          text
          value
          type
        }
        created_at
        updated_at
        board {
          id
          name
        }
      }
    }
  `;

  return mondayQuery({
    query,
    variables: { itemId },
  });
}

/**
 * Atualiza um valor de coluna em um item
 */
export async function updateItemColumn(
  itemId: string,
  columnId: string,
  value: string
) {
  const query = `
    mutation UpdateColumn($itemId: ID!, $columnId: String!, $value: JSON!) {
      change_column_value(
        item_id: $itemId,
        column_id: $columnId,
        value: $value
      ) {
        id
      }
    }
  `;

  return mondayQuery({
    query,
    variables: {
      itemId,
      columnId,
      value: JSON.stringify(value),
    },
  });
}

/**
 * Adiciona um update (comentário) a um item
 */
export async function addUpdateToItem(itemId: string, body: string) {
  const query = `
    mutation AddUpdate($itemId: ID!, $body: String!) {
      create_update(item_id: $itemId, body: $body) {
        id
        body
        created_at
      }
    }
  `;

  return mondayQuery({
    query,
    variables: {
      itemId,
      body,
    },
  });
}

/**
 * Exemplo: Buscar serviços de um cliente específico
 * (ajustar conforme as colunas do seu board)
 */
export async function getClientServices(clientEmail: string) {
  const boardId = process.env.MONDAY_BOARD_ID;
  
  if (!boardId) {
    throw new Error('MONDAY_BOARD_ID not configured');
  }

  // Buscar todos os itens do board
  const data = await getBoardItems(boardId);
  
  // Filtrar itens do cliente específico
  // Ajuste o nome da coluna conforme seu board
  const clientItems = data.boards[0]?.items_page?.items?.filter((item: any) => {
    const emailColumn = item.column_values?.find((col: any) => col.id === 'email' || col.text?.toLowerCase().includes(clientEmail.toLowerCase()));
    return emailColumn;
  });

  return clientItems || [];
}

/**
 * Busca status de um veículo pelo RO Number
 */
export async function getVehicleStatusByRO(roNumber: string) {
  const boardId = process.env.MONDAY_BOARD_ID;
  
  if (!boardId) {
    throw new Error('MONDAY_BOARD_ID not configured');
  }

  // Buscar todos os itens do board
  const data = await getBoardItems(boardId);
  const items = data.boards[0]?.items_page?.items || [];

  // Procurar o item que corresponde ao RO Number
  // Ajustar o ID da coluna conforme configuração do seu board
  const vehicleItem = items.find((item: any) => {
    // Procurar coluna de RO Number (pode ser 'text', 'text0', etc)
    const roColumn = item.column_values?.find((col: any) => 
      col.text?.toString().trim() === roNumber.trim() ||
      col.value?.toString().trim() === roNumber.trim()
    );
    return roColumn;
  });

  if (!vehicleItem) {
    return null;
  }

  // Pegar valor da coluna de Status
  const statusColumn = vehicleItem.column_values?.find((col: any) => 
    col.id === 'status' || col.type === 'color' || col.id.includes('status')
  );

  return {
    itemId: vehicleItem.id,
    name: vehicleItem.name,
    status: statusColumn?.text || 'Unknown',
    statusValue: statusColumn?.value,
    allColumns: vehicleItem.column_values,
    updatedAt: vehicleItem.updated_at,
    createdAt: vehicleItem.created_at,
  };
}

/**
 * Busca detalhes completos de um item incluindo updates
 */
export async function getItemWithUpdates(itemId: string) {
  const query = `
    query GetItemWithUpdates($itemId: ID!) {
      items(ids: [$itemId]) {
        id
        name
        column_values {
          id
          text
          value
          type
        }
        created_at
        updated_at
        updates {
          id
          body
          created_at
          creator {
            name
            email
          }
        }
      }
    }
  `;

  return mondayQuery({
    query,
    variables: { itemId },
  });
}

/**
 * Cria uma mensagem do cliente no Monday (como update)
 */
export async function createClientMessage(itemId: string, message: string, clientInfo: { name: string; email: string; roNumber: string }) {
  const formattedMessage = `
📩 **Mensagem do Cliente**

**Cliente:** ${clientInfo.name}
**Email:** ${clientInfo.email}
**RO Number:** ${clientInfo.roNumber}

**Mensagem:**
${message}

---
_Enviada através do Client Portal_
  `.trim();

  return addUpdateToItem(itemId, formattedMessage);
}

/**
 * Busca o valor de uma coluna específica por ID
 */
export function getColumnValue(item: any, columnId: string): string | null {
  const column = item.column_values?.find((col: any) => col.id === columnId);
  return column?.text || column?.value || null;
}

/**
 * Busca RO Number de um item (tentando vários IDs de coluna possíveis)
 */
export function getRONumberFromItem(item: any): string | null {
  // IDs comuns para RO Number
  const possibleIds = ['text', 'text0', 'text1', 'ro_number', 'claim_number', 'ro'];
  
  for (const id of possibleIds) {
    const value = getColumnValue(item, id);
    if (value) return value;
  }
  
  return null;
}

