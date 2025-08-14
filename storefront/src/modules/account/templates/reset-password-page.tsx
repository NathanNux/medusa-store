"use client"

import { sdk } from "@lib/config"
import { Button, Toaster, toast } from "@medusajs/ui"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeSlash } from "@medusajs/icons"

export default function ResetPasswordForm() {
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const router = useRouter()

  const searchParams = useMemo(() => {
    if (typeof window === "undefined") {
      return
    }
    return new URLSearchParams(window.location.search)
  }, [])
  const token = useMemo(() => {
    return searchParams?.get("token")
  }, [searchParams])
    const email = useMemo(() => {
    const value = searchParams?.get("email") ?? ""
    console.log("Decoded email:", value, typeof value)
    return value
  }, [searchParams])

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    if (!token) {
      toast.error("Missing token.")
      return
    }
    if (!password) {
      toast.error("Password is required.")
      return
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.")
      return
    }
    setLoading(true)

    sdk.auth.updateProvider("customer", "emailpass", {
      email,
      password,
    }, token)
    .then(() => {
      toast.success("Password reset successfully!")
      setSuccess(true)
    })
    .catch((error) => {
      toast.error(`Couldn't reset password: ${error.message}`)
    })
    .finally(() => {
      setLoading(false)
    })
  }

  // Auto-login handler
  const handleAutoLogin = async () => {
    if (!email || !password) return
    setLoginLoading(true)
    try {
      await sdk.auth.login("customer", "emailpass", {
        identifier: email,
        password,
      })
      toast.success("Logged in successfully!")
      router.push("/account")
    } catch (error: any) {
      toast.error(error?.message || "Login failed.")
    } finally {
      setLoginLoading(false)
    }
  }

  return (
   <section className="h-[100vh] w-[100vw] flex flex-col items-center justify-center">
     <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col items-center gap-4">
      <label>New Password</label>
      <div className="relative w-full">
        <input 
          placeholder="Password" 
          type={showPassword ? "text" : "password"}
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded pr-10"
          disabled={success}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2"
          tabIndex={-1}
          onClick={() => setShowPassword((v) => !v)}
        >
          {showPassword ? <EyeSlash /> : <Eye />}
        </button>
      </div>
      <label>Confirm Password</label>
      <div className="relative w-full">
        <input 
          placeholder="Confirm Password" 
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded pr-10"
          disabled={success}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2"
          tabIndex={-1}
          onClick={() => setShowConfirmPassword((v) => !v)}
        >
          {showConfirmPassword ? <EyeSlash /> : <Eye />}
        </button>
      </div>
      <Button variant="secondary" type="submit" disabled={loading || success}>
        Reset Password
      </Button>
      {success && (
        <Button
          variant="primary"
          type="button"
          onClick={handleAutoLogin}
          disabled={loginLoading}
        >
          {loginLoading ? "Logging in..." : "Go to My Account"}
        </Button>
      )}
      <Toaster />
    </form>
   </section>
  )
}