import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-muted/60 to-muted flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center space-y-8">

        {/* Logo / título */}
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground text-2xl font-bold mb-2">
            ✓
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Task Manager</h1>
          <p className="text-muted-foreground text-lg">
            Organize suas tarefas com simplicidade e eficiência.
          </p>
        </div>

        {/* Features */}
        <ul className="text-sm text-muted-foreground space-y-2 text-left inline-block">
          <li className="flex items-center gap-2">
            <span className="text-primary font-bold">✓</span>
            Crie e gerencie tarefas com título e descrição
          </li>
          <li className="flex items-center gap-2">
            <span className="text-primary font-bold">✓</span>
            Acompanhe o progresso: pendente, em andamento ou concluída
          </li>
          <li className="flex items-center gap-2">
            <span className="text-primary font-bold">✓</span>
            Acesse de qualquer lugar, seus dados sempre salvos
          </li>
        </ul>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="sm:w-40">
            <Link href="/register">Criar conta</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="sm:w-40">
            <Link href="/login">Entrar</Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Feito com Next.js, Node.js e PostgreSQL
        </p>

      </div>
    </div>
  )
}