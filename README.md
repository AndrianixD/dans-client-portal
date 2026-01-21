# Dan's Auto Body - Client Portal

Portal de acompanhamento de reparos para clientes da Dan's Auto Body.

## Features

- **Client Portal**: Clientes acompanham status do reparo via RO Number + Password
- **Admin Portal**: Equipe faz upload de fotos diárias dos veículos
- **Auto Photo Cleanup**: Fotos antigas são automaticamente removidas

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Google Sheets
- **Image Storage**: Cloudinary
- **Deployment**: Google Cloud Run

## Environment Variables

```env
# Google Sheets
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password

# Cron (for photo cleanup)
CRON_SECRET=your-cron-secret
```

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Google Sheets Structure

### Tab: `allvehiclesmonday`
| Column | Description |
|--------|-------------|
| RO | RO Number |
| monday_item_id | Password for login |
| updates | Current status |
| photo_url | Vehicle photo URL |
| photo_date | Photo date |

### Tab: `customer-info`
| Column | Description |
|--------|-------------|
| RO | RO Number |
| Name | Client name |
| Insurance | Insurance company |
| Claim | Claim number |
| Vehicle | Vehicle description |

### Tab: `updatelist`
| Column | Description |
|--------|-------------|
| updates | Status name |
| message | Message for status |

## Deployment (Google Cloud)

### Build & Deploy
```bash
# Build with Cloud Build
gcloud builds submit --config cloudbuild.yaml

# Or deploy directly
gcloud run deploy dans-client-portal \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

### Set Environment Variables
```bash
gcloud run services update dans-client-portal \
  --set-env-vars "GOOGLE_SHEETS_CLIENT_EMAIL=..." \
  --set-env-vars "CLOUDINARY_CLOUD_NAME=..." \
  --region us-central1
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/verify` | POST | Verify login credentials |
| `/api/vehicle/[roNumber]` | GET | Get vehicle info |
| `/api/status/[roNumber]` | GET | Get vehicle status |
| `/api/admin/auth` | POST | Admin login |
| `/api/admin/vehicles` | GET | List active vehicles |
| `/api/admin/upload-photo` | POST | Upload vehicle photo |
| `/api/admin/cleanup-photos` | GET/DELETE | Photo cleanup |

## License

Private - Dan's Auto Body
