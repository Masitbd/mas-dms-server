import dotenv from "dotenv";

dotenv.config();

export default {
  node_env: process.env.NODE_MODULE,
  port: process.env.PORT,
  solt: process.env.SOLT_ROUND,
  database_url: process.env.DATABASE_URL,
  fronted_url:
    process.env.NODE_MODULE === "development"
      ? process.env.FRONTEND_URL_DEV
      : process.env.FRONTEND_URL_PROD,
  mail_user: process.env.MAIL_USER,
  mail_secret: process.env.MAIL_SECRET,

  jwt: {
    access_secret: process.env.ACCESS_TOKEN,
    refresh_secret: process.env.REFRESH_TOKEN,
    expire_in: process.env.EXPIRES_IN,
    refres_expire_in: process.env.REFRESH_EXPIRES_IN,
  },
  sms: {
    api_key: process.env.API_KEY,
    sender_id: process.env.SENDER_ID,
    api_url: process.env.API_URL,
  },
};
