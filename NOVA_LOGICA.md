# 🔄 Nova Lógica de Autenticação

## Mudanças Implementadas

### ✅ Autenticação Simplificada

**ANTES:**
- Login: RO Number + Email
- Fonte: Google Sheets + Monday.com

**AGORA:**
- Login: RO Number
- Senha: Monday_Item_ID (coluna `Monday_Item_ID` no Google Sheets)
- Fonte: **Apenas Google Sheets**

---

## 📊 Estrutura do Google Sheets

### Planilha ID
```
1f84Je0PQTn-D93YQe1RWQeAHBQ8Uosyr8N7CCcKRifw
```

### Aba: `allvehiclesmonday`

**Colunas principais:**
- `RO` - RO Number (usado como login)
- `Monday_Item_ID` - ID do item no Monday (usado como senha)
- `updates` - Status atual (ex: "Vehicle Received", "Work in Progress", etc)
- `VIN` - VIN do veículo
- `Name` / `Client` - Nome do cliente
- `Model` - Modelo do veículo
- `Year` - Ano do veículo
- `Make` - Marca do veículo
- `Phone` - Telefone
- `Email` - Email (opcional)

### Aba: `updatelist`

**Estrutura:**
- Coluna A: `STATUS` - Nome do status (ex: "Vehicle Received")
- Coluna B: `Message` - Mensagem correspondente ao status

**Exemplo:**
```
STATUS              | Message
--------------------|----------------------------------------
Vehicle Received    | Your vehicle has been received...
Work in Progress    | We are actively working on...
Ready for Pickup    | Great news! Your vehicle is ready...
```

---

## 🔐 Fluxo de Autenticação

1. Cliente acessa o portal
2. Digita:
   - **RO Number** (ex: "12345")
   - **Password** (Monday_Item_ID fornecido pela oficina)
3. Sistema busca na aba `allvehiclesmonday`:
   - Verifica se RO Number existe
   - Verifica se Monday_Item_ID corresponde
4. Se válido:
   - Busca status na coluna `updates`
   - Busca mensagem correspondente na aba `updatelist`
   - Exibe dashboard

---

## 📝 Como Funciona

### 1. Login (`/api/auth/verify`)
```typescript
POST /api/auth/verify
Body: {
  roNumber: "12345",
  password: "monday_item_id_123"
}
```

### 2. Buscar Veículo (`/api/vehicle/[roNumber]`)
```typescript
GET /api/vehicle/12345?password=monday_item_id_123
```

### 3. Buscar Status (`/api/status/[roNumber]`)
```typescript
GET /api/status/12345?password=monday_item_id_123
```
- Busca coluna `updates` do veículo
- Busca mensagem na aba `updatelist` usando o valor de `updates`

---

## 🎯 Vantagens da Nova Lógica

✅ **Mais Simples**: Apenas Google Sheets, sem depender do Monday.com API
✅ **Mais Seguro**: Senha única por veículo (Monday_Item_ID)
✅ **Mais Flexível**: Fácil de atualizar status e mensagens
✅ **Mais Rápido**: Menos chamadas de API

---

## 🔧 Configuração Necessária

### 1. Google Sheets Service Account
- Criar service account no Google Cloud
- Baixar JSON com credenciais
- Compartilhar planilha com email da service account

### 2. Variáveis de Ambiente
```env
GOOGLE_SHEETS_ID=1f84Je0PQTn-D93YQe1RWQeAHBQ8Uosyr8N7CCcKRifw
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 3. Estrutura da Planilha
- Aba `allvehiclesmonday` com todas as colunas necessárias
- Aba `updatelist` com STATUS e Message

---

## 📋 Checklist de Implementação

- [x] Atualizar função `getVehicleByROAndPassword`
- [x] Atualizar função `getMessageForStatus`
- [x] Atualizar API `/api/auth/verify`
- [x] Atualizar API `/api/vehicle/[roNumber]`
- [x] Atualizar API `/api/status/[roNumber]`
- [x] Atualizar página de login (RO + Password)
- [x] Atualizar dashboard para usar password
- [x] Atualizar formulário de contato

---

## 🧪 Modo Demo

O modo demo ainda funciona para testes:
- Use `DEMO001` como RO Number
- Use `demo@cliente.com` como Password (compatibilidade)

---

## 📞 Suporte

Se tiver dúvidas sobre a implementação, consulte:
- `lib/google-sheets.ts` - Funções de integração
- `app/api/auth/verify/route.ts` - Autenticação
- `app/api/status/[roNumber]/route.ts` - Busca de status

