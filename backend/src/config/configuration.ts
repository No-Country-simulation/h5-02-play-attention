export default () => ({
  jwt: {
    secret: process.env.SECRET_KEY || 'mysecret',
  },
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  frontend:{
    landing_url: process.env.FRONTEND_URL,
    platform_url: process.env.FRONTEND_PLATFORM_URL,
    crm_url: process.env.FRONTEND_CRM_URL,
  }


}); 