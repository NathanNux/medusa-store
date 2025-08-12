import { 
  authenticate,
  defineMiddlewares,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework/http"
import { PostStoreCreateWishlistItem } from "./store/customers/me/wishlists/items/validators"
import { SearchSchema } from "./store/products/search/route"
import { PostStoreReviewSchema } from "./store/reviews/route"
import { GetAdminReviewsSchema } from "./admin/reviews/route"
import { PostAdminUpdateReviewsStatusSchema } from "./admin/reviews/status/route"
import { GetStoreReviewsSchema } from "./store/products/[id]/reviews/route"
import { PostStoreCreateRestockSubscription } from "./store/restock-subscriptions/validators"
import { PostBundledProductsSchema } from "./admin/bundled-products/route"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"
import { PostCartsBundledLineItemsSchema } from "./store/carts/[id]/line-item-bundles/route"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/customers/me/wishlists/items",
      method: "POST",
      middlewares: [
        validateAndTransformBody(PostStoreCreateWishlistItem),
      ],
    },
    {
      matcher: "/store/products/search",
      method: ["POST"],
      middlewares: [
        validateAndTransformBody(SearchSchema),
      ],
    },
    {
      matcher: "/store/reviews",
      method: ["POST"], 
      middlewares: [
        authenticate("customer", ["session", "bearer"]),
        validateAndTransformBody(PostStoreReviewSchema)
      ]
    }, 
    {
      matcher: "/store/products/:id/reviews",
      methods: ["GET"],
      middlewares: [
        validateAndTransformQuery(GetStoreReviewsSchema, {
          isList: true,
          defaults: ["id", "rating", "title", "first_name", "last_name", "content", "created_at"]
        })
      ]
    },
    {
      matcher: "/admin/reviews",
      method: ["GET"],
      middlewares: [
        validateAndTransformQuery(GetAdminReviewsSchema, {
          isList: true,
          defaults: [
            "id",
            "title",
            "content",
            "rating",
            "product_id",
            "customer_id",
            "status",
            "created_at",
            "updated_at",
            "product.*",
          ]
        })
      ]
    },
    {
      matcher: "/admin/reviews/status",
      method: ["POST"],
      middlewares: [
        validateAndTransformBody(PostAdminUpdateReviewsStatusSchema)
      ]
    },
    {
      matcher: "/store/customers/resend-verification-email",
      method: ["POST"],
      middlewares: [authenticate("customer", ["session", "bearer"])],
    },
    {
      matcher: "/store/customers/upgrade-guest*",
    },
    {
      matcher: "/store/customers/soft-delete*",
      method: ["POST"],
      middlewares: [authenticate("customer", ["session", "bearer"])],
    },
    {
      matcher: "/store/restock-subscriptions",
      method: "POST",
      middlewares: [
        authenticate("customer", ["bearer", "session"], {
          allowUnauthenticated: true,
        }),
        validateAndTransformBody(PostStoreCreateRestockSubscription),
      ],
    },
    {
      matcher: "/admin/bundled-products",
      methods: ["POST"],
      middlewares: [
        validateAndTransformBody(PostBundledProductsSchema),
      ],
    },
    {
      matcher: "/admin/bundled-products",
      methods: ["GET"],
      middlewares: [
        validateAndTransformQuery(createFindParams(), {
          defaults: [
            "id", 
            "title", 
            "product.*", 
            "items.*", 
            "items.product.*",
          ],
          isList: true,
          defaultLimit: 15,
        }),
      ],
    },
    {
      matcher: "/store/carts/:id/line-item-bundles",
      methods: ["POST"],
      middlewares: [
        validateAndTransformBody(PostCartsBundledLineItemsSchema),
      ],
    },
    {
      matcher: "/store/bundle-products",
      methods: ["GET"],
      middlewares: [
        validateAndTransformQuery(createFindParams(), {
          defaults: [
            "id",
            "title",
            "items.*",
            "items.product.*",
          ],
          isList: true,
          defaultLimit: 15,
        }),
      ],
    },
  ],
})