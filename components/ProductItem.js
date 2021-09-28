import {
//  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Rating,
  Select,
  MenuItem,
} from '@material-ui/core';
import React from 'react';
// import NextLink from 'next/link';
import MuiNextLink from "components/MuiNextLink";
import { getSizeObjectFromAProduct } from 'utils/helpers';

export default function ProductItem({ product, addToCartHandler }) {
  return (
    <Card>
      <MuiNextLink href={`/product/${product.slug}`} underline="none">
        <CardActionArea>
          <CardMedia
            component="img"
            image={product.image}
            title={product.name}
          ></CardMedia>
          <CardContent>
            <Typography>{product.name}</Typography>
            <Rating value={product.rating} readOnly></Rating>
          </CardContent>
        </CardActionArea>
      </MuiNextLink>
      <CardActions>
        <Typography>&#8776;&#36;{product.price}</Typography>
        <Typography color="primary">Add to cart</Typography>&nbsp;
        <Select
          size="small"
          color="primary" 
          id={`${product._id}.toString()`}
          defaultValue={(getSizeObjectFromAProduct({...product},product.sizes[0]._id))._id}
          onChange={(e) => addToCartHandler(product, e.target.value)}
        >
          {product.sizes.map((s, i) => (
            <MenuItem key={`${product._id}${(s.name)}${i}`} value={s._id}>
              {i === 0 ? s.name : `${s.name} $ ${s.price}`}
            </MenuItem>
          ))}
        </Select>
{/* 
        <Button
          size="small"
          color="primary"
          onClick={() => addToCartHandler(product, e.target.value)}
        >
          Add to cart
        </Button> */}
      </CardActions>
    </Card>
  );
}
