// pages/api/orders/history.js
import Order from "models/Order";
import nc from "next-connect";
import { isAuth } from 'utils/auth';
import db from "utils/db";
import { onError } from 'utils/error';

const handler = nc({
  onError,
});

handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();
  try {
    const orders = await Order.find({ user: req.user._id });
    // console.log("pages/api/orders/history.js orders: \n", orders);

    await db.disconnect();
    return res.send(orders);
  } catch(error) {
    await db.disconnect();
    return res.status(500).send({ message: error.message });    
  }
});

export default handler;
