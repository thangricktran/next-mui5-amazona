import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import useStyles from 'utils/styles';
import { Button } from "@material-ui/core";

const StripeCheckoutForm = ({ stripePaymentIntent, onStripeCheckout }) => {
  const classes = useStyles();
  const stripe = useStripe();
  const elements = useElements();
  const [checkoutError, setCheckoutError] = useState();
  const [checkoutSuccess, setCheckoutSuccess] = useState();

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const {
        error,
        paymentIntent
      } = await stripe.confirmCardPayment(stripePaymentIntent.client_secret, {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      });

      if (error) throw new Error(error.message);
      
      if (paymentIntent.status === "succeeded") {
        // destroyCookie(null, "amazonaPaymentIntentId");
        setCheckoutSuccess(true);
        onStripeCheckout(paymentIntent)
      }
    } catch (err) {
      setCheckoutError(err.message);
    }
  };

  const configCardElement = {
    iconStyle: 'solid',
    //style: {
      // base: {
      //   fontSize: '16px',
      //   color: '#32325d',
      // }
    //},
    style: {
      base: {
        iconColor: '#c4f0ff',
        color: '#fff',
        fontWeight: '500',
        fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        ':-webkit-autofill': {
          color: '#fce883',
        },
        '::placeholder': {
          color: '#87BBFD',
        },
      },
      invalid: {
        iconColor: '#FFC7EE',
        color: '#FFC7EE',
      },
    },

    hidePostalCode: true
  };


  if (checkoutSuccess) return <p>Payment successfull!</p>;

  return (
    <form onSubmit={handleSubmit} className={classes.formStripeCheckoutCmpt}>
      <div className="testCardNumber">
        <p>Test Card Number: 4242 4242 4242 4242 Exp: 04/34 CVC: 345</p>
      </div>

      <CardElement options={configCardElement} />

      <Button
        className={classes.muiBtn} 
        variant="contained" 
        color="primary" 
        size="small"
        fullWidth
        type="submit" 
        disabled={!stripe}
      >
        Pay now
      </Button>

      {checkoutError && <span style={{ color: "red" }}>{checkoutError}</span>}
    </form>
  );
};

export default StripeCheckoutForm;
