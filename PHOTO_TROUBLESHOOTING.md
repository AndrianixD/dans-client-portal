# Troubleshooting: Fotos não aparecem no Portal do Cliente

## Verificações Necessárias

### 1. Verificar se as colunas foram criadas no Google Sheets

1. Abra o Google Sheets (ID: `1f84Je0PQTn-D93YQe1RWQeAHBQ8Uosyr8N7CCcKRifw`)
2. Vá para a aba `allvehiclesmonday`
3. Verifique se existem as colunas:
   - `photo_url` (ou `photourl` ou `photo url`)
   - `photo_date` (ou `photodate` ou `photo date`)

**Se as colunas NÃO existem:**
- Faça upload de uma foto pelo admin dashboard
- O sistema criará automaticamente as colunas na primeira vez

### 2. Verificar se a foto foi salva corretamente

1. No Google Sheets, encontre o veículo pelo RO Number
2. Verifique se a coluna `photo_url` tem uma URL do Cloudinary
3. Verifique se a coluna `photo_date` tem uma data/hora

**Formato esperado:**
- `photo_url`: `https://res.cloudinary.com/dqsgscpfx/image/upload/...`
- `photo_date`: `2026-01-21T14:30:00Z` (formato ISO)

### 3. Verificar permissões do Service Account

O Service Account precisa ter permissão de **Editor** (não apenas Viewer) para:
- Criar as colunas automaticamente
- Atualizar os valores das colunas

**Como verificar:**
1. No Google Sheets, clique em "Compartilhar"
2. Verifique se o email do Service Account está listado
3. Verifique se a permissão é "Editor" ou "Proprietário"

### 4. Verificar no Console do Navegador

1. Abra o portal do cliente (F12)
2. Vá para a aba "Console"
3. Procure por erros relacionados a:
   - `photoUrl`
   - `photoDate`
   - `Image`
   - `Cloudinary`

### 5. Verificar no Console do Servidor

1. No terminal onde o servidor está rodando
2. Procure por logs que mostram:
   - "Photo columns not found"
   - "Available headers:"
   - Erros de acesso ao Google Sheets

## Correções Aplicadas

### ✅ Range Estendido
- Mudado de `A:Z` para `A:AA` para capturar colunas além de Z

### ✅ Busca Flexível de Colunas
- Agora aceita variações: `photo_url`, `photourl`, `photo url`
- Agora aceita variações: `photo_date`, `photodate`, `photo date`

### ✅ Logs de Debug
- Adicionado log quando colunas não são encontradas
- Mostra todos os headers disponíveis para debug

## Teste Rápido

1. **Faça login como admin**
2. **Faça upload de uma foto** para um veículo
3. **Verifique no Google Sheets** se as colunas foram criadas e preenchidas
4. **Faça login como cliente** com o RO Number desse veículo
5. **Verifique se a foto aparece**

## Se ainda não funcionar

1. Verifique o console do navegador (F12) para erros
2. Verifique o console do servidor para logs
3. Verifique se a URL do Cloudinary está acessível (copie e cole no navegador)
4. Verifique se o `next.config.ts` está configurado para permitir imagens do Cloudinary

