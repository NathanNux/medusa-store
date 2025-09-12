import { Metadata } from "next"
import s from "../styles/orders.module.scss"

import OrderOverview from "@modules/account/components/order-overview"
import { notFound } from "next/navigation"
import { listOrders } from "@lib/data/orders"
import Divider from "@modules/common/components/divider"
import TransferRequestForm from "@modules/account/components/transfer-request-form"
import BgImage from "@modules/account/components/BgImage"


export const metadata: Metadata = {
  title: "Orders",
  description: "Overview of your previous orders.",
}

export default async function Orders() {
  const orders = await listOrders()

  if (!orders) {
    notFound()
  }

  return (
    <main className={s.root}>
      <div className={s.content} data-testid="orders-page-wrapper">
        <div className={s.header}>
          <h1 className={s.title}>Orders</h1>
          <p className={s.desc}>
            View your previous orders and their status. You can also create
            returns or exchanges for your orders if needed.
          </p>
        </div>
        <div className={s.body}>
          <OrderOverview orders={orders} />
          <Divider className={s.dividerSpacing} />
          <TransferRequestForm />
        </div>
      </div>
      <BgImage src="/assets/img/img/3.jpg" />
    </main>
  )
}
