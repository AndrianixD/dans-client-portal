# Guia de Configuração - Portal do Cliente

Este guia mostra passo a passo como configurar o Portal do Cliente.

## 📋 Pré-requisitos

- Node.js 18 ou superior instalado
- Conta no Monday.com com acesso à API
- Google Cloud Project com Google Sheets API habilitada
- Conta no Resend (para envio de emails)

## 🔧 Passo 1: Configurar Google Sheets

### 1.1 Criar a Planilha

Crie uma planilha no Google Sheets com duas abas:

#### Aba "Vehicles"
Colunas (linha 1 - headers):
```
RO Number | Email | VIN | Nome Cliente | Modelo | Ano | Marca | Telefone
```

Exemplo de dados:
```
12345 | cliente@email.com | 1HGBH41JXMN109186 | João Silva | Civic | 2020 | Honda | (978) 123-4567
```

#### Aba "Messages"
Colunas (linha 1 - headers):
```
Stage | Message | Description
```

Exemplo de dados:
```
Vehicle Received | Seu veículo foi recebido e está sendo inspecionado pela nossa equipe. | Fase inicial
In Progress | Estamos trabalhando no reparo do seu veículo. | Reparo em andamento
Ready for Pickup | Seu veículo está pronto para retirada! | Finalizado
```

### 1.2 Configurar Google Cloud

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Habilite a **Google Sheets API**:
   - Menu → APIs & Services → Library
   - Procure "Google Sheets API"
   - Clique em "Enable"

4. Criar Service Account:
   - Menu → IAM & Admin → Service Accounts
   - Clique em "Create Service Account"
   - Nome: `dans-portal-sheets`
   - Clique em "Create and Continue"
   - Pule as permissões (opcional)
   - Clique em "Done"

5. Criar chave JSON:
   - Clique na service account criada
   - Aba "Keys"
   - "Add Key" → "Create new key" → JSON
   - Baixe o arquivo JSON

6. Compartilhar planilha:
   - Abra sua planilha no Google Sheets
   - Clique em "Compartilhar"
   - Adicione o email da service account (está no JSON baixado)
   - Dê permissão de "Viewer" (apenas leitura)

### 1.3 Obter ID da Planilha

Na URL da planilha, copie o ID:
```
https://docs.google.com/spreadsheets/d/[ESTE_É_O_ID]/edit
```

## 🔧 Passo 2: Configurar Monday.com

1. Acesse [Monday.com](https://monday.com)
2. Vá para seu perfil → Admin → API
3. Gere um Personal API Token
4. Copie e guarde o token

### Obter Board ID:
1. Abra o board que você usa para o fluxo de trabalho
2. Na URL, copie o número:
   ```
   https://monday.com/boards/[ESTE_É_O_BOARD_ID]
   ```

### Verificar Colunas:
Certifique-se de que seu board tem:
- Uma coluna com o RO Number
- Uma coluna de Status (tipo "Status" ou "Dropdown")

## 🔧 Passo 3: Configurar Resend (Email)

1. Acesse [Resend.com](https://resend.com)
2. Crie uma conta
3. Vá para API Keys
4. Crie uma nova API Key
5. Copie a chave (começa com `re_`)

### Configurar Domínio (Opcional mas Recomendado):
1. Em Domains, adicione `dansautobodyma.com`
2. Configure os registros DNS conforme instruções
3. Aguarde verificação

## 🔧 Passo 4: Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env.local`:
```bash
cp .env.example .env.local
```

2. Abra o arquivo JSON da service account do Google e copie:
   - `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` → `GOOGLE_PRIVATE_KEY`

3. Edite `.env.local` com suas credenciais:

```env
# Monday.com
MONDAY_API_TOKEN=eyJhbGc...seu_token_aqui
MONDAY_BOARD_ID=1234567890

# Google Sheets
GOOGLE_SHEETS_ID=1a2b3c4d5e6f7g8h9i0j_seu_id_aqui
GOOGLE_SERVICE_ACCOUNT_EMAIL=dans-portal-sheets@project-123456.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_PRIVADA_AQUI\n-----END PRIVATE KEY-----\n"

# Email
RESEND_API_KEY=re_sua_chave_aqui
EMAIL_TO=info@dansautobodyma.com
EMAIL_FROM=portal@dansautobodyma.com

# NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

4. Gerar NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```
Cole o resultado em `NEXTAUTH_SECRET`.

## 🚀 Passo 5: Instalar e Testar

1. Instalar dependências:
```bash
npm install
```

2. Rodar em desenvolvimento:
```bash
npm run dev
```

3. Abrir navegador em: http://localhost:3000

## ✅ Testar o Sistema

### Teste 1: Login
1. Acesse http://localhost:3000
2. Clique em "Client Login"
3. Digite um RO Number e Email que existem no Google Sheets
4. Deve logar com sucesso

### Teste 2: Dashboard
1. Após login, você deve ver:
   - Informações do veículo
   - Status atual do Monday.com
   - Mensagem correspondente ao status
   - Formulário de contato

### Teste 3: Enviar Mensagem
1. Digite uma mensagem no formulário
2. Clique em "Enviar Mensagem"
3. Verifique se recebeu o email em `info@dansautobodyma.com`

## 🌐 Deploy em Produção

### Opção 1: Vercel (Recomendado)

1. Instalar Vercel CLI:
```bash
npm i -g vercel
```

2. Login:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Configurar variáveis de ambiente:
   - Vá para o dashboard da Vercel
   - Projeto → Settings → Environment Variables
   - Adicione todas as variáveis do `.env.local`

5. Configurar domínio:
   - Em Settings → Domains
   - Adicione: `portal.dansautobodyma.com`
   - Configure o DNS conforme instruções

### Opção 2: Outro Host

Para outros hosts (DigitalOcean, AWS, etc):
```bash
# Build
npm run build

# Iniciar
npm start
```

## 🔒 Segurança

- ✅ Nunca commite `.env.local` no Git
- ✅ Use variáveis de ambiente no servidor de produção
- ✅ Mantenha as chaves API privadas
- ✅ Use HTTPS em produção
- ✅ Configure CORS se necessário

## 🆘 Problemas Comuns

### Erro: "GOOGLE_SHEETS_ID not configured"
- Verifique se `.env.local` existe
- Certifique-se de que as variáveis estão sem espaços extras

### Erro: "RO Number ou Email inválidos"
- Verifique se o RO Number e Email existem EXATAMENTE como na planilha
- Email deve ser em minúsculas

### Erro: "Status não encontrado no Monday.com"
- Verifique se o RO Number existe no Monday.com
- Certifique-se de que o BOARD_ID está correto

### Email não está chegando
- Verifique a chave da Resend
- Confirme que o domínio está verificado
- Verifique spam/lixo eletrônico

## 📞 Suporte

Se precisar de ajuda, entre em contato com o desenvolvedor do sistema.

