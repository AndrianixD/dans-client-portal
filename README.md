# Dan's Auto Body - Client Portal

Portal do cliente integrado com Monday.com e Google Sheets para acompanhamento de serviços de reparo automotivo.

## 🚀 Funcionalidades

- 🔐 Autenticação com RO Number + Email
- 📊 Dashboard com status em tempo real
- 🔗 Integração com Monday.com
- 📋 Informações detalhadas do veículo
- 💬 Sistema de mensagens para a oficina
- 📧 Notificações por email
- 📱 Design responsivo (mobile-friendly)

## 📋 Pré-requisitos

- Node.js 18+
- Conta Monday.com com API token
- Google Cloud Project com Google Sheets API
- Conta Resend para envio de emails

## 🛠️ Instalação Rápida

```bash
# Instalar dependências
npm install

# Copiar arquivo de variáveis de ambiente
cp .env.example .env.local

# Configurar credenciais (ver SETUP.md para detalhes)
```

**⚠️ IMPORTANTE:** Consulte o arquivo [SETUP.md](SETUP.md) para instruções completas de configuração passo a passo.

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

## 📚 Estrutura do Sistema

### Fluxo de Autenticação
1. Cliente acessa portal
2. Insere RO Number + Email
3. Sistema valida no Google Sheets
4. Redireciona para dashboard

### Fluxo de Dados
1. **Google Sheets**: Armazena dados básicos dos veículos e mensagens
2. **Monday.com**: Gerencia workflow e status em tempo real
3. **Dashboard**: Combina dados de ambas as fontes

### APIs Disponíveis
- `POST /api/auth/verify` - Verificação de login
- `GET /api/vehicle/[roNumber]` - Dados do veículo
- `GET /api/status/[roNumber]` - Status atual
- `POST /api/messages/send` - Envio de mensagens

## 🔒 Segurança

- ✅ Autenticação obrigatória
- ✅ Variáveis de ambiente (nunca commitar .env)
- ✅ API tokens protegidos
- ✅ HTTPS em produção

## 📞 Suporte

Para dúvidas sobre o portal, entre em contato com o desenvolvedor.
