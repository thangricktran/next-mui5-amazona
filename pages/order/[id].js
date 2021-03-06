import dynamic from 'next/dynamic';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import Layout from "components/Layout";
import { Store } from "utils/Store";
// import NextLink from "next/link";
import NextLink from "components/MuiNextLink";
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/router';
import useStyles from 'utils/styles';
import { useSnackbar } from 'notistack';
import { getError } from 'utils/error';
import { 
  Button,
  Card, CircularProgress, Grid, List, ListItem, Table, 
  TableBody, TableCell, TableContainer, TableHead, TableRow, Typography 
} from "@material-ui/core";
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import moment from 'moment';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckoutForm from "components/StripeCheckoutForm";

const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY);

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST': 
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL': 
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST': 
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL': 
      return { ...state, loadingPay: false, errorPay: action.payload };
    case 'PAY_RESET': 
      return { ...state, loadingPay: false, successPay: false, errorPay: '' };
    case 'DELIVER_REQUEST': 
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAIL': 
      return { ...state, loadingDeliver: false, errorDeliver: action.payload };
    case 'DELIVER_RESET': 
      return { ...state, loadingDeliver: false, successDeliver: false, errorDeliver: '' };
    default: return state;
  }
};

function OrderDetail({ params }) {
  const orderId = params.id;
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [ { isPending }, paypalDispatch ] = usePayPalScriptReducer()
  const classes = useStyles();
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [isAdminUser, setIsAdminUser] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
 
  const [{ loading, error, order, successPay, loadingDeliver, successDeliver }, 
    dispatch, 
  ] = useReducer(reducer, { 
    loading: true, 
    order: {}, 
    error: '' 
  });
  const { shippingAddress, paymentMethod, orderItems, itemsPrice, taxPrice, 
    shippingPrice, totalPrice, isPaid, paidAt, isDelivered, deliveredAt 
  } = order;

  useEffect(() => {
    if (typeof userInfo !== "undefined" && typeof userInfo.isAdmin !== "undefined") {
      if (userInfo.isAdmin) {
        setIsAdminUser(true);
      }
    }

    if (!userInfo) {
      return router.push('/login');
    }
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` }
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };

    if ( !order._id || successPay || successDeliver || (order._id && order._id !== orderId) ) {
      fetchOrder();

      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
      if (successDeliver) {
        dispatch({ type: 'DELIVER_RESET' });
      }
    } else {
      if (paymentMethod === "PayPal") {
        const loadPaypalScript = async () => {
          const { data: clientId } = await axios.get('/api/keys/paypal', {
            headers: { authorization: `Bearer ${userInfo.token}`},
          });
          paypalDispatch({type: 'resetOptions', value: {
            'client-id': clientId, 
            currency: 'USD',
          }});
          paypalDispatch({type: 'setLoadingStatus', value: 'pending'});
        };
        if (!order.isPaid) {
         loadPaypalScript(); 
        }
      } else if (paymentMethod === "Stripe") {
        const loadStripeScript = async () => {
          try {
            const response = await axios.post('/api/keys/stripe',
            { id: orderId },
            {
              headers: { authorization: `Bearer ${userInfo.token}`},
            });
            setPaymentIntent( response.data );
          } catch (error) {
            console.log("pages/order/[id].js loadStripeScript() error:\n", error);
          }
        };
        if (!order.isPaid) {
          loadStripeScript();
        }        
      }/* else {

      }*/
    }
  }, [order, successPay, successDeliver]);

  function createOrder(data, actions) {
    return actions.order.create({
      purchase_units: [
        {
          amount: { value: totalPrice },
        }
      ],
    }).then((orderID) => { 
      return orderID 
    });
  };

  function onApprove(data, actions) {
    return actions.order.capture()
      .then(async function(details) {
        // console.log("pages/order/[id].js onApprove(data, actions) capture details:", details);
        try {
          dispatch({ type: 'PAY_REQUEST' });
          const { data } = await axios.put(`/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}`},
          });
          dispatch({ type: 'PAY_SUCCESS', payload: data });
          enqueueSnackbar("Order is paid. Thank you.", { variant: 'success' });
        } catch (error) {
          dispatch({ type: 'PAY_FAIL', payload: getError(error) });
          enqueueSnackbar(getError(error), { variant: 'error' });
          return;
        }
      }); 
  };

  function onError(error) {
    enqueueSnackbar(getError(error), { variant: 'error' });
  };

  const onStripeCheckout = async (details) => {
    // console.log("pages/order/[id].js onStripeCheckout() details:", details);

    try {
      dispatch({ type: 'PAY_REQUEST' });
      const { data } = await axios.put(`/api/orders/${order._id}/pay`,
      details,
      {
        headers: { authorization: `Bearer ${userInfo.token}`},
      });
      dispatch({ type: 'PAY_SUCCESS', payload: data });
      enqueueSnackbar("Order is paid. Thank you.", { variant: 'success' });
    } catch (error) {
      dispatch({ type: 'PAY_FAIL', payload: getError(error) });
      enqueueSnackbar(getError(error), { variant: 'error' });
      return;
    }
  };

  async function deliverOrderHandler() {
    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await axios.put(`/api/orders/${order._id}/deliver`,
      {},
      {
        headers: { authorization: `Bearer ${userInfo.token}`},
      });
      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      enqueueSnackbar("Order is delivered. Thank you.", { variant: 'success' });
    } catch (error) {
      dispatch({ type: 'DELIVER_FAIL', payload: getError(error) });
      enqueueSnackbar(getError(error), { variant: 'error' });
      return;
    }
  };
 
  return (
    <Layout title={`Order ${orderId}`}>
      <Typography component="h1" variant="h1">
        Order {orderId}
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography className={classes.error}>{error}</Typography>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    Shipping Address
                  </Typography>
                </ListItem>
                <ListItem>
                  {shippingAddress.fullName}, {shippingAddress.address},{' '}
                  {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                  {shippingAddress.country}
                  &nbsp;
                  {shippingAddress.location && (
                    <NextLink
                      variant="button"
                      target="_new"
                      href={`https://maps.google.com?q=${shippingAddress.location.lat},${shippingAddress.location.lng}`}
                    >
                      Show On Map
                    </NextLink>
                  )}
                </ListItem>
                <ListItem>
                  Status: {isDelivered 
                  ? `delivered at ${moment(deliveredAt).format('LLLL') }` 
                  : 'not delivered'}
                </ListItem>
              </List>
            </Card>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    Payment Method
                  </Typography>
                </ListItem>
                <ListItem>{paymentMethod}</ListItem>
                <ListItem>
                  Status: {isPaid 
                  ? `paid at ${moment(paidAt).format('LLLL') }` 
                  : 'not paid'}
                </ListItem>
              </List>
            </Card>    
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    Order Items
                  </Typography>
                </ListItem>
                <ListItem>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Image</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Price</TableCell>                        
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderItems.map(item => (
                          <TableRow key={item._id}>
                            <TableCell>
                              <NextLink href={`/product/${item.slug}`} underline="none">
                                <Image src={item.image} alt={item.name} width={50} height={50} />
                              </NextLink>
                            </TableCell>
                            <TableCell>
                              <NextLink href={`/product/${item.slug}`} underline="none">
                                <Typography>{item.name}</Typography>
                              </NextLink>
                            </TableCell>
                            <TableCell align="right">
                              <Typography>{item.quantity}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography>$&nbsp;{item.price}</Typography>
                            </TableCell>
                        </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </ListItem>
              </List>
            </Card>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography variant="h2">
                    Order Summary
                  </Typography>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Items:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">$ {itemsPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Tax:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">$ {taxPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Shipping:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">$ {shippingPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography><strong>Total:</strong></Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right"><strong>$ {totalPrice}</strong></Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                {!isPaid && (
                  <ListItem>
                    {isPending ? (
                      <CircularProgress />
                    ) : (
                      <div className={classes.fullWidth}>
                        {paymentMethod === "PayPal" ? (
                          <div>
                          <PayPalButtons 
                            createOrder={createOrder} 
                            onApprove={onApprove}
                            onError={onError}
                          />
                          </div>
                        ) : paymentMethod === "Stripe" ? (
                          <Elements stripe={stripePromise}>
                            <StripeCheckoutForm stripePaymentIntent={paymentIntent} 
                              onStripeCheckout={onStripeCheckout} />
                          </Elements>
                        ) : paymentMethod === "Cash" ? 'Cash' : null }
                      </div>
                    )}
                  </ListItem>
                )}
                {isAdminUser && order.isPaid && !order.isDelivered && (
                  <ListItem>
                    {loadingDeliver && <CircularProgress />}
                    <Button 
                      fullWidth 
                      variant="contained" 
                      color="primary"
                      onClick={deliverOrderHandler}
                    >
                      Deliver Order
                    </Button>
                  </ListItem>
                )}
              </List>
            </Card> 
          </Grid>
        </Grid>
      )}
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  return {
    props: {
      params,
    }
  };
}

export default dynamic(() => Promise.resolve(OrderDetail), { ssr: false });
