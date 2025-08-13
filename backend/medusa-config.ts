import { loadEnv, Modules, defineConfig } from '@medusajs/utils';
import { MeilisearchPluginOptions } from '@rokmohar/medusa-plugin-meilisearch'
import { ADMIN_CORS, ALGOLIA_API_KEY, ALGOLIA_APP_ID, ALGOLIA_PRODUCT_INDEX_NAME, AUTH_CORS, BACKEND_URL, COOKIE_SECRET, DATABASE_URL, JWT_EXPIRES_IN, JWT_SECRET, MEILISEARCH_ADMIN_KEY, MEILISEARCH_HOST, MINIO_ACCESS_KEY, MINIO_BUCKET, MINIO_ENDPOINT, MINIO_SECRET_KEY, REDIS_URL, RESEND_API_KEY, RESEND_FROM_EMAIL, SANITY_API_TOKEN, SANITY_PROJECT_ID, SANITY_STUDIO_URL, SEGMENT_WRITE_KEY, SENDGRID_API_KEY, SENDGRID_FROM_EMAIL, SHOULD_DISABLE_ADMIN, STORE_CORS, STORE_FRONTEND_URL, STRIPE_API_KEY, STRIPE_WEBHOOK_SECRET, WORKER_MODE } from './src/lib/constants';

