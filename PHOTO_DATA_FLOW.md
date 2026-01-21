# Fluxo de Dados: Armazenamento e Associação de Fotos

## 📸 Como as Fotos são Armazenadas e Associadas aos Veículos

### 1. Upload da Foto (Admin)

**Localização:** `app/api/admin/upload-photo/route.ts`

**Processo:**
1. Admin seleciona foto e clica em "Upload All"
2. Sistema recebe: `roNumber` + `file` (imagem)
3. Validações:
   - Tipo de arquivo (JPEG, PNG, WebP)
   - Tamanho máximo (5MB)
4. Compressão automática da imagem (reduz tamanho)
5. Upload para Cloudinary

### 2. Armazenamento no Cloudinary

**Localização:** `lib/cloudinary.ts`

**Processo:**
```typescript
uploadImage(buffer, roNumber, mimeType)
```

**O que acontece:**
- Foto é enviada para Cloudinary
- Nome do arquivo: `RO-{sanitizedRO}` (ex: `RO-4355`)
- Pasta: `dans-auto-body/vehicles/`
- **Substitui foto anterior** se existir (`overwrite: true`)
- Retorna: URL completa (ex: `https://res.cloudinary.com/dqsgscpfx/image/upload/...`)

**Estrutura no Cloudinary:**
```
dans-auto-body/
  └── vehicles/
      ├── RO-4355.jpg  ← Foto do veículo RO #4355
      ├── RO-4356.jpg  ← Foto do veículo RO #4356
      └── ...
```

### 3. Salvamento no Google Sheets

**Localização:** `lib/google-sheets.ts` → `updateVehiclePhoto()`

**Processo:**
1. Busca a linha do veículo na aba `allvehiclesmonday` usando **RO Number**
2. Se as colunas `photo_url` e `photo_date` não existem:
   - Cria as colunas automaticamente
   - Adiciona headers: `photo_url` e `photo_date`
3. Atualiza a linha do veículo com:
   - `photo_url`: URL completa do Cloudinary
   - `photo_date`: Data/hora ISO (ex: `2026-01-21T14:30:00Z`)

**Cruzamento de Dados:**
```
Google Sheets - Aba "allvehiclesmonday"
┌─────────┬──────────────┬─────────────┬──────────────┐
│   RO    │  photo_url   │ photo_date  │   updates    │
├─────────┼──────────────┼─────────────┼──────────────┤
│  4355   │ https://...  │ 2026-01-21T │ Work in...   │
│  4356   │ https://...  │ 2026-01-21T │ Done         │
└─────────┴──────────────┴─────────────┴──────────────┘
         ↑
    Chave primária para associação
```

### 4. Busca quando Cliente Acessa

**Localização:** `lib/google-sheets.ts` → `getVehicleByROAndPassword()`

**Processo:**
1. Cliente faz login com: **RO Number** + **Password** (Monday Item ID)
2. Sistema busca na aba `allvehiclesmonday`:
   - Encontra linha onde `RO` = RO Number do cliente
   - Lê colunas `photo_url` e `photo_date` da mesma linha
3. Retorna dados completos incluindo:
   ```typescript
   {
     roNumber: "4355",
     photoUrl: "https://res.cloudinary.com/...",
     photoDate: "2026-01-21T14:30:00Z",
     // ... outros dados
   }
   ```

### 5. Exibição no Portal do Cliente

**Localização:** `app/dashboard/page.tsx`

**Processo:**
1. API `/api/vehicle/[roNumber]` retorna dados incluindo `photoUrl` e `photoDate`
2. Dashboard do cliente verifica:
   ```typescript
   {vehicleData?.photoUrl ? (
     // Exibe foto
   ) : (
     // Mensagem "Photos will appear here..."
   )}
   ```
3. Se `photoUrl` existe, exibe a imagem do Cloudinary
4. Mostra data/hora formatada abaixo da foto

---

## 🔗 Associação Foto ↔ Veículo

