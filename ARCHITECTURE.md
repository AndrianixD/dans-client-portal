# Arquitetura do Sistema - Portal do Cliente

## 📐 Visão Geral

O Portal do Cliente é uma aplicação Next.js que integra Google Sheets e Monday.com para fornecer aos clientes acesso em tempo real ao status dos seus veículos.

## 🏗️ Stack Tecnológica

### Frontend
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Lucide React** (ícones)

### Backend/APIs
- **Next.js API Routes** (serverless)
- **Google Sheets API** (googleapis)
- **Monday.com GraphQL API**
- **Resend** (email)

### Autenticação
- **localStorage** (sessão temporária)
- Futuro: NextAuth.js (em desenvolvimento)

## 📁 Estrutura de Pastas

```
dans-client-portal/
├── app/
│   ├── api/
│   │   ├── auth/verify/route.ts      # Verificação de login
│   │   ├── vehicle/[roNumber]/route.ts # Dados do veículo
│   │   ├── status/[roNumber]/route.ts  # Status Monday.com
│   │   └── messages/send/route.ts      # Envio de mensagens
│   ├── dashboard/
│   │   └── page.tsx                    # Dashboard do cliente
│   ├── login/
│   │   └── page.tsx                    # Página de login
│   ├── layout.tsx                      # Layout raiz
│   ├── page.tsx                        # Home (redireciona)
│   └── globals.css                     # Estilos globais
├── components/
│   ├── VehicleInfo.tsx                 # Card de info do veículo
│   ├── StatusTimeline.tsx              # Timeline de status
│   ├── MessageCard.tsx                 # Card de mensagem
│   └── ContactForm.tsx                 # Formulário de contato
├── lib/
│   ├── google-sheets.ts                # Cliente Google Sheets
│   ├── monday.ts                       # Cliente Monday.com
│   └── email.ts                        # Serviço de email
├── types/
│   └── monday.ts                       # Tipos TypeScript
└── public/                             # Assets estáticos
```

## 🔄 Fluxo de Dados

### 1. Autenticação
```
Cliente → /login
  ↓
Insere RO + Email
  ↓
POST /api/auth/verify
  ↓
Google Sheets API (verificação)
  ↓
Se válido: localStorage + redirect /dashboard
  ↓
Se inválido: Erro na tela
```

### 2. Dashboard - Carregamento
```
Cliente → /dashboard
  ↓
Verifica localStorage (sessão)
  ↓
GET /api/vehicle/[roNumber]
  ├── Google Sheets API
  └── Retorna: VIN, modelo, ano, etc
  ↓
GET /api/status/[roNumber]
  ├── Monday.com API (status atual)
  ├── Google Sheets API (mensagem do estágio)
  └── Retorna: status + mensagem + data
  ↓
Renderiza Dashboard
```

### 3. Envio de Mensagem
```
Cliente → Preenche formulário
  ↓
POST /api/messages/send
  ↓
Validações (RO + Email + Mensagem)
  ↓
├── Resend API (envia email)
└── Monday.com API (cria update) [opcional]
  ↓
Sucesso → Notificação na tela
```

## 🗄️ Fontes de Dados

### Google Sheets (Dados Estáticos)
**Propósito**: Armazenar informações básicas dos veículos e mensagens dos estágios

**Vantagens**:
- Fácil de editar
- Sem necessidade de banco de dados
- Compartilhável com equipe
- Backup automático do Google

**Desvantagens**:
- Escalabilidade limitada
- Performance com muitos registros
- Não é ideal para dados em tempo real

**Estrutura**:
```
Aba "Vehicles":
RO Number | Email | VIN | Nome | Modelo | Ano | Marca | Telefone

Aba "Messages":
Stage | Message | Description
```

### Monday.com (Dados Dinâmicos)
**Propósito**: Gerenciar workflow e status em tempo real

**Vantagens**:
- Atualização em tempo real
- Workflow visual
- Notificações automáticas
- Histórico de mudanças

**Desvantagens**:
- Requer API Token
- Custo por usuário
- Curva de aprendizado

**Board Structure**:
```
Colunas necessárias:
- RO Number (texto)
- Status (status/dropdown)
- Cliente (texto)
- Updates (automático)
```

