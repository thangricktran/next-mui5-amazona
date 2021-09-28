// pages/api/products/index.js
import Product from "models/Product";
import nc from "next-connect";
import db from "utils/db";

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  // await res.json(products);
  await res.send(products);
});

export default handler;
