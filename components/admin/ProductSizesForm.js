import React from "react";
import { useForm } from "react-hook-form";
import ProductSizesFieldArray from "./ProductSizesFieldArray";
import useStyles from 'utils/styles';
import { Button, Card, Grid, List, ListItem } from "@material-ui/core";

const setData = (sizesArray) => {
  if (!Array.isArray(sizesArray) || sizesArray.length < 1) {
    console.log("setData() sizesArray has no data.");
    return null;
  }

  const sizes = [];
  let nASizesField = {};
  let nAPricesField = {};
  let nACountsField = {};
  sizesArray.map((item, i) => (
    nASizesField = { ...nASizesField, [`field${i+1}`]: item.name },
    nAPricesField = { ...nAPricesField, [`field${i+1}`]: (item.price).toString() },
    nACountsField = { ...nACountsField, [`field${i+1}`]: (item.countInStock).toString() }
  ));

  sizes.push({ name: "Size", nestedArray: [{...nASizesField}] });
  sizes.push({ name: "Price", nestedArray: [{...nAPricesField}] });
  sizes.push({ name: "Count", nestedArray: [{...nACountsField}] });
   
  return {sizes: [...sizes]};
};

const ProductSizesForm = ({ sizesArray, getSizesArray }) => {
  const defaultValues = setData([...sizesArray]);
  const returnSizesData = sizesArray;
  const classes = useStyles();

  const {
    control,
    register,
    handleSubmit,
    getValues,
    errors,
    // reset,
    setValue
  } = useForm({
    defaultValues
  });

  const onSubmit = (data) => {
    // console.log("ProductSizesForm data:\n", data);
    getSizesArray({returnSizesData, data});
  };

  return (
    <Grid container spacing={1}>
      <Grid item md={3} xs={12}>
        <Card className={classes.section}>
        </Card>
      </Grid>
      <Grid item md={9} xs={12}>
        <Card className={classes.section}>
          <List>
            <ListItem>
              <form onSubmit={handleSubmit(onSubmit)} className={classes.form} noValidate>
                <ProductSizesFieldArray
                  {...{ control, register, defaultValues, getValues, setValue, errors }}
                />
                <Button
                  style={{marginTop: 20}}
                  variant="contained" 
                  color="primary"
                  type="submit"
                  fullWidth
                >
                  Sizes Update
                </Button>              
              </form>              
            </ListItem>
          </List>
        </Card>
      </Grid>
    </Grid>
  );
}

export default ProductSizesForm;