import dynamic from 'next/dynamic';
import React, { useContext, useEffect, useState } from 'react';
import Layout from "components/Layout";
import { Store } from "utils/Store";
// import NextLink from "next/link";
import NextLink from "components/MuiNextLink";
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/router';
import useStyles from 'utils/styles';
import CheckoutWizard from 'components/CheckoutWizard';
import { useSnackbar } from 'notistack';
import { getError } from 'utils/error';
import Cookies from 'js-cookie';
import { 
  Button, Card, CircularProgress, Grid, List, ListItem, Table, 
  TableBody, TableCell, TableContainer, TableHead, TableRow, Typography 
} from "@material-ui/core";

function PlaceOrder() {
  const classes = useStyles();
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { cartItems, shippingAddress, paymentMethod },
  } = state;
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const round2 = num => Math.round(num * 100 + Number.EPSILON) / 100; // 123.456 => 123.46
  const itemsPrice = round2(cartItems.reduce((a, c) => a + (c.price * c.quantity), 0));
  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, []);

  const placeOrderHandler =  async () => {
    closeSnackbar();

    if (!userInfo.token) {
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.post('/api/orders', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
      },
      {
        headers: {
          authorization: `Bearer: ${userInfo.token}`
        }
      });
      dispatch({ type: 'CART_CLEAR' });
      Cookies.remove('cartItems');
      setLoading(false);
      router.push(`/order/${data._id}`);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(getError(error), { variant: 'error' });
    }
  };
 
  return (
    <Layout title="Place Order">
      <CheckoutWizard activeStep={3} />
      <Typography component="h1" variant="h1">
        Place Order
      </Typography>
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
                            <TableCell align="left">Size</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Price</TableCell>                        
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {cartItems.map(item => (
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
                              <TableCell align="left">
                                <Typography>{item.size}</Typography>
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
                  <ListItem>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth 
                      onClick={placeOrderHandler}                     
                    >
                      Place Order
                    </Button>
                  </ListItem>
                  {loading && 
                    <ListItem>
                      <CircularProgress />
                    </ListItem>
                  }
                </List>
              </Card> 
            </Grid>
          </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: false });