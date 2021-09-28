import nc from 'next-connect';
import { isAdmin, isAuth } from 'utils/auth';
import Product from 'models/Product';
import db from 'utils/db';
import { onError } from 'utils/error';

const handler = nc({
  onError,
});

handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
});

handler.post(async (req, res) => {
  await db.connect();
  const newProduct = new Product({
    name: 'sample name',
    // slug: 'sample-slug-' + Math.random(),
    slug: 'sample-slug-' + new Date().getTime(),
    image: '/images/shirt1.jpg',
    price: 0,
    category: 'sample category',
    brand: 'sample brand',
    // countInStock: 0,
    description: 'sample description',
    sizes: [
      {name: 'Select', price: 0, countInStock: 0},
      {name: 'XS', price: 60, countInStock: 13},
      {name: 'S', price: 70, countInStock: 20},
      {name: 'M', price: 75, countInStock: 20},
      {name: 'L', price: 80, countInStock: 18},
      {name: 'XL', price: 85, countInStock: 5},
      {name: 'XXL', price: 85, countInStock: 3}
    ],
    rating: 0,
    numReviews: 0,
  });

  const product = await newProduct.save();
  await db.disconnect();
  res.send({ message: 'Product Created', product });
});

export default handler;
