# ⚡ Instruções Rápidas - Configuração

## ✅ Passo 1: Criar arquivo .env.local

Crie o arquivo `.env.local` na raiz do projeto com este conteúdo:

```env
# Google Sheets
GOOGLE_SHEETS_ID=1f84Je0PQTn-D93YQe1RWQeAHBQ8Uosyr8N7CCcKRifw
GOOGLE_SERVICE_ACCOUNT_EMAIL=clientportal@clientportal-485019.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCJzzl+MnxF3DhQ\nzv3nBlWCEZt87bKDmmS9ab0/tJEXznoemUkXw7F6Knr7YdUWNQPskoC/fKLoFKDa\nCZ1WgyNdgtIcJsdLeN9tcFZ0JUru5HFtjFOtaF9h9JgmYtvG76SqN7xI+zeWW0Xp\nPUE6cbMq5vpPqEQKbSTCZLMytYo9fMkHS9Jk/IRqVQFXNopf+q+ILhUFByJUKKx+\nDRVhd6mcUwk+tuoLqiBjIpLXBPDm0u43aAWW4rCP7uhCDlim4Ty16MOtI/DpRifb\nqJZYRobD3nELe8QEiFT/o+z+190otsUMVR0s+ushw60RaEwvzM1mpL7MCtXA3sBf\n3ABuT4GNAgMBAAECggEAA83v+yMnKaGQ/3Abc9GJskfMqFgCjd4JCm6dHiFcwRC+\n79HRAgIxx9rc3sw+XvjTNSh9O+wTrj8Fisdpq83+f7IhHUxXw6ZgWqvXgyjVZv9w\n/zJ4y+h9+50ORz8C7LzIabeUr9oZmIHIDg6WGqgxZ02Nmv3c9QG62k//33ZCDPz2\nynKOEhfUBy2iR4pXUO1IwZePB794hMyCogkEgJXJTzmnKEhSkqJl02sO+gmDdqf4\n9wSbLFES8FQCRJGwvxQ5ZUY1N11UyrlW4189bE7rNc/pVmx4tLWsE+2YDXn3Fty+\nYJ7QCMNmBV7UeIjUFVvT6L+hDajiydyVaXfdN5UGgQKBgQDCGoSWnsMqLXAJltOT\n3AedObHysXP7EVlDx986O72L2WiQGnisLi62wY49/hC5SlfGhRSc1YfvIkEjzueZ\nvEsefbcluphX30i1GEVPOk1Drln1t8doDy077zvmW7h6Oxcbnx5cDyymWe1W+7T0\nEjWAr4pWLF5lsFSZStCShCBxgQKBgQC1wS8ouOcFROa+EU4BsOU25owtLZ5dTy/Y\n+0c2ty2ygagX33GpBLc8PL7CbAEOzSEKeqw9t2EoTyibXq0D7YbOBwJ3D7jRmAhT\n2h1xjwz2bok8a5vcuovojW2nMFUKBeDbbdLfUJyrd863zmpZ9sNfc9opnhch44/z\nW8DMwmy+DQKBgQC3vlCbIKlRiPfRLAUXqCdRD6fDPXa0SgT9Y/yN7LWO6HzSRSzM\nmV9BQ9L6HkMIlDapR5tup7hpiDyvwBJ/9r4JnCo+vfeu30C9pb8es+smUar5L0LF\n3/ALF3nVpCfrFXrXe/ZKYVb8Fo7VU6tFjOM28XV8A75MdvJutmLg/9CSgQKBgQCX\nc1yqoDjRKTLk2mKYAiFd+AqCcurtcdi7A9e5fjYz8tpw2h5J6sYNCckjFQBkpwWL\nR+FSpAXvotaBcQjWpwyXjTu+nnkxHXCC/tNeFweEKWNt13VPHpsKsx7WG+4gpflS\nn1cCApgqQXEdtIDmajsuxMjbuQIpmQgQjzo+5Rvb2QKBgQCUKLabr22DojrvNyRN\nGdDgkqtA2xCDe8kPLxb/DJ25//esxSb8lcImRYRxvbAmnPj3muM1aogIkzEb+xZo\n8RUOi8TCMRRJBtQ58rOF+qC9jEaf8s1yQcWfOymbA07LevJtlNCt7u3w+Ma3oWvx\nRQHfL3B+YAXT7xiLOcyj/Zsw3A==\n-----END PRIVATE KEY-----\n"

# Email Configuration (Resend) - Opcional por enquanto
RESEND_API_KEY=
EMAIL_TO=info@dansautobodyma.com
EMAIL_FROM=portal@dansautobodyma.com

# NextAuth Configuration
NEXTAUTH_SECRET=Bp1OvEPrBpKb6+u2t4OwWKSDZOobp0Gi9sQadCwKYP4=
NEXTAUTH_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

## ✅ Passo 2: Compartilhar Planilha

**CRÍTICO:** Você precisa compartilhar a planilha com o service account!

1. Abra sua planilha no Google Sheets: https://docs.google.com/spreadsheets/d/1f84Je0PQTn-D93YQe1RWQeAHBQ8Uosyr8N7CCcKRifw
2. Clique em **"Compartilhar"** (botão azul no canto superior direito)
3. Adicione este email:
   ```
   clientportal@clientportal-485019.iam.gserviceaccount.com
   ```
4. Dê permissão de **"Visualizador"** (Viewer)
5. Clique em **"Enviar"** (Send)

## ✅ Passo 3: Verificar Estrutura da Planilha

Certifique-se de que sua planilha tem:

### Aba `allvehiclesmonday`:
- ✅ Coluna `RO` (RO Number)
- ✅ Coluna `Monday_Item_ID` (Password)
- ✅ Coluna `updates` (Status atual)
- ✅ Outras colunas (VIN, Name, Model, Year, Make, Phone, Email)

### Aba `updatelist`:
- ✅ Coluna A: `STATUS` (nome do status)
- ✅ Coluna B: `Message` (mensagem correspondente)

## ✅ Passo 4: Testar

```bash
npm run dev
```

Acesse: http://localhost:3000

Use credenciais reais da sua planilha:
- **RO Number**: Valor da coluna `RO`
- **Password**: Valor da coluna `Monday_Item_ID`

## 🆘 Problemas Comuns

### Erro: "Google Sheets credentials not configured"
- Verifique se o `.env.local` existe
- Verifique se as variáveis estão corretas

### Erro: "Vehicle not found"
- Verifique se compartilhou a planilha com o service account
- Verifique se RO Number e Password estão corretos
- Verifique se as colunas têm os nomes corretos (case-sensitive)

### Erro: "Status not found"
- Verifique se a coluna `updates` tem valores
- Verifique se a aba `updatelist` existe e tem dados

## 📞 Pronto!

Depois de configurar, o sistema vai funcionar 100% com Google Sheets! 🎉

