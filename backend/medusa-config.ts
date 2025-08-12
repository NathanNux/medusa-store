import { loadEnv, Modules, defineConfig } from '@medusajs/utils';
import {
  ADMIN_CORS,
  AUTH_CORS,
  BACKEND_URL,
  COOKIE_SECRET,
  DATABASE_URL,
  JWT_SECRET,
  REDIS_URL,
  RESEND_API_KEY,
  RESEND_FROM_EMAIL,
  SENDGRID_API_KEY,
  SENDGRID_FROM_EMAIL,
  SHOULD_DISABLE_ADMIN,
  STORE_CORS,
  STRIPE_API_KEY,
  STRIPE_WEBHOOK_SECRET,
  WORKER_MODE,
  MINIO_ENDPOINT,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MINIO_BUCKET,
  MEILISEARCH_HOST,
  MEILISEARCH_ADMIN_KEY,
  STORE_FRONTEND_URL,
  JWT_EXPIRES_IN,
  SANITY_API_TOKEN,
  SANITY_PROJECT_ID,
  SANITY_STUDIO_URL,
  SEGMENT_WRITE_KEY
} from './src/lib/constants';

loadEnv(process.env.NODE_ENV, process.cwd());

// Type definition for Meilisearch plugin options
interface MeilisearchPluginOptions {
  config: {
    host: string;
    apiKey: string;
  };
  settings: {
    products: {
      type: string;
      enabled: boolean;
      fields: string[];
      indexSettings: {
        searchableAttributes: string[];
        displayedAttributes: string[];
        filterableAttributes: string[];
      };
      primaryKey: string;
    };
  };
  i18n: {
    strategy: 'separate-index' | 'field-suffix';
    languages: string[];
    defaultLanguage: string;
    translatableFields: string[];
  };
}

const medusaConfig = {
  projectConfig: {
    databaseUrl: DATABASE_URL,
    databaseLogging: false,
    redisUrl: REDIS_URL,
    workerMode: WORKER_MODE,
    http: {
      adminCors: ADMIN_CORS,
      authCors: AUTH_CORS,
      storeCors: STORE_CORS,
      jwtSecret: JWT_SECRET,
      cookieSecret: COOKIE_SECRET,
      jwtExpiresIn: JWT_EXPIRES_IN,
    },
    build: {
      rollupOptions: {
        external: ["@medusajs/dashboard"]
      }
    }
  },
  admin: {
    backendUrl: BACKEND_URL,
    frontendUrl: STORE_FRONTEND_URL,
    disable: SHOULD_DISABLE_ADMIN,
  },
  modules: [
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
    }] : []),
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
  ],
  plugins: [
  ...(MEILISEARCH_HOST && MEILISEARCH_ADMIN_KEY ? [{
      resolve: '@rokmohar/medusa-plugin-meilisearch',
      options: {
        config: {
          host: process.env.MEILISEARCH_HOST ?? '',
          apiKey: process.env.MEILISEARCH_API_KEY ?? '',
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
};

console.log(JSON.stringify(medusaConfig, null, 2));
export default defineConfig(medusaConfig);
