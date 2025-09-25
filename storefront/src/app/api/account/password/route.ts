import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sdk } from "@lib/config"
import { retrieveCustomer } from "@lib/data/customer"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { old_password, new_password, confirm_password } = body || {}

    if (!old_password || !new_password || !confirm_password) {
      return NextResponse.json({ message: "Vyplňte prosím všechna pole" }, { status: 400 })
    }
    if (new_password !== confirm_password) {
      return NextResponse.json({ message: "Nová hesla se neshodují" }, { status: 400 })
    }
    if (typeof new_password !== "string" || new_password.length < 8) {
      return NextResponse.json({ message: "Nové heslo musí mít alespoň 8 znaků" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const token = cookieStore.get("_medusa_jwt")?.value
    const pk = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
    if (!token) {
      return NextResponse.json({ message: "Nejste přihlášen" }, { status: 401 })
    }

    // Zjisti email přihlášeného zákazníka
    const customer = await retrieveCustomer({ forceFresh: true })
    const email = customer?.email
    if (!email) {
      return NextResponse.json({ message: "Nelze načíst uživatele" }, { status: 400 })
    }

    // 1) Ověř staré heslo pokusem o přihlášení
    try {
      await sdk.auth.login("customer", "emailpass", { email, password: old_password })
    } catch (e: any) {
      return NextResponse.json({ message: "Staré heslo není správné" }, { status: 400 })
    }

    // 2) Změň heslo – použij Medusa auth endpoint (pokud je k dispozici)
    try {
      await sdk.client.fetch(`/auth/customer/password`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          ...(pk ? { "x-publishable-api-key": pk, "x-publishable-key": pk } : {}),
        },
        body: { password: new_password },
      })
    } catch (e: any) {
      // Fallback: pokud by endpoint nebyl dostupný, vrať srozumitelnou zprávu
      return NextResponse.json(
        { message: "Změna hesla není aktuálně dostupná. Kontaktujte podporu." },
        { status: 501 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || "Došlo k chybě" }, { status: 500 })
  }
}
