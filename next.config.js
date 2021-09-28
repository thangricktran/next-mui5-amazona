module.exports = {

  env: {
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    NEXT_APP_FEATURED_PRODUCTIONS_URL: process.env.NEXT_APP_FEATURED_PRODUCTIONS_URL,
  },
  reactStrictMode: true,
  images: { domains: ['res.cloudinary.com'] },
}
