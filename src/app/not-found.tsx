'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { FileQuestion, ChevronLeft } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <FileQuestion className="h-20 w-20 text-muted-foreground mb-6" />
      <h1 className="text-4xl font-bold tracking-tight mb-2">Page not found</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => router.back()} variant="outline" className="gap-2">
          <ChevronLeft className="h-4 w-4" />
          Go back
        </Button>
        <Button asChild>
          <Link href="/">
            Return home
          </Link>
        </Button>
      </div>
    </div>
  )
}
