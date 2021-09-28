import dynamic from 'next/dynamic';
import React, { useEffect, useContext, useReducer } from 'react';
import MuiNextLink from "components/MuiNextLink";
// import NextLink from 'next/link';
import { Bar } from 'react-chartjs-2';
import { useRouter } from 'next/router';
import { Store } from "utils/Store";
import axios from 'axios';
import { getError } from 'utils/error';
import Layout from 'components/Layout';
import useStyles from 'utils/styles';
import { 
  Button,
  Card, CardActions, CardContent, CircularProgress, Grid, List, ListItem, 
  ListItemText, Typography 
} from "@material-ui/core";

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST': 
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, summary: action.payload, error: '' };
    case 'FETCH_FAIL': 
      return { ...state, loading: false, error: action.payload };
    default: return state;
  }
};

function AdminDashboard() {
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const classes = useStyles();

  const [{ loading, error, summary }, dispatch ] = useReducer(reducer, { 
    loading: true, 
    summary: { salesData: [] }, 
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
        const { data } = await axios.get(`/api/admin/summary`, {
          headers: { authorization: `Bearer ${userInfo.token}` }
        });
        // console.log("pages/admin/dashboard fetchData() data: \n", data);
        
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    fetchData();
  }, []);

  return (
    <Layout title="Order History">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <MuiNextLink href="/admin/dashboard" underline="none">
                <ListItem selected button>
                  <ListItemText primary="Admin Dashboard"></ListItemText>
                </ListItem>
              </MuiNextLink>
              <MuiNextLink href="/admin/orders" underline="none">
                <ListItem button>
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
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography className={classes.error}>{error}</Typography>
                ) : (
                  <Grid container spacing={5}>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h1">
                            $ {summary.ordersPrice}
                          </Typography>
                          <Typography>Sales</Typography>
                        </CardContent>
                        <CardActions>
                          <MuiNextLink href="/admin/orders" underline="none">
                            <Button size="small" color="primary">
                              View sales
                            </Button>
                          </MuiNextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h1">
                            {summary.ordersCount}
                          </Typography>
                          <Typography>Orders</Typography>
                        </CardContent>
                        <CardActions>
                          <MuiNextLink href="/admin/orders" underline="none">
                            <Button size="small" color="primary">
                              View orders
                            </Button>
                          </MuiNextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h1">
                            {summary.productsCount}
                          </Typography>
                          <Typography>Products</Typography>
                        </CardContent>
                        <CardActions>
                          <MuiNextLink href="/admin/products" underline="none">
                            <Button size="small" color="primary">
                              View products
                            </Button>
                          </MuiNextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h1">
                            {summary.usersCount}
                          </Typography>
                          <Typography>Users</Typography>
                        </CardContent>
                        <CardActions>
                          <MuiNextLink href="/admin/users" underline="none">
                            <Button size="small" color="primary">
                              View users
                            </Button>
                          </MuiNextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                  </Grid>
                )}
              </ListItem>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Sales Chart
                </Typography>
              </ListItem>
              <ListItem>
                <Bar
                  data={{
                    labels: summary.salesData.map((x) => x._id),
                    datasets: [
                      {
                        label: 'Sales',
                        backgroundColor: 'rgba(162, 222, 208, 1)',
                        data: summary.salesData.map((x) => x.totalSales),
                      },
                    ],
                  }}
                  options={{
                    legend: { display: true, position: 'right' },
                  }}
                ></Bar>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>

    </Layout>
  );
}

export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false });
