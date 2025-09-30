import s from "./styles/orders-template.module.scss"


import BgImage from "@modules/account/components/BgImage"
import { HttpTypes } from "@medusajs/types"
import OrderOverview from "../components/order-overview"
import TransferRequestForm from "../components/transfer-request-form"

type ProfileTemplateProps = {
    orders: HttpTypes.StoreOrder[]
}

export const OrdersTemplate = ({ orders }: ProfileTemplateProps) => {
    return (
        <section className={s.content}>
            <div className={s.content} data-testid="orders-page-wrapper">
                <div className={s.header}>
                    <h1 className={s.title}>Objednávky</h1>
                    <Divider />
                    <p className={s.desc}>
                        Prohlédněte si své předchozí objednávky a jejich stav. Můžete si převést vaše staré objednávky před založení účtu na váš účet. Pokud je to nutné, můžete také vytvořit
                        reklamaci nebo výměny svých objednávek (zatím není k dispozici).
                    </p>
                </div>
                <div className={s.body}>
                    <OrderOverview orders={orders} />
                    <Divider />
                    <TransferRequestForm />
                </div>
            </div>
            <BgImage src="/assets/img/img/3.jpg" />
        </section>
    )
}
    
export default OrdersTemplate

const Divider = () => <div className={s.divider} />;