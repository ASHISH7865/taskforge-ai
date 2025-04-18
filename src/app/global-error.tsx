'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="max-w-md">
          <AlertTriangle className="h-20 w-20 text-destructive mx-auto mb-6" />
          <h1 className="text-4xl font-bold tracking-tight mb-2">Something went wrong</h1>
          <p className="text-lg text-muted-foreground mb-8">
            An unexpected error has occurred. We&apos;ve been notified and are working to fix the issue.
          </p>
          <Button
            onClick={reset}
            size="lg"
            className="mx-auto"
          >
            Try again
          </Button>
        </div>
      </body>
    </html>
  )
}