### Chave de Associação: **RO Number**

A associação é feita através do **RO Number**, que é:
- ✅ Único para cada veículo
- ✅ Usado no login do cliente
- ✅ Usado para buscar dados no Google Sheets
- ✅ Usado no nome do arquivo no Cloudinary

### Fluxo Completo:

```
1. Admin faz upload
   ↓
2. Cloudinary armazena: RO-4355.jpg
   ↓
3. Google Sheets atualiza linha RO=4355:
   - photo_url = "https://res.cloudinary.com/.../RO-4355.jpg"
   - photo_date = "2026-01-21T14:30:00Z"
   ↓
4. Cliente faz login com RO=4355
   ↓
5. Sistema busca linha RO=4355 no Google Sheets
   ↓
6. Retorna photo_url e photo_date
   ↓
7. Dashboard exibe foto do Cloudinary
```

---

## ✅ Garantias do Sistema

### 1. Associação Correta
- ✅ Foto sempre associada ao RO Number correto
- ✅ Mesmo RO Number = mesma linha no Google Sheets
- ✅ Mesmo RO Number = mesmo arquivo no Cloudinary

### 2. Substituição Automática
- ✅ Nova foto substitui a anterior automaticamente
- ✅ Cloudinary: `overwrite: true` substitui arquivo
- ✅ Google Sheets: atualiza valores na mesma linha

### 3. Busca Eficiente
- ✅ Busca por RO Number (chave primária)
- ✅ Uma única linha por veículo
- ✅ Dados sempre atualizados

---

## 🔍 Verificação de Integridade

Para verificar se está tudo funcionando:

1. **No Google Sheets:**
   - Aba `allvehiclesmonday`
   - Encontre um veículo pelo RO Number
   - Verifique se `photo_url` tem URL do Cloudinary
   - Verifique se `photo_date` tem data

2. **No Cloudinary:**
   - Dashboard → Media Library
   - Pasta `dans-auto-body/vehicles`
   - Verifique se existe arquivo `RO-{numero}`

3. **No Portal do Cliente:**
   - Faça login com RO Number + Password
   - Verifique se a foto aparece
   - Verifique se a data está correta

---

## 🐛 Possíveis Problemas

### Problema 1: Foto não aparece
**Causa:** Colunas não foram criadas ou RO Number não encontrado
**Solução:** Verificar se `updateVehiclePhoto` foi executado com sucesso

### Problema 2: Foto errada aparece
**Causa:** RO Number incorreto no upload
**Solução:** Verificar se o RO Number está correto no admin dashboard

### Problema 3: Foto antiga aparece
**Causa:** Cache do navegador ou Cloudinary não substituiu
**Solução:** Limpar cache ou adicionar timestamp na URL

---

## 📊 Estrutura de Dados

### Google Sheets - `allvehiclesmonday`
```csv
RO, Monday_Item_ID, updates, origin, photo_url, photo_date
4355, abc123, Work in Progress, active, https://res.cloudinary.com/..., 2026-01-21T14:30:00Z
4356, def456, Done, active, https://res.cloudinary.com/..., 2026-01-21T15:00:00Z
```

### Cloudinary
```
dans-auto-body/vehicles/RO-4355.jpg
dans-auto-body/vehicles/RO-4356.jpg
```

### API Response
```json
{
  "roNumber": "4355",
  "photoUrl": "https://res.cloudinary.com/dqsgscpfx/image/upload/.../RO-4355.jpg",
  "photoDate": "2026-01-21T14:30:00Z"
}
```

---

## ✅ Conclusão

O sistema está **corretamente configurado** para:
- ✅ Armazenar fotos no Cloudinary
- ✅ Associar fotos aos veículos via RO Number
- ✅ Salvar URLs no Google Sheets
- ✅ Buscar e exibir fotos para o cliente

A associação é **garantida** pelo uso consistente do **RO Number** em todas as etapas do processo.

