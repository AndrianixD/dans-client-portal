# Guia de Testes - Portal do Cliente

Este documento explica como testar o sistema completo.

## 📝 Preparação dos Dados de Teste

### Google Sheets - Aba "Vehicles"

Adicione pelo menos um veículo de teste:

```
RO Number: TEST001
Email: teste@dansauto.com
VIN: 1HGBH41JXMN109186
Nome Cliente: João da Silva
Modelo: Civic
Ano: 2020
Marca: Honda
Telefone: (978) 123-4567
```

### Google Sheets - Aba "Messages"

Adicione mensagens para os estágios:

```
Stage: Vehicle Received
Message: Seu veículo foi recebido e está sendo inspecionado pela nossa equipe. Entraremos em contato em breve com mais detalhes.
Description: Fase inicial do processo

Stage: Inspection Complete
Message: A inspeção foi concluída. Estamos preparando o orçamento detalhado para você.
Description: Inspeção finalizada

Stage: Work in Progress
Message: Estamos trabalhando no reparo do seu veículo. Atualizaremos você sobre o progresso regularmente.
Description: Reparo em andamento

Stage: Quality Check
Message: O reparo foi concluído e estamos fazendo a verificação final de qualidade.
Description: Verificação de qualidade

Stage: Ready for Pickup
Message: Seu veículo está pronto para retirada! Entre em contato conosco para agendar.
Description: Finalizado
```

### Monday.com - Board

1. Crie um item no board com o RO Number "TEST001"
2. Configure a coluna de Status com um dos valores acima
3. Certifique-se de que o RO Number é encontrável

## 🧪 Testes Funcionais

### Teste 1: Página Inicial
```
URL: http://localhost:3000
Resultado Esperado: Redireciona automaticamente para /login
Status: [ ] Passou
```

### Teste 2: Login com Credenciais Válidas
```
URL: http://localhost:3000/login
Passos:
1. Digite "TEST001" no campo RO Number
2. Digite "teste@dansauto.com" no campo Email
3. Clique em "ACCESS PORTAL"

Resultado Esperado: Redireciona para /dashboard
Status: [ ] Passou
```

### Teste 3: Login com Credenciais Inválidas
```
URL: http://localhost:3000/login
Passos:
1. Digite "INVALID" no campo RO Number
2. Digite "invalido@email.com" no campo Email
3. Clique em "ACCESS PORTAL"

Resultado Esperado: Mostra erro "RO Number ou Email inválidos"
Status: [ ] Passou
```

### Teste 4: Dashboard - Informações do Veículo
```
URL: http://localhost:3000/dashboard (após login)
Verificar:
- [ ] RO Number exibido corretamente
- [ ] VIN exibido corretamente
- [ ] Modelo, ano e marca exibidos
- [ ] Nome do cliente no header

Status: [ ] Passou
```

### Teste 5: Dashboard - Status do Monday.com
```
URL: http://localhost:3000/dashboard (após login)
Verificar:
- [ ] Status atual é exibido
- [ ] Mensagem correspondente ao status é exibida
- [ ] Data de última atualização é mostrada

Status: [ ] Passou
```

### Teste 6: Enviar Mensagem
```
URL: http://localhost:3000/dashboard (após login)
Passos:
1. Rolar até "Envie uma Mensagem"
2. Digite: "Esta é uma mensagem de teste do portal"
3. Clicar em "Enviar Mensagem"

Verificar:
- [ ] Mensagem de sucesso é exibida
- [ ] Email chegou em info@dansautobodyma.com
- [ ] Email contém RO Number, VIN e mensagem
- [ ] Update foi adicionado no Monday.com (se configurado)

Status: [ ] Passou
```

### Teste 7: Validação de Mensagem Curta
```
URL: http://localhost:3000/dashboard (após login)
Passos:
1. Digite apenas "oi" no campo de mensagem
2. Tentar enviar

Resultado Esperado: Botão permanece desabilitado (menos de 10 caracteres)
Status: [ ] Passou
```

### Teste 8: Botão Atualizar
```
URL: http://localhost:3000/dashboard (após login)
Passos:
1. Clicar no botão "Atualizar" no header
2. Aguardar carregamento

Resultado Esperado: Dados são recarregados do servidor
Status: [ ] Passou
```

