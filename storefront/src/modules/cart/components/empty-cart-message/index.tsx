import InteractiveLink from "@modules/common/components/interactive-link"
import s from "./style.module.scss"
import InteractiveLinkButton from "@modules/common/components/Buttons/interactiveLink-button"

const EmptyCartMessage = () => {
  return (
    <div className={s.root} data-testid="empty-cart-message">
      <h1 className={s.title}>Košík</h1>
      <p className={s.desc}>
        Ve vašem košíku není nic. Změňte to, použijte odkaz níže a začněte procházet naše produkty.
      </p>
      <div>
        <InteractiveLinkButton href="/store" text="Prozkoumat produkty" />
      </div>
    </div>
  )
}

export default EmptyCartMessage
