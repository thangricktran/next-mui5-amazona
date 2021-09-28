// pages/api/products/featuredproducts.js
import Product from "models/Product";
import nc from "next-connect";
import db from "utils/db";

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();

  const featuredProducts = await Product.find(
    { isFeatured: true },
    '-reviews'
  )
    .lean();
    // .limit(3);
  // const featuredProducts = JSON.parse(JSON.stringify(featuredProductsDocs));

  await db.disconnect();
  await res.send(featuredProducts);
});

export default handler;
