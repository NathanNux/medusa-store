import { Button } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import s from "./style.module.scss"

const SignInPrompt = () => {
  return (
    <div className={s.root}>
      <div className={s.content}>
        <h2 className={s.title}>Máte již účet?</h2>
        <p className={s.desc}>Přihlaste se pro lepší zážitek.</p>
      </div>
      <div className={s.ctaWrap}>
        <LocalizedClientLink className={s.link} href="/account">
          <Button variant="secondary" className={s.button} data-testid="sign-in-button">
            Přihlásit se
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