### Teste 9: Logout
```
URL: http://localhost:3000/dashboard (após login)
Passos:
1. Clicar no botão "Sair" no header

Resultado Esperado: Redireciona para /login
Status: [ ] Passou
```

### Teste 10: Acesso Direto ao Dashboard sem Login
```
URL: http://localhost:3000/dashboard (sem login prévio)
Resultado Esperado: Redireciona para /login
Status: [ ] Passou
```

## 📱 Testes Responsivos

### Mobile (375px)
```
- [ ] Layout adapta corretamente
- [ ] Botões são clicáveis
- [ ] Texto é legível
- [ ] Formulários funcionam
```

### Tablet (768px)
```
- [ ] Grid ajusta adequadamente
- [ ] Header responsivo
- [ ] Cards bem distribuídos
```

### Desktop (1920px)
```
- [ ] Conteúdo não ultrapassa max-width
- [ ] Espaçamento adequado
- [ ] Cards proporcionais
```

## 🔍 Testes de API (Usando curl ou Postman)

### API 1: Verificar Autenticação
```bash
curl -X POST http://localhost:3000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"roNumber":"TEST001","email":"teste@dansauto.com"}'

Resultado Esperado: 
{
  "success": true,
  "vehicleData": { ... }
}
```

### API 2: Buscar Veículo
```bash
curl "http://localhost:3000/api/vehicle/TEST001?email=teste@dansauto.com"

Resultado Esperado:
{
  "vin": "1HGBH41JXMN109186",
  "model": "Civic",
  ...
}
```

### API 3: Buscar Status
```bash
curl "http://localhost:3000/api/status/TEST001"

Resultado Esperado:
{
  "currentStage": "Vehicle Received",
  "message": "...",
  ...
}
```

### API 4: Enviar Mensagem
```bash
curl -X POST http://localhost:3000/api/messages/send \
  -H "Content-Type: application/json" \
  -d '{
    "roNumber":"TEST001",
    "email":"teste@dansauto.com",
    "message":"Mensagem de teste via API"
  }'

Resultado Esperado:
{
  "success": true,
  "message": "Mensagem enviada com sucesso"
}
```

## 🐛 Testes de Erro

### Erro 1: Google Sheets Indisponível
```
Simular: Desabilitar GOOGLE_SHEETS_ID temporariamente
Resultado Esperado: Erro amigável na tela
```

### Erro 2: Monday.com Indisponível
```
Simular: Token inválido do Monday
Resultado Esperado: Erro amigável, mas Google Sheets ainda funciona
```

### Erro 3: Resend Indisponível
```
Simular: API Key inválida do Resend
Resultado Esperado: Erro ao enviar mensagem, mas sistema não quebra
```

## ✅ Checklist Final

Antes de colocar em produção:

- [ ] Todos os testes funcionais passaram
- [ ] Testes de API funcionam
- [ ] Layout responsivo em todos os tamanhos
- [ ] Emails chegam corretamente
- [ ] Updates aparecem no Monday.com
- [ ] Mensagens de erro são amigáveis
- [ ] Performance é aceitável (< 3s carregamento)
- [ ] Variáveis de ambiente configuradas em produção
- [ ] HTTPS configurado
- [ ] Domínio configurado
- [ ] Backup do Google Sheets configurado

## 📊 Métricas de Performance

Usar Chrome DevTools (Lighthouse):

```
Performance: > 90
Accessibility: > 90
Best Practices: > 90
SEO: > 80
```

## 🔐 Testes de Segurança

- [ ] Não é possível acessar dados de outros clientes
- [ ] Tokens não são expostos no client-side
- [ ] CORS configurado adequadamente
- [ ] Headers de segurança configurados
- [ ] SQL injection não é possível (não usamos SQL direto)
- [ ] XSS não é possível (React sanitiza automaticamente)

## 📝 Notas

- Execute estes testes antes de cada deploy
- Mantenha dados de teste no Google Sheets
- Documente qualquer problema encontrado
- Teste em diferentes navegadores (Chrome, Firefox, Safari)

