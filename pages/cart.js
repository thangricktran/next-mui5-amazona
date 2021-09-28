import dynamic from 'next/dynamic';
import React, { useContext } from 'react';
import Layout from "components/Layout";
import { Store } from "utils/Store";
// import NextLink from "next/link";
import NextLink from "components/MuiNextLink";
import Image from 'next/image';
import axios from 'axios';
import { 
  Button, Card, Grid, List, ListItem, Select, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Typography, MenuItem 
} from "@material-ui/core";
import useStyles from 'utils/styles';
import { useRouter } from 'next/router';
import { getSizeObjectFromAProduct } from 'utils/helpers';

function CartScreen() {
  const classes = useStyles();
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { 
    cart: { cartItems } 
  } = state;

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);

    const dataSizeObject = getSizeObjectFromAProduct(data, item.sizeId);
    if (dataSizeObject && dataSizeObject.countInStock < quantity) {
      window.alert("Sorry. Product item is out of stock!");
      return;
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
  };
  const removeItemHandler = item => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };
  const checkoutHandler = () => {
    router.push('/shipping');
  };

  return (
    <Layout title="Shopping Cart">
    <div className={classes.quantity}>
      <Typography component="h1" variant="h1">
        Shopping Cart
      </Typography>
      {cartItems.length === 0 ? (
          <div>
            Cart is empty.{' '}
            <NextLink href="/" underline="none">
              Continue Shopping
            </NextLink>
          </div>
        ) : (
          <Grid container spacing={1}>
            <Grid item md={9} xs={12}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Image</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Size</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((item, i ) => (
                      <TableRow key={`${item._id}${i}`}>
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
                        <TableCell>
                            <Typography>{item.size}</Typography>
                        </TableCell>
                        <TableCell align="right">          
                          <Select
                            size="small"
                            id={`${item._id}${new Date().getTime().toString()}}`}
                            value={item.quantity}
                            onChange={(e) => updateCartHandler(item, e.target.value)}
                          >
                            {[...Array(item.countInStock).keys()].map((x) => (
                              <MenuItem key={`${item._id}${(x+1).toString()}`} value={x + 1}>
                                {x + 1}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell align="right">
                          $&nbsp;{item.price}
                        </TableCell>
                        <TableCell align="right">
                          <Button 
                            variant="contained" 
                            color="secondary"
                            onClick={() => removeItemHandler(item)}
                          >
                            x
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item md={3} xs={12}>
              <Card>
                <List>
                  <ListItem>
                    <Typography variant="h2">
                      Subtotal ({cartItems.reduce((a, c) => (a + Number(c.quantity)), 0)} {' '}
                      items)
                      : $ {cartItems.reduce((a, c) => a + (c.quantity * c.price), 0)}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth
                      onClick={checkoutHandler}
                    >
                      Check Out
                    </Button>
                  </ListItem>
                </List>
              </Card> 
            </Grid>
          </Grid>
        )
      }
    </div>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
