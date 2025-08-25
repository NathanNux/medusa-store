"use client"

import { resetOnboardingState } from "@lib/data/onboarding"
import { Button, Container } from "@medusajs/ui"
import styles from "../styles/onboarding-cta.module.scss"

const OnboardingCta = ({ orderId }: { orderId: string }) => {
  return (
    <Container className={styles.container}>
      <div className={styles.inner}>
        <p className={styles.title}>Vaše objednávka byla úspěšně vytvořena! 🎉</p>
        <p className={styles.subtitle}>
          Nyní můžete dokončit nastavení svého obchodu v administraci.
        </p>
        <Button
          className={styles.cta}
          size="xlarge"
          onClick={() => resetOnboardingState(orderId)}
        >
          Dokončit nastavení v administraci
        </Button>
      </div>
    </Container>
  )
}

export default OnboardingCta
