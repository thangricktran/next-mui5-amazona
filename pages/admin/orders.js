import dynamic from 'next/dynamic';
import React, { useEffect, useContext, useReducer } from 'react';
import MuiNextLink from "components/MuiNextLink";
// import NextLink from 'next/link';
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

function AdminOrders() {
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
    if (!userInfo.isAdmin) {
      return router.push('/');
    }
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/orders`, {
          headers: { authorization: `Bearer ${userInfo.token}` }
        });
        // console.log("pages/admin/orders.js fetchData() data: \n", data);
        
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    fetchData();
  }, []);

  return (
    <Layout title="Orders Admin">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <MuiNextLink href="/admin/dashboard" underline="none">
                <ListItem button>
                  <ListItemText primary="Admin Dashboard"></ListItemText>
                </ListItem>
              </MuiNextLink>
              <MuiNextLink href="/admin/orders" underline="none">
                <ListItem button selected>
                  <ListItemText primary="Orders"></ListItemText>
                </ListItem>
              </MuiNextLink>
              <MuiNextLink href="/admin/products" underline="none">
                <ListItem button>
                  <ListItemText primary="Products"></ListItemText>
                </ListItem>
              </MuiNextLink>
              <MuiNextLink href="/admin/users" underline="none">
                <ListItem button>
                  <ListItemText primary="Users"></ListItemText>
                </ListItem>
              </MuiNextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Orders
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
                          <TableCell>USER</TableCell>
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
                            <TableCell>{order.user ? order.user.name : 'DELETED USER'}</TableCell>
                            <TableCell>{moment(order.createdAt).format('LL') }</TableCell>
                            <TableCell>$ {order.totalPrice}</TableCell>
                            <TableCell>
                              {order.isPaid 
                              ? `paid at ${moment(order.paidAt).format('LL') }` 
                              : 'not paid'}
                            </TableCell>
                            <TableCell>
                              {order.isDelivered 
                              ? `delivered at ${moment(order.deliveredAt).format('LL') }` 
                              : 'not delivered'}
                            </TableCell>
                            <TableCell>
                              <MuiNextLink href={`/order/${order._id}`} underline="none">
                                <Button variant="contained">Details</Button>
                              </MuiNextLink>
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

export default dynamic(() => Promise.resolve(AdminOrders), { ssr: false });
