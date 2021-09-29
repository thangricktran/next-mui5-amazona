// pages/api/orders/[id]/index.js
import Order from "models/Order";
// import User from "models/User";
import nc from "next-connect";
import { isAuth } from "utils/auth";
import db from "utils/db";
import { onError } from 'utils/error';
import sgMail from '@sendgrid/mail';
import { emailOrderDeliveryStatus } from 'utils/simpleEmailTemplates';

sgMail.setApiKey(process.env.NEXT_APP_SENDGRID_MAIL);

const handler = nc({
  onError, 
});
handler.use(isAuth);

handler.put(async (req, res) => {
  await db.connect();
  const order = await Order.findById(req.query.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const deliveredOrder = await order.save();

    // send customer an email for change in order status to shipped
    const { recipient, emailSubject, orderTmpl } = emailOrderDeliveryStatus(deliveredOrder);
    const emailData = {
      to: [`${recipient}`],
      from: 'thangricktran2@gmail.com',
      subject: `${emailSubject}`,
      html: `${orderTmpl}`
    };
    await sgMail.send(emailData);
    // send an email to order admin that the order has been sent out
    const emailDataToAdmin = {
      to: ['thangricktran2@gmail.com'],
      from: 'thangricktran2@gmail.com',
      subject: `${emailSubject}`,
      html: `${orderTmpl}`
    };
    await sgMail.send(emailDataToAdmin);

    await db.disconnect();
    await res.send({ message: 'Order delivered', order: deliveredOrder });
  } else {
    await db.disconnect();
    return res.status(404).send({ message: "Order not found" });
  }

});


export default handler;