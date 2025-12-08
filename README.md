# Memoria — Your AI Memory Vault

*Upload any document. Ask anything. Get instant, semantically ranked answers.*

**Live Demo** → [https://memoria-hazel-ten.vercel.app/](https://memoria-hazel-ten.vercel.app/)

---

### Try it instantly
Upload any file from `/test-documents` and ask:

- “What’s the difference between Server and Client Components?”
- “How do Guards work in NestJS?”
- “How long do you cook ragù?”
- “What tomatoes for real pizza margherita?”

→ Memoria instantly finds the **most relevant document** using real semantic search
→ Click “Show content” to read the exact section

---

### What is Memoria?

Memoria is a **full-stack personal knowledge base** that lets you:

- Upload PDFs, TXT, DOCX, HTML files
- Automatically extract title & summary with **GPT-4o**
- Generate real embeddings with **OpenAI**
- Store everything in **PostgreSQL + pgvector**
- Search all uploaded documents with **natural language** — semantic search powered by vector similarity
- Beautiful, responsive UI built with **Next.js 16 + Tailwind + shadcn**

---

### Features

| Feature                        | Details |
|--------------------------------|--------|
| Drag & Drop File Upload        | PDF, TXT, DOCX, HTML |
| AI Title & Summary Extraction  | GPT-4o + structured JSON |
| Real Vector Embeddings         | `text-embedding-3-large` (1536 dim) |
| Semantic Search                | pgvector + cosine similarity |
| Live Search as You Type        | 400ms debounce |
| Beautiful UI                   | Gradient glassmorphism + animations |
| Full TypeScript                | End-to-end typesafety |

---

### Tech Stack

```text
Frontend
├── Next.js 16 (App Router + React Server Components)
├── Tailwind CSS + shadcn-style components
├── Apollo Client (queries) + raw fetch (uploads)
├── lucide-react icons

Backend
├── NestJS + GraphQL
├── Drizzle ORM + PostgreSQL + pgvector
├── OpenAI (GPT-4o + embeddings)

Database
├── PostgreSQL with pgvector extension

DevOps
├── Docker Compose (local DB)
```

---

### Project Structure

```bash
memoria/
├── backend/              # NestJS + GraphQL + Drizzle
├── frontend/             # Next.js 16 + Tailwind + Apollo
├── docker-compose.yml    # Local PostgreSQL + pgvector
└── README.md             # ← You are here
```

---

### Quick Start (Local)

```bash
# Clone & enter
git clone https://github.com/AlexiPaps/memoria.git
cd memoria

# Start PostgreSQL + pgvector
docker compose up -d

# Run Backend
cd backend
Create `.env` in `and add:

OPENAI_API_KEY=sk-...

# Install
pnpm install

# Run dev server
npm start

# Run Frontend
cd frontend

# Install
npm install 

# Run dev server
npm run dev
```

→ Open [http://localhost:3000](http://localhost:3000)


Drop a PDF → wait a few seconds → search anything in it.

---