# ZAYEH

Loja em React + Vite no frontend e Express + Prisma no backend.

## Rodar local

Frontend:

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

Backend:

```bash
cd backend
npm install
npm run dev
```

URLs locais:

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:3333/health`

## Build

Frontend:

```bash
npm run lint
npm run build
```

Backend:

```bash
cd backend
npm run build
```

## Produção

Preencha as variáveis de ambiente usando:

- [backend/.env.example](/C:/Users/Calebe/Desktop/SUN/backend/.env.example:1)
- [.env.production.example](/C:/Users/Calebe/Desktop/SUN/.env.production.example:1)

Campos obrigatórios para checkout:

- `PUBLIC_SITE_URL`
- `MERCADOPAGO_ACCESS_TOKEN`
- `MERCADOPAGO_WEBHOOK_SECRET`

Webhook do Mercado Pago:

- `https://zayeh.com.br/api/payments/mercadopago/webhook`

## Docker

Desenvolvimento:

```bash
docker compose up -d
```

Produção:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

## VPS

Arquivos prontos em:

- [deploy/vps/bootstrap.sh](/C:/Users/Calebe/Desktop/SUN/deploy/vps/bootstrap.sh:1)
- [deploy/vps/deploy.sh](/C:/Users/Calebe/Desktop/SUN/deploy/vps/deploy.sh:1)
- [deploy/vps/sync.sh](/C:/Users/Calebe/Desktop/SUN/deploy/vps/sync.sh:1)
- [deploy/nginx/zayeh.conf](/C:/Users/Calebe/Desktop/SUN/deploy/nginx/zayeh.conf:1)

Antes de usar na VPS, troque:

- domínio final
- URL real do repositório Git
- secrets de produção
