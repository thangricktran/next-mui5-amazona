// pages/api/orders/index.js
import Order from "models/Order";
import Product from "models/Product";
import nc from "next-connect";
import { isAuth } from 'utils/auth';
import db from "utils/db";
import { onError } from 'utils/error';

const handler = nc({
  onError,
});

handler.use(isAuth);

const checkTotalAmount = async ({ itemsPrice, orderItems }) => {
  const clientItemsLength = orderItems.length; let clientItemsIDs = []; 
  let totalAmount = 0;

  if (!Array.isArray(orderItems) || clientItemsLength === "undefined" || 
    clientItemsLength <= 0) {
    return false;
  }
  orderItems.forEach((i) => clientItemsIDs.push(i._id));

  try {
    const products = await Product.find({ "_id" : { "$in" : [...clientItemsIDs] } });
    if (products.length > 0) {
      orderItems.forEach((item) => {
        products.forEach(p => {
          if ((p._id).toString() === (item._id).toString()) {
            p.sizes.forEach(s => {
              if ((s._id).toString() === item.sizeId) {
                totalAmount += Number.parseInt(item.quantity) * Number.parseFloat(s.price);
              }
            });
          }
        });
      });
      // totalAmount = totalAmount.toFixed(2);
      if (Math.abs(Number.parseFloat(totalAmount) - Number.parseFloat(itemsPrice)) <= 1) {
        return true;       
      } else {
        return false;        
      }
    }
    return false;
  } catch (error) {
    // console.log("pages/api/orders/index.js checkTotalAmount() db error \n", error);
    return false;
  }
};

handler.post(async (req, res) => {
  let proceedFlag = false;
  await db.connect();

  const { orderItems, itemsPrice } = req.body;

  if (Array.isArray(orderItems) && orderItems.length > 0) {
    proceedFlag = await checkTotalAmount({ itemsPrice, orderItems });
  }
  if (proceedFlag) {  
    const newOrder = new Order({
      ...req.body,
      user: req.user._id,
    });

    const order = await newOrder.save();
    await db.disconnect();
    res.status(201).send(order);
  } else {
    await db.disconnect();
    return res.status(400).send({ message: "Unable to process this order, please check price." });    
  }
});

export default handler;
