import dynamic from 'next/dynamic';
import React, { useEffect, useContext, useReducer } from 'react';
import NextLink from "components/MuiNextLink";
import { useRouter } from 'next/router';
import { Store } from "utils/Store";
import axios from 'axios';
import moment from 'moment';
import { getError } from 'utils/error';
import Layout from 'components/Layout';
import useStyles from 'utils/styles';
import { 
  Button,
  Card, CircularProgress, Grid, List, ListItem, ListItemText, Table, 
  TableBody, TableCell, TableContainer, TableHead, TableRow, Typography 
} from "@material-ui/core";

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST': 
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAIL': 
      return { ...state, loading: false, error: action.payload };
    default: return state;
  }
};

function OrderHistory() {
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const classes = useStyles();
  const [{ loading, error, orders }, dispatch ] = useReducer(reducer, { 
    loading: true, 
    orders: [], 
    error: '' 
  });

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }
    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/history`, {
          headers: { authorization: `Bearer ${userInfo.token}` }
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    fetchOrders();
  }, []);

  return (
    <Layout title="Order History">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/profile" underline="none">
                <ListItem>
                  <ListItemText primary="User Profile"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/order-history" underline="none">
                <ListItem selected>
                  <ListItemText primary="Order History"></ListItemText>
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Order History
                </Typography>
              </ListItem>
              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography className={classes.error}>{error}</Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>DATE</TableCell>
                          <TableCell>TOTAL</TableCell>
                          <TableCell>PAID</TableCell>
                          <TableCell>DELIVERED</TableCell>
                          <TableCell>ACTION</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Array.isArray(orders) && orders.length > 0 ? orders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>{order._id.substring(20,24)}</TableCell>
                            <TableCell>{moment(order.createdAt).format('LL') }</TableCell>
                            <TableCell>$ {order.totalPrice}</TableCell>
                            <TableCell>
                              {order.isPaid 
                              ? `paid at ${moment(order.paidAt).format('LL') }` 
                              : 'not paid'}
                            </TableCell>
                            <TableCell>
                              {order.isDelivered 
                              ? `delivered at ${order.deliveredAt}` 
                              : 'not delivered'}
                            </TableCell>
                            <TableCell>
                              <NextLink href={`/order/${order._id}`} underline="none">
                                <Button variant="contained">Details</Button>
                              </NextLink>
                            </TableCell>                            
                          </TableRow>
                        )):null}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>

    </Layout>
  );
}

export default dynamic(() => Promise.resolve(OrderHistory), { ssr: false });
