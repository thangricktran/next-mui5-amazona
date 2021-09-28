// pages/api/keys/stripe.js
import nc from "next-connect";
import { isAuth } from "utils/auth";
import Order from "models/Order";
import db from "utils/db";
import Stripe from 'stripe';

//const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

const handler = nc();
handler.use(isAuth);

handler.post(async (req, res) => {
  const orderId = req.body.id;
  await db.connect();

  try {
    const order = await Order.findById(orderId);
    if (order && (order._id).toString() === orderId 
          && order.paymentMethod === "Stripe" && !order.isPaid) {

      let paymentIntent;

      const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

      const params = Stripe.PaymentIntentCreateParams = {
        payment_method_types: ['card'],
        amount: order.totalPrice * 100,
        currency: "usd",
        // description: process.env.STRIPE_PAYMENT_DESCRIPTION ?? '',
      }

      paymentIntent = await stripe.paymentIntents.create(params)
      
      await db.disconnect();

      return res.status(200).json(paymentIntent);
    } 
    await db.disconnect();
  } catch (error) {
    await db.disconnect();
    return res.status(400).send({ message: error.message });    
  }
 
});

export default handler;
