const dotenv = require("dotenv");

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {}

// CORS when consuming Medusa from admin
const ADMIN_CORS =
  process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "http://localhost:8000";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://localhost/medusa-starter-default";

const plugins = [
  'medusa-fulfillment-manual',
  'medusa-payment-manual',
  {
    resolve: "@medusajs/file-local",
    options: {
      upload_dir: "uploads",
    },
  },

  {
    resolve: "@medusajs/admin",
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      autoRebuild: true,
      develop: {
        open: process.env.OPEN_BROWSER !== "false",
      },
    },
  },

  {
    resolve: 'medusa-plugin-sendgrid',
    options: {
      api_key: process.env.SENDGRID_API_KEY,
      from: process.env.SENDGRID_FROM,
      order_placed_template: 
        process.env.SENDGRID_ORDER_PLACED_ID,
      localization: {
        "de-DE": { // locale key
          order_placed_template:
            process.env.SENDGRID_ORDER_PLACED_ID_LOCALIZED,
        },
      },
    },
  },


  {
    resolve: 'medusa-payment-paypal',
    options: {
      sandbox: process.env.PAYPAL_SANDBOX,
      client_id: process.env.PAYPAL_CLIENT_ID,
      client_secret: process.env.PAYPAL_CLIENT_SECRET,
      auth_webhook_id: process.env.PAYPAL_AUTH_WEBHOOK_ID,
    },
  },
  {
    resolve: 'medusa-payment-stripe',
    options: {
      api_key: process.env.STRIPE_API_KEY,
      webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
    },
  },
  
  {
    resolve: 'medusa-plugin-dashboard',
    options: {
      enableUI: true,
    },
  },
/*
  {
    resolve: medusa-plugin-custom-dashboard,
    options: {
        enableUI: true,
    },
},
*/
{
  resolve: 'medusa-plugin-abandoned-cart',
  /** @type {import('medusa-plugin-abandoned-cart').PluginOptions} */
  options: {
    from: process.env.SENDGRID_FROM,
    subject: "You have something in your cart", // optional
    templateId: process.env.SENDGRID_ABANDONED_CART_TEMPLATE,
    enableUI: true,
    localization: {
      "de-DE": {
        subject: "Sie haben etwas in Ihrem Warenkorb gelassen",
        templateId: process.env.SENDGRID_ABANDONED_CART_DE_TEMPLATE,
      },
    },
  },
},

'medusa-plugin-product-reviews',
{
  resolve: 'medusa-storage-supabase',
  options: {
    referenceID: process.env.STORAGE_BUCKET_REF,
    serviceKey: process.env.STORAGE_SERVICE_KEY,
    bucketName: process.env.BUCKET_NAME,
  },
},

{
  resolve: 'medusa-plugin-restock-notification',
  options: {
    trigger_delay: 0,
    inventory_required: 0
  },
},
'medusa-plugin-wishlist',
{
  resolve: 'medusa-plugin-segment',
  options: {
    write_key: process.env.SEGMENT_WRITE_KEY,
  },
},

{
  resolve: 'medusa-plugin-algolia',
  options: {
    applicationId: process.env.ALGOLIA_APP_ID,
    adminApiKey: process.env.ALGOLIA_ADMIN_API_KEY,
    settings: {
      products: {
        indexSettings: {
          searchableAttributes: ["title", "description"],
          attributesToRetrieve: [
            "id",
            "title",
            "description",
            "handle",
            "thumbnail",
            "variants",
            "variant_sku",
            "options",
            "collection_title",
            "collection_handle",
            "images",
          ],
        },
        transformer: (product) => ({ 
          id: product.id, 
          // other attributes...
        }),
      },
    },
  },
},

{
  resolve: `medusa-plugin-sendgrid`,
  options: {
    api_key: process.env.SENDGRID_API_KEY,
    from: process.env.SENDGRID_FROM,
    order_placed_template: 
      process.env.SENDGRID_ORDER_PLACED_ID,
    localization: {
      "de-DE": { // locale key
        order_placed_template:
          process.env.SENDGRID_ORDER_PLACED_ID_LOCALIZED,
      },
    },
  },
},

{
  resolve: `medusa-file-minio`,
  options: {
      endpoint: process.env.MINIO_ENDPOINT,
      bucket: process.env.MINIO_BUCKET,
      access_key_id: process.env.MINIO_ACCESS_KEY,
      secret_access_key: process.env.MINIO_SECRET_KEY,
  },
},
]

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  store_cors: STORE_CORS,
  database_url: DATABASE_URL,
  admin_cors: ADMIN_CORS,
  // Uncomment the following lines to enable REDIS
  /*redis_url: REDIS_URL*/
};

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig: {
    database_url: DATABASE_URL,
    database_type: "postgres",
    store_cors: STORE_CORS,
    admin_cors: ADMIN_CORS,
  },
  plugins,
};