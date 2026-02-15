## Pulse

Rede social Pulse com Next.js 14 (App Router), TypeScript, Supabase e TailwindCSS.

### Stack
- Next.js 14 (App Router)
- TypeScript
- Supabase (Auth + Database)
- TailwindCSS

### Funcionalidades (em andamento)
- Autenticação
- Feed de tweets
- Curtidas, retweets e comentários
- Seguir usuários

## Como rodar

### 1) Instalar dependências

```bash
npm install
```

### 2) Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz com as chaves do Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=seu-projeto-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=seu-anon-key
```

### 2.1) Criar schema do banco

Execute o SQL do arquivo [supabase/schema.sql](supabase/schema.sql) no painel do Supabase.

### 3) Rodar o servidor de desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Scripts

- `npm run dev` – ambiente de desenvolvimento
- `npm run build` – build de produção
- `npm run start` – iniciar build de produção
- `npm run lint` – lint

## Deploy

Recomendado: Vercel
https://vercel.com/new
