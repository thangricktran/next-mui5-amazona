// pages/api/orders/[id]/index.js
import Order from "models/Order";
import nc from "next-connect";
import { isAuth } from "utils/auth";
import db from "utils/db";

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();
  const order = await Order.findById(req.query.id);
  await db.disconnect();

  if ((order.user).toString() === req.user._id || req.user.isAdmin) {
    await res.send(order);
  } else {
    return res.status(400).send({ message: "Unauthorized request. user id mismatched" });
  }  
});


export default handler;