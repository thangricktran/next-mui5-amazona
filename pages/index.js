/* eslint-disable @next/next/no-img-element */
// import MuiNextLink from "components/MuiNextLink";
import dynamic from 'next/dynamic';
import { useContext } from 'react';
// import NextLink from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Store } from 'utils/Store';
import Layout from 'components/Layout';
import db from 'utils/db';
import { getSizeObjectFromAProduct } from 'utils/helpers';
import Product from 'models/Product';
import ProductItem from 'components/ProductItem';
import CarouselMain from 'components/carousel/CarouselMain';
import {
  Grid, Typography,
} from '@material-ui/core';

function Home(props) {
  const router = useRouter();
  const { topRatedProducts, featuredProducts } = props;
  const { state, dispatch } = useContext(Store);

  const addToCartHandler = async (product, sizeId) => {
    const prodSizeObject = getSizeObjectFromAProduct({...product},sizeId);
    if (prodSizeObject.name === 'Select' || !prodSizeObject._id) {
      window.alert("Sorry, no selection is found, please re-select.");
      return;
    }
    const existItem = state.cart.cartItems.find(i => 
      i._id === product._id  && i.sizeId === sizeId
    );
    const quantity = existItem ? Number(existItem.quantity) + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    const dataSizeObject = getSizeObjectFromAProduct(data, sizeId);
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
        price: prodSizeObject.price,
        rating: product.rating,
        size: prodSizeObject.name,
        countInStock: prodSizeObject.countInStock,
        sizeId: prodSizeObject._id,
      }
    });
    router.push('/cart');
  };
  
  return (
    <Layout>        
      {/* <Carousel className={classes.mt1} animation="slide">
        {featuredProducts.map((product) => (
          <MuiNextLink
            key={product._id}
            href={`/product/${product.slug}`}
            underline="none"
          >
            <img
              src={product.featuredImage}
              alt={product.name}
              // className={classes.featuredImage}
            ></img>
          </MuiNextLink>
        ))}
      </Carousel> */}

      <CarouselMain featuredProducts={featuredProducts}  /> 

      <Typography variant="h2">Popular Products</Typography>
      <Grid container spacing={3}>
        {topRatedProducts.map((product) => (
          <Grid item md={4} key={product.name}>
            <ProductItem product={product} addToCartHandler={addToCartHandler} />
          </Grid>
        ))}
      </Grid>

    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();

  const featuredProductsDocs = await Product.find(
    { isFeatured: true },
    '-reviews'
  )
    .lean();
    // .limit(3);
  const featuredProducts = JSON.parse(JSON.stringify(featuredProductsDocs));
  // console.log("index.js getServerSideProps() featuredProducts: \n", featuredProducts);

  const topRatedProductsDocs = await Product.find({}, '-reviews')
    .lean()
    .sort({
      rating: -1,
    })
    .limit(6);
  const topRatedProducts = JSON.parse(JSON.stringify(topRatedProductsDocs));

  await db.disconnect();
  return {
    props: {
      featuredProducts,
      topRatedProducts,
    },
  };
}

export default dynamic(() => Promise.resolve(Home), { ssr: false });
