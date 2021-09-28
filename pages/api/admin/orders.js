// pages/api/admin/orders.js
import Order from "models/Order";
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
    const orders = await Order.find({}).populate('user', 'name');
    await db.disconnect();
    return res.send(orders);
  } catch(error) {
    await db.disconnect();
    return res.status(500).send({ message: error.message });    
  }
});

export default handler;
