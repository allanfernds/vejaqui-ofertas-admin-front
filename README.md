# VejaQui Ofertas — Painel do lojista

Frontend administrativo da plataforma **VejaQui Ofertas**. Este repositório é exclusivo do painel dos lojistas. O site público fica em outro projeto.

## Stack

- Next.js 16 (App Router)
- TypeScript (`strict`)
- Tailwind CSS + shadcn/ui
- React Hook Form + Zod
- TanStack Query
- Vitest + Testing Library

O frontend conversa apenas com a API Express (`vejaqui-ofertas-back`).

## Como rodar

```bash
cp .env.example .env.local
npm install
npm run dev
```

Variáveis públicas:

```
NEXT_PUBLIC_API_URL=http://localhost:3333/api/v1
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_API_KEY=
```

Nunca coloque `CLOUDINARY_API_SECRET` neste projeto.

## Scripts

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Autenticação (MVP)

Identidade atual: JWT da API (`POST /auth/register`, `POST /auth/login`, `GET /auth/me`).

A camada `AuthPort` + `JwtAuthAdapter` isola o provedor. Clerk **não** está instalado e pode entrar depois sem refatorar páginas.

O token fica em `sessionStorage` apenas no MVP. Páginas privadas usam `AuthGuard` client-side:

1. carrega a sessão local
2. se houver token, chama `GET /auth/me`
3. válido: renderiza o painel
4. inválido/401: limpa a sessão e vai para `/entrar`
5. enquanto verifica: skeleton (nada privado é mostrado)

**Dívida técnica:** evoluir para refresh token + cookie HttpOnly (ou provedor externo). Isso permitirá proteção server-side. Não leia o token de `sessionStorage` em Server Components.

## Contrato-alvo da API

O frontend já envia o contrato final. O backend precisa estar alinhado antes das telas correspondentes.

- Cadastro envia `termsAccepted`, `termsVersion`, `privacyPolicyAccepted`, `privacyPolicyVersion`. **Não envia `acceptedAt`.** O servidor grava a data.
- Empresa inclui e-mail comercial, WhatsApp e endereço completo, além de `logoUrl` / `logoPublicId`.
- CNPJ alfanumérico e numérico, com as mesmas regras oficiais da RFB.
- Upload: `POST /uploads/cloudinary/signature` e persistência de `publicId`.
- Edição de oferta: um único `PATCH /companies/:companyId/product-offers/:offerId`.
- Listagem: `GET /companies/:companyId/offers?search=&status=&page=&limit=`. `search` pesquisa pelo título do produto. `status=ENDED` / `expired=true` para encerradas.

## Textos legais

`/termos` e `/privacidade` existem e são versionados. Os textos são **rascunho para revisão jurídica** e não estão aprovados para produção.

## Fora deste MVP

- Pagamentos, planos, equipe, métricas avançadas, Clerk, exclusão de assets no Cloudinary, seletor de várias empresas.
