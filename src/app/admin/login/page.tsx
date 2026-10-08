'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login, resetPassword } from './actions'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    
    const formData = new FormData(event.currentTarget)
    
    if (isForgotPassword) {
      const result = await resetPassword(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        setSuccess('Password reset link has been sent to your email.')
      }
      setIsLoading(false)
    } else {
      const result = await login(formData)
      if (result?.error) {
        setError(result.error)
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            {isForgotPassword ? 'Reset Password' : 'Admin Login'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isForgotPassword 
              ? 'Enter your email to receive a reset link' 
              : 'Sign in to manage your TopMarkah store'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1"
                placeholder="admin@example.com"
              />
            </div>

            {!isForgotPassword && (
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="mt-1"
                  placeholder="••••••••"
                />
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true)
                      setError(null)
                      setSuccess(null)
                    }}
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
                  >
                    Forgot your password?
                  </button>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-500 text-center font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="text-sm text-emerald-600 text-center font-medium bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading 
                ? (isForgotPassword ? 'Sending...' : 'Signing in...') 
                : (isForgotPassword ? 'Send Reset Link' : 'Sign in')}
            </Button>
            
            {isForgotPassword && (
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false)
                  setError(null)
                  setSuccess(null)
                }}
                className="w-full text-sm text-gray-600 hover:text-gray-900 text-center"
              >
                Back to login
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