console.log("backend url: ", BACKEND_URL)
loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  admin: {
    storefrontUrl: STORE_FRONTEND_URL,
    backendUrl: BACKEND_URL,
    disable: SHOULD_DISABLE_ADMIN,
  },
  projectConfig: {
    
    databaseUrl: DATABASE_URL,
    databaseLogging: false,
    redisUrl: REDIS_URL,
    workerMode: WORKER_MODE,
    http: {
      storeCors: STORE_CORS!,
      adminCors: ADMIN_CORS!,
      authCors: AUTH_CORS!,
      jwtSecret: JWT_SECRET!,
      jwtExpiresIn: JWT_EXPIRES_IN!,
      cookieSecret: COOKIE_SECRET!,
    }
  },
  modules: [
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "./src/modules/comgate",
            id: "comgate",
          },
        ],
        merchant: "497113",
        secret: "VnQ7tNhYZZCQRJeuUb6MDDqfNmnmYzIo",
        test: true,
        country: "CZ",
        curr: "CZK",
      }
    },
    {
      key: Modules.FILE,
      resolve: '@medusajs/file',
      options: {
        providers: [
          ...(MINIO_ENDPOINT && MINIO_ACCESS_KEY && MINIO_SECRET_KEY ? [{
            resolve: './src/modules/minio-file',
            id: 'minio',
            options: {
              endPoint: MINIO_ENDPOINT,
              accessKey: MINIO_ACCESS_KEY,
              secretKey: MINIO_SECRET_KEY,
              bucket: MINIO_BUCKET // Optional, default: medusa-media
            }
          }] : [{
            resolve: '@medusajs/file-local',
            id: 'local',
            options: {
              upload_dir: 'static',
              backend_url: `${BACKEND_URL}/static`
            }
          }])
        ]
      }
    },
    ...(REDIS_URL ? [{
      key: Modules.EVENT_BUS,
      resolve: '@medusajs/event-bus-redis',
      options: {
        redisUrl: REDIS_URL
      }
    },
    {
      key: Modules.WORKFLOW_ENGINE,
      resolve: '@medusajs/workflow-engine-redis',
      options: {
        redis: {
          url: REDIS_URL,
        }
      }
    }] : []),
    ...(SENDGRID_API_KEY && SENDGRID_FROM_EMAIL || RESEND_API_KEY && RESEND_FROM_EMAIL ? [{
      key: Modules.NOTIFICATION,
      resolve: '@medusajs/notification',
      options: {
        providers: [
          ...(SENDGRID_API_KEY && SENDGRID_FROM_EMAIL ? [{
            resolve: '@medusajs/notification-sendgrid',
            id: 'sendgrid',
            options: {
              channels: ['email'],
              api_key: SENDGRID_API_KEY,
              from: SENDGRID_FROM_EMAIL,
            }
          }] : []),
          ...(RESEND_API_KEY && RESEND_FROM_EMAIL ? [{
            resolve: './src/modules/resend',
            id: 'resend',
            options: {
              channels: ['email'],
              api_key: RESEND_API_KEY,
              from: RESEND_FROM_EMAIL,
            },
          }] : []),
        ]
      }
    }] : []),
    {
      resolve: "./src/modules/sanity",
      options: {
        api_token: SANITY_API_TOKEN,
        project_id: SANITY_PROJECT_ID,
        api_version: new Date().toISOString().split("T")[0],
        dataset: "production",
        studio_url: SANITY_STUDIO_URL,
        type_map: {
          product: "product",
        },
      },
    },
    {
      resolve: "./src/modules/wishlist",
    },
    {
      resolve: "@medusajs/medusa/analytics",
      options: {
        providers: [
          {
            resolve: "./src/modules/segment",
            id: "segment",
            options: {
              writeKey: SEGMENT_WRITE_KEY,
            },
          },
        ],
      },
    }, 
    {
      resolve: "@medusajs/medusa/fulfillment",
      options: {
        providers: [
          {
            resolve: "./src/modules/ceskaPostaFulfillment",
            id: "ceska-posta-fulfillment",
            options: {
              // Add any specific options for the fulfillment provider here
            },
          },
          {
            resolve: "./src/modules/zasilkovnaFulfillment",
            id: "packeta",
            options: {
              // Add any specific options for the fulfillment provider here
            },
          },
        ],
      },
    },
    // {
    //   resolve: "./src/modules/algolia",
    //   options: {
    //     appId: ALGOLIA_APP_ID!,
    //     apiKey: ALGOLIA_API_KEY!,
    //     productIndexName: ALGOLIA_PRODUCT_INDEX_NAME!,
    //   }
    // },
    {
      resolve: "./src/modules/product-review",
    },
    {
      resolve: "./src/modules/restock"
    },
    {
      resolve: "./src/modules/bundled-product",
    },
    ...(STRIPE_API_KEY && STRIPE_WEBHOOK_SECRET ? [{
      key: Modules.PAYMENT,
      resolve: '@medusajs/payment',
      options: {
        providers: [
          {
            resolve: '@medusajs/payment-stripe',
            id: 'stripe',
            options: {
              apiKey: STRIPE_API_KEY,
              webhookSecret: STRIPE_WEBHOOK_SECRET,
            },
          },
        ],
      },
    }] : [])
  ],
  plugins: [
  ...(MEILISEARCH_HOST && MEILISEARCH_ADMIN_KEY ? [{
      resolve: '@rokmohar/medusa-plugin-meilisearch',
      options: {
        config: {
          host: MEILISEARCH_HOST ?? '',
          apiKey: MEILISEARCH_ADMIN_KEY ?? '',
        },
        settings: {
          // The key is used as the index name in Meilisearch
          products: {
            // Required: Index type
            type: 'products',
            // Optional: Whether the index is enabled. When disabled:
            // - Index won't be created or updated
            // - Documents won't be added or removed
            // - Index won't be included in searches
            // - All operations will be silently skipped
            enabled: true,
            // Optional: Specify which fields to include in the index
            // If not specified, all fields will be included
            fields: ['id', 'title', 'description', 'handle', 'variant_sku', 'thumbnail'],
            indexSettings: {
              searchableAttributes: ['title', 'description', 'variant_sku'],
              displayedAttributes: ['id', 'handle', 'title', 'description', 'variant_sku', 'thumbnail'],
              filterableAttributes: ['id', 'handle'],
            },
            primaryKey: 'id',
            // Create your own transformer
            /*transformer: (product) => ({
              id: product.id,
              // other attributes...
            }),*/
          },
        },
        i18n: {
          // Choose one of the following strategies:

          // 1. Separate index per language
          // strategy: 'separate-index',
          // languages: ['en', 'fr', 'de'],
          // defaultLanguage: 'en',

          // 2. Language-specific fields with suffix
          strategy: 'field-suffix',
          languages: ['en', 'fr', 'de', 'cs', 'sk', 'pl'],
          defaultLanguage: 'cs',
          translatableFields: ['title', 'description'],
        },
      } satisfies MeilisearchPluginOptions
    }] : [])
  ]
})
