import dynamic from 'next/dynamic';
import React, { useContext, useEffect, useState } from 'react';
// import NextLink from 'next/link';
import MuiNextLink from "components/MuiNextLink";
import Image from 'next/image';
import Layout from 'components/Layout';
import useStyles from 'utils/styles';
import db from 'utils/db';
import Product from 'models/Product';
import axios from 'axios';
import { Store } from 'utils/Store';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { getError } from 'utils/error';
import { getSizeObjectFromAProduct } from 'utils/helpers';
import { 
  Grid, List, ListItem, Typography, Card, Button, Select, MenuItem, Rating, 
  TextField, CircularProgress
} from '@material-ui/core';
// import { Rating } from '@material-ui/core';

function ProductScreen(props) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const { product } = props;
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [productSize, setProductSize] = useState({});
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `/api/products/${product._id}/reviews`,
        {
          rating,
          comment,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      setLoading(false);
      enqueueSnackbar('Review submitted successfully', { variant: 'success' });
      // refresh fetchReviews to show newally updates
      fetchReviews();
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/products/${product._id}/reviews`);
      setReviews(data);
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };
  useEffect(() => {
    fetchReviews();
  }, []);

  const addToCartHandler = async () => {
    if (productSize.name === 'Select' || !productSize._id) {
      window.alert("Sorry, no selection is found, please re-select.");
      return;
    }

    const existItem = state.cart.cartItems.find(i => 
      i._id === product._id  && i.sizeId === productSize._id
    );
    const quantity = existItem ? Number(existItem.quantity) + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    const dataSizeObject = getSizeObjectFromAProduct(data, productSize._id);
    if (dataSizeObject && dataSizeObject.countInStock < quantity) {
      window.alert("Sorry. Product item is out of stock!");
      return;
    }
  
    dispatch({ type: 'CART_ADD_ITEM', payload: {
        _id: product._id,
        brand: product.brand,
        category: product.category,
        createdAt: product.createdAt,
        description: product.description,
        image: product.image,
        name: product.name,
        slug: product.slug,
        quantity,
        numReviews: product.numReviews,
        price: productSize.price,
        rating: product.rating,
        size: productSize.name,
        countInStock: productSize.countInStock,
        sizeId: productSize._id,
      }
    });

    router.push('/cart');
  };

  const setSizeHandler = (product, sizeId) => {
    setProductSize(getSizeObjectFromAProduct({...product}, sizeId));
  };
  
  if (!product) {
    return <div>Product Not Found.</div>;
  }
  
  return (
    <Layout title={product.name} description={product.description}>
      <div className={classes.section}>
        <MuiNextLink href="/" underline="none">
          <Typography>back to products</Typography>
        </MuiNextLink>
      </div>
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Image src={product.image} 
            alt={product.name} width={640} 
            height={640}
            layout="responsive" 
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography component="h1" variant="h1">{product.name}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Category: &nbsp;{product.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Brand: &nbsp;{product.brand}</Typography>
            </ListItem>
            <ListItem>
              <Rating value={product.rating} readOnly></Rating>&nbsp;
              <MuiNextLink href="#reviews" underline="none">
                <Typography>({product.numReviews} reviews)</Typography>
              </MuiNextLink>
            </ListItem>
            <ListItem>
              <Typography>
                Description: &nbsp;{product.description}
              </Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Price: &#8776;&#36; {product.price}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Select
                      size="small" 
                      id={`${product._id}.toString()`}
                      defaultValue={(getSizeObjectFromAProduct({...product},product.sizes[0]._id))._id}
                      onChange={(e) => setSizeHandler(product, e.target.value)}
                    >
                      {product.sizes.map((s, i) => (
                        <MenuItem key={`${product._id}${(s.name)}${i}`} value={s._id}>
                          {i === 0 ? s.name : `${s.name} $ ${s.price}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Status:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography> &nbsp; {productSize.countInStock > 0 ? 'In stock' : 'Select a size'}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button 
                  fullWidth 
                  variant="contained" 
                  color="primary"
                  onClick={addToCartHandler}
                >
                  Add to cart
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>

      <List>
        <ListItem>
          <Typography name="reviews" id="reviews" variant="h2">
            Customer Reviews
          </Typography>
        </ListItem>
        {reviews.length === 0 && <ListItem>No review</ListItem>}
        {Array.isArray(reviews) && reviews.length > 0 && reviews.map((review) => (
          <ListItem key={review._id}>
            <Grid container>
              <Grid item className={classes.reviewItem}>
                <Typography>
                  <strong>{review.name}</strong>
                </Typography>
                <Typography>{review.createdAt.substring(0, 10)}</Typography>
              </Grid>
              <Grid item>
                <Rating value={review.rating} readOnly></Rating>
                <Typography>{review.comment}</Typography>
              </Grid>
            </Grid>
          </ListItem>
        ))}
        <ListItem>
          {userInfo ? (
            <form onSubmit={submitHandler} className={classes.reviewForm}>
              <List>
                <ListItem>
                  <Typography variant="h2">Leave your review</Typography>
                </ListItem>
                <ListItem>
                  <TextField
                    multiline
                    variant="outlined"
                    fullWidth
                    name="review"
                    label="Enter comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </ListItem>
                <ListItem>
                  <Rating
                    name="simple-controlled"
                    value={rating}
                    onChange={(e) => setRating(Number.parseInt(e.target.value))}
                  />
                </ListItem>
                <ListItem>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    Submit
                  </Button>

                  {loading && <CircularProgress />}
                </ListItem>
              </List>
            </form>
          ) : (
            <Typography variant="h2">
              Please{' '}
              <MuiNextLink href={`/login?redirect=/product/${product.slug}`} underline="none">
                login
              </MuiNextLink>{' '}
              to write a review
            </Typography>
          )}
        </ListItem>
      </List>


    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await db.connect();
  // const product = await Product.findOne({ slug }, '-reviews');//.lean();
  const product = await Product.findOne({ slug });
  const jsonProduct = JSON.parse(JSON.stringify(product));
  await db.disconnect();
  // console.log("product: \n", jsonProduct);
  return {
    props: {
      product: db.convertDocToObject(jsonProduct)
    },
  };
}

export default dynamic(() => Promise.resolve(ProductScreen), { ssr: false });
