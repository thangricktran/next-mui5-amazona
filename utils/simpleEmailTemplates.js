// import React from 'react';
import moment from 'moment';

export const formatShippingAddress = (shippingAddress) => {

  let fString = '<table border="0" cellspacing="0" cellpadding="0">';
  fString = `${fString}<tr><td>Street: </td><td>${shippingAddress.address}</td></tr>`;
  fString = `${fString}<tr><td>City:  </td><td>${shippingAddress.city}</td></tr>`;
  fString = `${fString}<tr><td>State: </td><td>${shippingAddress.state}</td></tr>`;
  fString = `${fString}<tr><td>Zip Code: </td><td>${shippingAddress.postalCode}</td></tr>`;
  fString = `${fString}<tr><td>Country: </td><td>${shippingAddress.country}</td></tr>`;
  fString = `${fString}</table>`;

  return fString;
};

export const formatOrderItems = (order) => {
  const tableHeader = `<table border="0" cellspacing="0" cellpadding="0">
                        <caption>Products Ordered</caption>
                          <tr>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Product(Last 4)ID</th>
                          </tr>
                        `;

  const orderTmpl = order.orderItems.map((p) => {
    return `<tr>
              <td>${p.name}</td>
              <td>$ ${(Number.parseFloat(p.price)).toFixed(2)}</td>
              <td>&nbsp;&nbsp;&nbsp;${p.quantity}</td>
              <td>${(p._id).toString().substring(20,24)}</td>
            </tr>`;
  });
  const tableEnd = `</table>`;
  const finalOrderTmpl = `${tableHeader}${orderTmpl}${tableEnd}`;

  return finalOrderTmpl;
};

export const emailOrderConfirmation = (order) => {
  //Ex. moment(dateStamp).format('MM/DD/YYYY');
  const newOrder = order;

  const recipient = newOrder.paymentResult.email_address;
  const fromCompany = 'Next Amazona';
  const emailSubject = `Thanks For Shopping at ${fromCompany} Online`;
  const adminStaff = `${fromCompany} Online Staff`;
  const taxAmount = newOrder.taxPrice ? newOrder.taxPrice : 0;
  const shippingAmount = newOrder.shippingPrice ? newOrder.shippingPrice : 0;

  const orderTmpl = `Order ID: ${newOrder._id} <br />
  Tax: $ ${Number.parseFloat(taxAmount).toFixed(2)}<br />
  Shipping: $ ${Number.parseFloat(shippingAmount).toFixed(2)}<br />
  Subtotal Amount: $ ${Number.parseFloat(newOrder.itemsPrice).toFixed(2)}<br />
  Total Amount: $ ${Number.parseFloat(newOrder.totalPrice).toFixed(2)}<br />
  Ordered paid on: ${moment(newOrder.paidAt).format('LLLL')}<br />
  Payment type: ${newOrder.paymentMethod}<br />
  Delivery address: <br />
  <br />${formatShippingAddress(newOrder.shippingAddress)}<br />
  Total items in this order: ${newOrder.orderItems.length}<br />
  Products you ordered: <br />${formatOrderItems(newOrder)}<br />
  <br>
  When your order is shipped, we will send you an email. Also, You can  
  check the order status in the dashboard of the website.<br />
  <br />Once Again, Thank You for ordering at ${fromCompany} Online.<br /><br />
  ${adminStaff}`;

  return { 
    recipient,
    emailSubject,
    orderTmpl,
  };
};

export const emailOrderDeliveryStatus = (order) => {
  //Ex. moment(dateStamp).format('MM/DD/YYYY');
  const deliveredOrder = order;

  const recipient = deliveredOrder.paymentResult.email_address;
  const fromCompany = 'Next Amazona';
  const emailSubject = `Your order from ${fromCompany} Online has been shipped.`;
  const adminStaff = `${fromCompany} Online Staff`;
  const taxAmount = deliveredOrder.taxPrice ? deliveredOrder.taxPrice : 0;
  const shippingAmount = deliveredOrder.shippingPrice ? deliveredOrder.shippingPrice : 0;

  const orderTmpl = `Order ID: ${deliveredOrder._id} <br />
  Tax: $ ${Number.parseFloat(taxAmount).toFixed(2)}<br />
  Shipping: $ ${Number.parseFloat(shippingAmount).toFixed(2)}<br />
  Subtotal Amount: $ ${Number.parseFloat(deliveredOrder.itemsPrice).toFixed(2)}<br />
  Total Amount: $ ${Number.parseFloat(deliveredOrder.totalPrice).toFixed(2)}<br />
  Ordered paid on: ${moment(deliveredOrder.paidAt).format('LLLL')}<br />
  Payment type: ${deliveredOrder.paymentMethod}<br />
  Delivery address: <br />
  <br />${formatShippingAddress(deliveredOrder.shippingAddress)}<br />
  Total items in this order: ${deliveredOrder.orderItems.length}<br />
  Products you ordered: <br />${formatOrderItems(deliveredOrder)}<br /><br />
  <b>This order has been shipped on ${moment(Date.now()).format('LLLL')}.</b><br />
  <br />Thank You for ordering at ${fromCompany} Online. We hope you will<br />
  enjoy our products and write product reviews too.<br /><br />
  ${adminStaff}`;

  return { 
    recipient,
    emailSubject,
    orderTmpl,
  };
};
