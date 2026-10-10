# Task Manager Web

Frontend for a task management application built with Next.js, TypeScript and shadcn/ui.

## 🌐 Live Demo

**[task-manager-web-flame.vercel.app](https://task-manager-web-flame.vercel.app)**

## 🛠 Tech Stack

- **Next.js 15** — React framework with App Router
- **TypeScript** — static typing
- **Tailwind CSS v4** — utility-first styling
- **shadcn/ui** — accessible component library
- **Vercel** — cloud deployment

## 📋 Features

- Landing page with app overview
- User registration and login
- Dashboard with task list
- Create tasks with title and description
- Update task status: pending → in progress → done
- Filter tasks by status
- Logout with token cleanup

## ⚙️ Running locally

```bash
# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:3333

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🗂 Project structure

src/
├── app/
│ ├── page.tsx # Landing page
│ ├── login/page.tsx # Login
│ ├── register/page.tsx # Register
│ └── dashboard/page.tsx # Task dashboard
├── components/ui/ # shadcn/ui components
└── services/
└── api.ts # API client


## 🔗 Related

- [task-manager-api](https://github.com/macedcrazy/task-manager-api) — Backend repository