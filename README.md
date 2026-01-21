# Dan's Auto Body - Client Portal

Portal do cliente integrado com Monday.com para acompanhamento de serviços.

## 🚀 Funcionalidades

- 🔐 Autenticação de clientes
- 📊 Dashboard com status do serviço
- 🔗 Integração com Monday.com
- 📷 Upload de fotos adicionais
- 💬 Comunicação com a oficina
- 📅 Histórico de serviços

## 📋 Pré-requisitos

- Node.js 18+
- Conta Monday.com com API token
- Board ID do Monday.com configurado

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de variáveis de ambiente
cp .env.example .env

# Editar .env com suas credenciais
# - MONDAY_API_TOKEN
# - MONDAY_BOARD_ID
# - NEXTAUTH_SECRET (gerar com: openssl rand -base64 32)
```

## 🏃 Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

## 🚀 Deploy

### Opção 1: Vercel (Recomendado para Next.js)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Opção 2: Google Cloud Run

```bash
# Build
npm run build

# Deploy
gcloud run deploy dans-client-portal \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## 📚 Integração Monday.com

### Obter API Token:

1. Acesse: https://monday.com
2. Avatar (canto superior direito) → Admin → API
3. Gere um token pessoal
4. Cole no .env como `MONDAY_API_TOKEN`

### Obter Board ID:

1. Abra o board que você quer usar
2. A URL terá: `boards/XXXXXXXX`
3. Copie o número e cole no .env como `MONDAY_BOARD_ID`

## 🔒 Segurança

- ✅ Autenticação obrigatória
- ✅ Variáveis de ambiente (nunca commitar .env)
- ✅ API tokens protegidos
- ✅ HTTPS em produção

## 📞 Suporte

Para dúvidas sobre o portal, entre em contato com o desenvolvedor.