## 🔐 Segurança

### Camadas de Segurança

1. **Autenticação Dupla**
   - RO Number + Email
   - Ambos devem existir no Google Sheets
   - Case-insensitive no email

2. **Validação de Sessão**
   - localStorage (client-side)
   - Verificação em cada API call
   - Expiração implícita (refresh)

3. **API Protection**
   - Validação de entrada
   - Rate limiting (futuro)
   - Sanitização de dados

4. **Variáveis de Ambiente**
   - Tokens nunca no client
   - .env.local no .gitignore
   - Diferentes configs para dev/prod

### Vulnerabilidades Conhecidas e Mitigações

| Vulnerabilidade | Risco | Mitigação |
|----------------|-------|-----------|
| Session Hijacking | Médio | localStorage (não ideal), migrar para JWT |
| Enumeração de RO | Baixo | Validação dupla (RO + Email) |
| API Abuse | Médio | Implementar rate limiting |
| XSS | Baixo | React sanitiza automaticamente |
| CSRF | Baixo | SameSite cookies (futuro) |

## 🚀 Performance

### Otimizações Implementadas

1. **Caching (Futuro)**
   - Cache de mensagens do Google Sheets
   - TTL: 5 minutos
   - Reduz chamadas à API

2. **Lazy Loading**
   - Componentes carregam sob demanda
   - Imagens otimizadas (Next.js)

3. **API Response Time**
   - Google Sheets: ~500ms
   - Monday.com: ~300ms
   - Resend: ~200ms
   - Total médio: ~1s

### Métricas Alvo

```
First Contentful Paint: < 1.5s
Time to Interactive: < 2.5s
Total Bundle Size: < 200KB
API Response: < 1s
```

## 🔄 Escalabilidade

### Cenários de Crescimento

#### Fase 1: MVP (Atual)
- Até 100 veículos simultâneos
- Google Sheets + Monday.com
- Funcional para começar

#### Fase 2: Expansão (Futuro)
- 100-1000 veículos
- Migrar para PostgreSQL/MongoDB
- Implementar cache (Redis)
- API Gateway

#### Fase 3: Escala (Futuro Distante)
- 1000+ veículos
- Microservices
- CDN para assets
- Load balancing

### Pontos de Melhoria

1. **Banco de Dados Real**
   - Substituir Google Sheets por PostgreSQL
   - Melhor performance e escalabilidade
   - Relacionamentos complexos

2. **Autenticação Robusta**
   - NextAuth.js completo
   - JWT tokens
   - Refresh tokens
   - 2FA (opcional)

3. **Real-time Updates**
   - WebSockets
   - Server-Sent Events
   - Notificações push

4. **Analytics**
   - Google Analytics
   - Mixpanel
   - Custom dashboards

5. **Testes Automatizados**
   - Jest (unit tests)
   - Playwright (e2e tests)
   - CI/CD pipeline

## 🛠️ Manutenção

### Tarefas Regulares

**Diárias**:
- Monitorar logs de erro
- Verificar emails chegando

**Semanais**:
- Backup do Google Sheets
- Verificar status do Monday.com
- Atualizar dependências (npm outdated)

**Mensais**:
- Security audit (npm audit)
- Performance review
- User feedback analysis

### Troubleshooting

**Problema**: Clientes não conseguem logar
- Verificar Google Sheets API
- Conferir RO Number e Email na planilha
- Verificar logs do servidor

**Problema**: Status não atualiza
- Verificar Monday.com API Token
- Conferir Board ID
- Verificar mapeamento de colunas

**Problema**: Emails não chegam
- Verificar Resend API Key
- Conferir domínio verificado
- Verificar spam

## 📚 Referências Técnicas

- [Next.js Documentation](https://nextjs.org/docs)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Monday.com API](https://developer.monday.com/api-reference)
- [Resend Documentation](https://resend.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contribuindo

Para adicionar novas funcionalidades:

1. Criar branch: `git checkout -b feature/nova-funcionalidade`
2. Desenvolver e testar
3. Atualizar documentação
4. Fazer PR para `main`
5. Code review
6. Merge após aprovação

## 📞 Contato

Para questões técnicas sobre a arquitetura, entre em contato com o desenvolvedor do sistema.

