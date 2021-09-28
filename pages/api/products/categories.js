// pages/api/products/categories.js
import Product from "models/Product";
import nc from "next-connect";
import db from "utils/db";

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  const categories = await Product.find().distinct('category');
  await db.disconnect();

  await res.send(categories);
});

export default handler;
