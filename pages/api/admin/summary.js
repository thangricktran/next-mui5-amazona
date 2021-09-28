// pages/api/admin/summary.js
import Order from "models/Order";
import Product from "models/Product";
import User from "models/User";
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
    const ordersCount = await Order.countDocuments();
    const productsCount = await Product.countDocuments();
    const usersCount = await User.countDocuments();
    // console.log("pages/api/admin/summary.js ordersCount: \n", ordersCount);
    // console.log("pages/api/admin/summary.js productsCount: \n", productsCount);
    // console.log("pages/api/admin/summary.js usersCount: \n", usersCount);

    const ordersPriceGroup = await Order.aggregate([
      {
        $group: {
          _id: null,
          sales: { $sum: '$totalPrice' },
        },
      },
    ]);
    // console.log("pages/api/admin/summary.js ordersPriceGroup: \n", ordersPriceGroup);

    const ordersPrice = 
      ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;
    // console.log("pages/api/admin/summary.js ordersPrice: \n", ordersPrice);

    const salesData = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);
    // console.log("pages/api/admin/summary.js salesData: \n", salesData);

    await db.disconnect();
    return res.send({ ordersCount, productsCount, usersCount, ordersPrice, salesData });
  } catch(error) {
    await db.disconnect();
    return res.status(500).send({ message: error.message });    
  }
});

export default handler;
