'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function Error({
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
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <AlertCircle className="h-20 w-20 text-amber-500 mb-6" />
      <h1 className="text-4xl font-bold tracking-tight mb-2">Oops! Something went wrong</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        There was an error loading this page. Please try again or contact support if the problem persists.
      </p>
      <Button
        onClick={reset}
        size="lg"
      >
        Try again
      </Button>
    </div>
  )
}
