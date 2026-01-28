#!/bin/bash

# ============================================
# Script de Setup para Google Cloud Build
# Projeto: clientportal-485019
# ============================================

PROJECT_ID="clientportal-485019"
REGION="us-central1"
SERVICE_NAME="dans-client-portal"
REPO_NAME="dans-client-portal"

echo "🚀 Configurando Google Cloud para: $PROJECT_ID"
echo "================================================"

# Configurar o projeto
echo "📌 Configurando projeto..."
gcloud config set project $PROJECT_ID

# Habilitar APIs necessárias
echo "🔧 Habilitando APIs necessárias..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable secretmanager.googleapis.com

# Criar repositório no Artifact Registry
echo "📦 Criando repositório no Artifact Registry..."
gcloud artifacts repositories create $REPO_NAME \
    --repository-format=docker \
    --location=$REGION \
    --description="Docker repository for Dans Client Portal" \
    2>/dev/null || echo "Repositório já existe"

# Obter o número do projeto e configurar permissões
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
CLOUD_BUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

echo "🔐 Configurando permissões para Cloud Build..."

# Permissão para deploy no Cloud Run
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${CLOUD_BUILD_SA}" \
    --role="roles/run.admin" \
    --condition=None 2>/dev/null

# Permissão para atuar como service account
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${CLOUD_BUILD_SA}" \
    --role="roles/iam.serviceAccountUser" \
    --condition=None 2>/dev/null

# Permissão para acessar secrets
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${CLOUD_BUILD_SA}" \
    --role="roles/secretmanager.secretAccessor" \
    --condition=None 2>/dev/null

# Também dar permissão ao Cloud Run service account
COMPUTE_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${COMPUTE_SA}" \
    --role="roles/secretmanager.secretAccessor" \
    --condition=None 2>/dev/null

echo ""
echo "✅ Setup de APIs e permissões concluído!"
echo ""
echo "================================================"
echo "📝 PRÓXIMO PASSO: Criar os Secrets"
echo "================================================"
echo ""
echo "Execute os comandos abaixo para criar cada secret:"
echo "(Substitua os valores pelos seus dados reais)"
echo ""
echo "# Google Sheets"
echo 'echo -n "SEU_CLIENT_EMAIL" | gcloud secrets create GOOGLE_SHEETS_CLIENT_EMAIL --data-file=-'
echo 'echo -n "SUA_PRIVATE_KEY" | gcloud secrets create GOOGLE_SHEETS_PRIVATE_KEY --data-file=-'
echo 'echo -n "SEU_SPREADSHEET_ID" | gcloud secrets create GOOGLE_SHEETS_SPREADSHEET_ID --data-file=-'
echo ""
echo "# Cloudinary"
echo 'echo -n "SEU_CLOUD_NAME" | gcloud secrets create CLOUDINARY_CLOUD_NAME --data-file=-'
echo 'echo -n "SUA_API_KEY" | gcloud secrets create CLOUDINARY_API_KEY --data-file=-'
echo 'echo -n "SEU_API_SECRET" | gcloud secrets create CLOUDINARY_API_SECRET --data-file=-'
echo ""
echo "# Admin Password"
echo 'echo -n "SUA_SENHA_ADMIN" | gcloud secrets create ADMIN_PASSWORD --data-file=-'
echo ""
echo "# Resend API Key"
echo 'echo -n "SUA_RESEND_API_KEY" | gcloud secrets create RESEND_API_KEY --data-file=-'
echo ""
echo "================================================"
echo "🔗 CONFIGURAR TRIGGER DO CLOUD BUILD"
echo "================================================"
echo ""
echo "1. Acesse: https://console.cloud.google.com/cloud-build/triggers?project=$PROJECT_ID"
echo "2. Clique em 'CREATE TRIGGER'"
echo "3. Configure:"
echo "   - Nome: deploy-on-push"
echo "   - Evento: Push to a branch"
echo "   - Repositório: Conecte seu repositório GitHub"
echo "   - Branch: ^main$ (ou ^master$)"
echo "   - Tipo: Cloud Build configuration file"
echo "   - Localização: cloudbuild.yaml"
echo "4. Clique em 'CREATE'"
echo ""
echo "================================================"

