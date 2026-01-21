# Admin Portal Setup Guide

## Overview

O Admin Portal permite que administradores façam upload de fotos dos veículos que estão na oficina. As fotos são armazenadas no Cloudinary e exibidas no portal do cliente.

## Configuração

### 1. Criar Conta Cloudinary

1. Acesse [cloudinary.com](https://cloudinary.com)
2. Crie uma conta gratuita
3. No Dashboard, copie as seguintes informações:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 2. Configurar Variáveis de Ambiente

Adicione ao arquivo `.env.local`:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret

# Admin Credentials
ADMIN_USERNAME=dansauto2026
ADMIN_PASSWORD=Rocket2025!
```

### 3. Configurar Google Sheets

O Google Sheets precisa ter permissão de **escrita** (não apenas leitura).

1. Certifique-se de que o Service Account tem acesso à planilha
2. A planilha automaticamente criará as colunas `photo_url` e `photo_date` na aba `allvehiclesmonday` quando a primeira foto for enviada

### 4. Configurar Next.js para Imagens Externas

O arquivo `next.config.ts` já está configurado para permitir imagens do Cloudinary.

## Como Usar

### Login Admin

1. Acesse `/admin/login`
2. Use as credenciais:
   - Username: `dansauto2026`
   - Password: `Rocket2025!`

### Upload de Fotos

1. No dashboard admin, você verá todos os veículos ativos (onde `origin != "delivered"`)
2. Para cada veículo, clique em "Upload Photo"
3. Selecione uma imagem (JPEG, PNG ou WebP, máximo 5MB)
4. A foto será enviada e substituirá a foto anterior (se existir)
5. A foto aparecerá imediatamente no portal do cliente

### Visualização no Portal do Cliente

- Os clientes verão a foto mais recente na seção "Vehicle Photos"
- A data e hora da foto serão exibidas abaixo da imagem

## Estrutura de Dados

### Google Sheets - Aba `allvehiclesmonday`

Colunas adicionadas automaticamente:
- `photo_url` - URL da foto no Cloudinary
- `photo_date` - Data/hora ISO da foto (ex: "2026-01-21T14:30:00Z")

### Cloudinary

Estrutura de pastas:
```
dans-auto-body/
  └── vehicles/
      ├── RO-4355.jpg
      ├── RO-4356.jpg
      └── ...
```

Cada foto substitui a anterior (mesmo nome de arquivo).

## Segurança

- Todas as rotas `/api/admin/*` requerem autenticação
- Validação de tipo de arquivo (apenas imagens)
- Validação de tamanho máximo (5MB)
- Sanitização do RO Number antes de usar no nome do arquivo

## Troubleshooting

### Erro: "Cloudinary credentials not configured"
- Verifique se as variáveis de ambiente estão configuradas corretamente
- Reinicie o servidor após adicionar variáveis de ambiente

### Erro: "Unauthorized" ao acessar APIs admin
- Verifique se você está logado como admin
- Limpe o localStorage e faça login novamente

### Fotos não aparecem no portal do cliente
- Verifique se a coluna `photo_url` foi criada no Google Sheets
- Verifique se a URL da foto está correta no Google Sheets
- Verifique se o Next.js está configurado para permitir imagens do Cloudinary

### Erro ao fazer upload
- Verifique o tamanho do arquivo (máximo 5MB)
- Verifique o tipo do arquivo (apenas JPEG, PNG, WebP)
- Verifique se o Cloudinary está configurado corretamente

