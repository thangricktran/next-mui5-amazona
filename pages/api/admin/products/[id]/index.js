// pages/api/admin/products/[id]/index.js
import Product from "models/Product";
import nc from "next-connect";
import { isAdmin, isAuth } from 'utils/auth';
import db from "utils/db";
import { onError } from 'utils/error';

const handler = nc({
  onError,
});

handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  try {
    const product = await Product.findById(req.query.id);
    await db.disconnect();
    return res.send(product);
  } catch(error) {
    await db.disconnect();
    return res.status(500).send({ message: error.message });    
  }
});

handler.put(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    product.name = req.body.name;
    product.slug = req.body.slug;
    product.price = req.body.price;
    product.category = req.body.category;
    product.image = req.body.image;
    product.featuredImage = req.body.featuredImage;
    product.isFeatured = req.body.isFeatured;
    product.brand = req.body.brand;
    // product.countInStock = req.body.countInStock;
    product.description = req.body.description;
    product.sizes = req.body.sizes;
    await product.save();
    await db.disconnect();
    res.send({ message: 'Product Updated Successfully' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Product Not Found' });
  }
});

handler.delete(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    await product.remove();
    await db.disconnect();
    res.send({ message: 'Product Deleted' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Product Not Found' });
  }
});

export default handler;
