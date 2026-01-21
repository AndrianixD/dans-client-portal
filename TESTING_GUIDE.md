# Guia de Testes - Portal Admin e Cliente

## Pré-requisitos

Antes de testar, certifique-se de que:

1. ✅ Servidor está rodando (`npm run dev`)
2. ✅ Variáveis de ambiente configuradas no `.env.local`:
   - Cloudinary (já configurado)
   - Google Sheets (já configurado)
   - Admin credentials (já configurado)
3. ✅ Google Sheets Service Account tem permissão de **Editor** (não apenas Viewer)

---

## 🧪 Teste 1: Login como Admin

### Passos:

1. **Acesse:** `http://localhost:3000/login`

2. **Preencha:**
   - Username: `dansauto2026`
   - Password: `Rocket2025!`

3. **Clique em:** "ACCESS PORTAL →"

4. **Resultado esperado:**
   - ✅ Redireciona para `/admin/dashboard`
   - ✅ Vê lista de veículos ativos (onde `origin != "delivered"`)
   - ✅ Cada veículo mostra:
     - RO Number
     - Nome do cliente
     - Status atual
     - Foto atual (se houver)
     - Data da foto
     - Botão "Upload Photo"

### Se não funcionar:

- Verifique se as variáveis `ADMIN_USERNAME` e `ADMIN_PASSWORD` estão no `.env.local`
- Reinicie o servidor após adicionar variáveis de ambiente
- Verifique o console do navegador para erros

---

## 🧪 Teste 2: Upload de Foto (Admin)

### Passos:

1. **No admin dashboard**, encontre um veículo ativo

2. **Clique em:** "Upload Photo"

3. **Selecione uma imagem:**
   - Formato: JPEG, PNG ou WebP
   - Tamanho máximo: 5MB
   - Exemplo: Tire uma foto do seu celular ou use uma imagem de teste

4. **Aguarde o upload:**
   - Deve mostrar "Uploading..." durante o processo
   - Deve mostrar mensagem de sucesso

5. **Resultado esperado:**
   - ✅ Foto aparece no card do veículo
   - ✅ Data/hora atual é exibida
   - ✅ Foto substitui a anterior (se existir)

### Se não funcionar:

- Verifique se as credenciais do Cloudinary estão corretas no `.env.local`
- Verifique o tamanho do arquivo (máximo 5MB)
- Verifique o formato do arquivo (apenas imagens)
- Verifique o console do navegador e do servidor para erros
- Verifique se o Google Sheets Service Account tem permissão de Editor

---

## 🧪 Teste 3: Verificar Foto no Google Sheets

### Passos:

1. **Abra o Google Sheets** (ID: `1f84Je0PQTn-D93YQe1RWQeAHBQ8Uosyr8N7CCcKRifw`)

2. **Vá para a aba:** `allvehiclesmonday`

3. **Verifique:**
   - Se as colunas `photo_url` e `photo_date` foram criadas automaticamente
   - Se o veículo que você fez upload tem uma URL na coluna `photo_url`
   - Se a data está na coluna `photo_date`

### Se as colunas não existirem:

- O sistema criará automaticamente na primeira vez que você fizer upload
- Se não criou, verifique se o Service Account tem permissão de Editor

---

## 🧪 Teste 4: Login como Cliente

### Passos:

1. **Acesse:** `http://localhost:3000/login`

2. **Preencha com credenciais de um veículo ativo:**
   - Username: RO Number (ex: `4355`)
   - Password: Monday Item ID (código fornecido pela equipe)

3. **Clique em:** "ACCESS PORTAL →"

4. **Resultado esperado:**
   - ✅ Redireciona para `/dashboard`
   - ✅ Vê informações do veículo
   - ✅ Vê status atual e mensagem
   - ✅ Vê foto do veículo (se foi feito upload pelo admin)
   - ✅ Vê data/hora da foto

### Se não funcionar:

- Verifique se o RO Number existe no Google Sheets
- Verifique se o Monday Item ID está correto
- Verifique se o veículo não está marcado como "delivered" na coluna `origin`
- Verifique o console do navegador para erros

---

## 🧪 Teste 5: Visualizar Foto no Portal do Cliente

### Passos:

1. **Faça login como cliente** (veja Teste 4)

2. **No dashboard**, procure a seção "Vehicle Photos"

3. **Resultado esperado:**
   - ✅ Se admin fez upload: Foto aparece com data/hora
   - ✅ Se não há foto: Mensagem "Photos will appear here..."

### Se a foto não aparecer:

- Verifique se o admin fez upload da foto
- Verifique se a URL no Google Sheets está correta
- Verifique se o Next.js está configurado para permitir imagens do Cloudinary (`next.config.ts`)
- Verifique o console do navegador para erros de carregamento de imagem

---

## 🔍 Verificações de Debug

### Console do Navegador (F12)

Verifique se há erros em:
- Network tab (requisições falhando)
- Console tab (erros JavaScript)

### Console do Servidor

Verifique se há erros em:
- Upload de imagens
- Acesso ao Google Sheets
- Autenticação

### Variáveis de Ambiente

Verifique se todas estão configuradas:

```bash
# No terminal, execute:
cd /Users/marileiafeliciano/dans-client-portal
cat .env.local | grep -E "(CLOUDINARY|ADMIN|GOOGLE)"
```

Deve mostrar:
- `CLOUDINARY_CLOUD_NAME=dqsgscpfx`
- `CLOUDINARY_API_KEY=164356495176486`
- `CLOUDINARY_API_SECRET=nfabKeC4AUwe0OObP_ePtUiuH_c`
- `ADMIN_USERNAME=dansauto2026`
- `ADMIN_PASSWORD=Rocket2025!`
- Variáveis do Google Sheets

---

## 📝 Checklist de Testes

- [ ] Login admin funciona
- [ ] Admin dashboard carrega veículos ativos
- [ ] Upload de foto funciona
- [ ] Foto aparece no admin dashboard após upload
- [ ] Colunas `photo_url` e `photo_date` foram criadas no Google Sheets
- [ ] Login cliente funciona
- [ ] Foto aparece no portal do cliente
- [ ] Data/hora da foto está correta
- [ ] Substituição de foto funciona (nova foto substitui a anterior)

---

## 🐛 Problemas Comuns

### Erro: "Cloudinary credentials not configured"
**Solução:** Verifique se as variáveis estão no `.env.local` e reinicie o servidor

### Erro: "Unauthorized" ao fazer upload
**Solução:** Verifique se está logado como admin

### Foto não aparece no portal do cliente
**Solução:** 
1. Verifique se a URL está salva no Google Sheets
2. Verifique `next.config.ts` para permitir imagens do Cloudinary
3. Verifique se a URL do Cloudinary está acessível

### Erro ao atualizar Google Sheets
**Solução:** Verifique se o Service Account tem permissão de **Editor** (não apenas Viewer)

### Colunas não são criadas automaticamente
**Solução:** O sistema cria na primeira vez. Se não criou, verifique permissões do Service Account

---

## 🎯 Teste Rápido (5 minutos)

1. Login como admin → Ver veículos
2. Upload de foto → Ver foto no admin
3. Login como cliente → Ver foto no portal do cliente

Se todos os 3 passos funcionarem, o sistema está funcionando corretamente! ✅

