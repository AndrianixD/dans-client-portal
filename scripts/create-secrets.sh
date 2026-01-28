#!/bin/bash

# ============================================
# Script para criar Secrets no Google Cloud
# Projeto: clientportal-485019
# ============================================

PROJECT_ID="clientportal-485019"

echo "🔐 Criando Secrets no Google Cloud Secret Manager"
echo "Projeto: $PROJECT_ID"
echo "================================================"
echo ""

# Função para criar ou atualizar secret
create_secret() {
    local secret_name=$1
    local secret_value=$2
    
    # Verifica se o secret já existe
    if gcloud secrets describe $secret_name --project=$PROJECT_ID &>/dev/null; then
        echo "📝 Atualizando secret: $secret_name"
        echo -n "$secret_value" | gcloud secrets versions add $secret_name --data-file=- --project=$PROJECT_ID
    else
        echo "✨ Criando secret: $secret_name"
        echo -n "$secret_value" | gcloud secrets create $secret_name --data-file=- --project=$PROJECT_ID
    fi
}

# Google Sheets - Client Email
echo ""
echo "📧 GOOGLE_SHEETS_CLIENT_EMAIL"
echo "Digite o client email da service account do Google Sheets:"
read -r GOOGLE_SHEETS_CLIENT_EMAIL
if [ -n "$GOOGLE_SHEETS_CLIENT_EMAIL" ]; then
    create_secret "GOOGLE_SHEETS_CLIENT_EMAIL" "$GOOGLE_SHEETS_CLIENT_EMAIL"
fi

# Google Sheets - Private Key
echo ""
echo "🔑 GOOGLE_SHEETS_PRIVATE_KEY"
echo "Cole a private key completa (começando com -----BEGIN PRIVATE KEY-----):"
echo "(Pressione Enter duas vezes quando terminar)"
GOOGLE_SHEETS_PRIVATE_KEY=""
while IFS= read -r line; do
    [ -z "$line" ] && break
    GOOGLE_SHEETS_PRIVATE_KEY+="$line"$'\n'
done
if [ -n "$GOOGLE_SHEETS_PRIVATE_KEY" ]; then
    create_secret "GOOGLE_SHEETS_PRIVATE_KEY" "$GOOGLE_SHEETS_PRIVATE_KEY"
fi

# Google Sheets - Spreadsheet ID
echo ""
echo "📊 GOOGLE_SHEETS_SPREADSHEET_ID"
echo "Digite o ID da planilha do Google Sheets:"
read -r GOOGLE_SHEETS_SPREADSHEET_ID
if [ -n "$GOOGLE_SHEETS_SPREADSHEET_ID" ]; then
    create_secret "GOOGLE_SHEETS_SPREADSHEET_ID" "$GOOGLE_SHEETS_SPREADSHEET_ID"
fi

# Cloudinary - Cloud Name
echo ""
echo "☁️ CLOUDINARY_CLOUD_NAME"
echo "Digite o Cloud Name do Cloudinary:"
read -r CLOUDINARY_CLOUD_NAME
if [ -n "$CLOUDINARY_CLOUD_NAME" ]; then
    create_secret "CLOUDINARY_CLOUD_NAME" "$CLOUDINARY_CLOUD_NAME"
fi

# Cloudinary - API Key
echo ""
echo "🔑 CLOUDINARY_API_KEY"
echo "Digite a API Key do Cloudinary:"
read -r CLOUDINARY_API_KEY
if [ -n "$CLOUDINARY_API_KEY" ]; then
    create_secret "CLOUDINARY_API_KEY" "$CLOUDINARY_API_KEY"
fi

# Cloudinary - API Secret
echo ""
echo "🔒 CLOUDINARY_API_SECRET"
echo "Digite o API Secret do Cloudinary:"
read -sr CLOUDINARY_API_SECRET
echo ""
if [ -n "$CLOUDINARY_API_SECRET" ]; then
    create_secret "CLOUDINARY_API_SECRET" "$CLOUDINARY_API_SECRET"
fi

# Admin Password
echo ""
echo "👤 ADMIN_PASSWORD"
echo "Digite a senha do admin:"
read -sr ADMIN_PASSWORD
echo ""
if [ -n "$ADMIN_PASSWORD" ]; then
    create_secret "ADMIN_PASSWORD" "$ADMIN_PASSWORD"
fi

# Resend API Key
echo ""
echo "📧 RESEND_API_KEY"
echo "Digite a API Key do Resend:"
read -r RESEND_API_KEY
if [ -n "$RESEND_API_KEY" ]; then
    create_secret "RESEND_API_KEY" "$RESEND_API_KEY"
fi

echo ""
echo "================================================"
echo "✅ Secrets criados/atualizados com sucesso!"
echo ""
echo "Para verificar os secrets criados, execute:"
echo "gcloud secrets list --project=$PROJECT_ID"
echo "================================================"

