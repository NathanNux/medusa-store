import { Container } from "@medusajs/ui"
import s from "./style.module.scss"

import ChevronDown from "@modules/common/icons/chevron-down"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  return (
    <div data-testid="overview-page-wrapper" className={s.root}>
      <div className={s.contentVisibleOnSmall}>
        <div className={s.headerRow}>
          <span data-testid="welcome-message" data-value={customer?.first_name}>
            Dobrý den, {customer?.first_name}
          </span>
          <span className={s.headerSignedIn}>
            Přihlášen jako:{" "}
            <span className={s.fontSemibold} data-testid="customer-email" data-value={customer?.email}>
              {customer?.email}
            </span>
          </span>
        </div>
        <div className={s.section}>
          <div className={s.cardsWrap}>
            <div className={s.profileRow}>
              <div className={s.groupCol}>
                <h3 className={s.titleLarge}>Profil</h3>
                <div className={s.statRow}>
                  <span
                    className={s.statValueLarge}
                    data-testid="customer-profile-completion"
                    data-value={getProfileCompletion(customer)}
                  >
                    {getProfileCompletion(customer)}%
                  </span>
                  <span className={s.subtleUpper}>
                    Dokončeno
                  </span>
                </div>
              </div>

              <div className={s.groupCol}>
                <h3 className={s.titleLarge}>Adresy</h3>
                <div className={s.statRow}>
                  <span
                    className={s.statValueLarge}
                    data-testid="addresses-count"
                    data-value={customer?.addresses?.length || 0}
                  >
                    {customer?.addresses?.length || 0}
                  </span>
                  <span className={s.subtleUpper}>
                    Uloženo
                  </span>
                </div>
              </div>
            </div>

            <div className={s.ordersGroup}>
              <div className={s.ordersHeadingRow}>
                <h3 className={s.titleLarge}>Nedávné objednávky</h3>
              </div>
              <ul className={s.ordersList} data-testid="orders-wrapper">
                {orders && orders.length > 0 ? (
                  orders.slice(0, 5).map((order) => {
                    return (
                      <li
                        key={order.id}
                        data-testid="order-wrapper"
                        data-value={order.id}
                      >
                        <LocalizedClientLink
                          href={`/account/orders/details/${order.id}`}
                        >
                          <Container className={s.orderCard}>
                            <div className={s.orderGrid}>
                              <span className={s.fontSemibold}>Datum objednání</span>
                              <span className={s.fontSemibold}>
                                Číslo objednávky
                              </span>
                              <span className={s.fontSemibold}>
                                Celková částka
                              </span>
                              <span data-testid="order-created-date">
                                {new Date(order.created_at).toDateString()}
                              </span>
                              <span
                                data-testid="order-id"
                                data-value={order.display_id}
                              >
                                #{order.display_id}
                              </span>
                              <span data-testid="order-amount">
                                {convertToLocale({
                                  amount: order.total,
                                  currency_code: order.currency_code,
                                })}
                              </span>
                            </div>
                            <button className={s.orderOpenBtn} data-testid="open-order-button">
                              <span className="sr-only">
                                Přejít na objednávku #{order.display_id}
                              </span>
                              <ChevronDown className={s.rotateNeg90} />
                            </button>
                          </Container>
                        </LocalizedClientLink>
                      </li>
                    )
                  })
                ) : (
                  <span data-testid="no-orders-message">Žádné nedávné objednávky</span>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0

  if (!customer) {
    return 0
  }

  if (customer.email) {
    count++
  }

  if (customer.first_name && customer.last_name) {
    count++
  }

  if (customer.phone) {
    count++
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  if (billingAddress) {
    count++
  }

  return (count / 4) * 100
}

export default Overview



// WIP: need to add whislist component to show profile completion
// WIP: need to add payment methods component to show profile completion
// WIP: ADD here all other components that will contribute to UX 