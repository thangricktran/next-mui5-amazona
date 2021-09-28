// pages/api/orders/[id]/pay.js
import Order from "models/Order";
import User from "models/User";
import nc from "next-connect";
import { isAuth } from "utils/auth";
import db from "utils/db";
import { onError } from 'utils/error';
import sgMail from '@sendgrid/mail';
import { emailOrderConfirmation } from 'utils/simpleEmailTemplates';
// import moment from 'moment';

sgMail.setApiKey(process.env.NEXT_APP_SENDGRID_MAIL);

const handler = nc({
  onError, 
});
handler.use(isAuth);

handler.put(async (req, res) => {
  await db.connect();
  const order = await Order.findById(req.query.id);
  if (order) {
    const user = await User.findById((order.user).toString());
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      email_address: user.email,
    };
    const paidOrder = await order.save();
    await db.disconnect();

    // send customer an email order confirmation
    const { recipient, emailSubject, orderTmpl } = emailOrderConfirmation(paidOrder);
    const emailData = {
      to: [`${recipient}`, 'thangricktran2@gmail.com'],
      from: 'thangricktran2@gmail.com',
      subject: `${emailSubject}`,
      html: `${orderTmpl}`
    };
    await sgMail.send(emailData);

    await res.send({ message: 'Order paid', order: paidOrder });
  } else {
    await db.disconnect();
    return res.status(404).send({ message: "Order not found" });
  }

});


export default handler;