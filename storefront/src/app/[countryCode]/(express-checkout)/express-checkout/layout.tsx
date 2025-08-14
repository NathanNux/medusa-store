import { clx } from "@medusajs/ui"
import { Inter, Roboto_Mono } from "next/font/google"
import { RegionProvider } from "@lib/context/region"
import { CartProvider } from "@lib/context/cart"
import { SecondCol } from "@modules/express-checkout/SecondCol"

export default function Layout ({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <section className="bg-ui-bg-subtle w-full h-full">
        <div className={clx(
          "flex justify-center items-center min-h-screen w-full",
        )}>
          <RegionProvider>
            <CartProvider>
              <div className={clx(
                "flex gap-2 lg:my-16 my-4",
                "lg:w-[758px] lg:mx-auto w-full mx-4 flex items-center justify-center",
              )}>
                <div className="flex flex-col gap-2 lg:w-1/2 w-full items-center justify-center">
                  {children}
                </div>
                {/* <SecondCol /> */}
              </div>
            </CartProvider>
          </RegionProvider>
        </div>
      </section>
    </>
  )
}