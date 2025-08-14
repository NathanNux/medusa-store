"use client"

import { sdk } from "@lib/config"
import { Button, Toaster, toast } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useState } from "react"

export default function RequestResetPassword() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    if (!email) {
      toast.error("Email je povinné pole.")
      return
    }
    setLoading(true)

    sdk.auth.resetPassword("customer", "emailpass", {
      identifier: email,
    })
    .then(() => {
      toast.success("Pokud existuje účet s tímto e-mailem, obdržíte instrukce k obnovení hesla.")
    })
    .catch((error) => {
      toast.error(error.message)
    })
    .finally(() => {
      setLoading(false)
    })
  }

  return (
    <section className="h-[100vh] w-[100vw] flex flex-col items-center justify-center">
     <div className="w-full h-[20%] gap-5 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <div className="w-full h-fit flex flex-col items-center justify-center">
          <p className="text-base-regular text-ui-fg-base">
            Enter your email address below to receive a link to reset your password.
          </p>
          <p className="text-base-regular text-ui-fg-base">
            If you don't receive an email, please check your spam folder.
          </p>
          <p className="text-base-regular text-ui-fg-base">
            If you don't have an account, please{" "}
            <LocalizedClientLink href="/register" className="underline">
              register
            </LocalizedClientLink>.
          </p>
          <p className="text-base-regular text-ui-fg-base">
            If you remember your password, you can{" "}
            <LocalizedClientLink href="/login" className="underline">
              sign in
            </LocalizedClientLink>.
          </p>
        </div>
     </div>
     <div className="w-full h-[30%] flex items-center justify-center">
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-[40%] ">
          <label>Email</label>
          <input 
            placeholder="Email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="w-[50%] p-2 border border-gray-300 rounded"
          />
          <Button variant="secondary" type="submit" disabled={loading}>
            Request Password Reset
          </Button>
        </form>
     </div>
     <Toaster />
    </section>
  )
}