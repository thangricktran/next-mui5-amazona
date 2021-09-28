import dynamic from 'next/dynamic';
import React, { useEffect, useContext, useReducer, useState } from 'react';
import MuiNextLink from "components/MuiNextLink";
import { useRouter } from 'next/router';
import { Store } from "utils/Store";
import axios from 'axios';
import { getError } from 'utils/error';
import Layout from 'components/Layout';
import useStyles from 'utils/styles';
import { Button, TextField, Card, Grid, List, ListItem, ListItemText, 
  Typography, CircularProgress, FormControlLabel, Checkbox
} from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import ProductSizesForm from 'components/admin/ProductSizesForm';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true, errorUpdate: '' };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, errorUpdate: '' };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return { ...state, loadingUpload: false, errorUpload: '' };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  };
}

function ProductEdit({ params }) {
  const productId = params.id;
  const router = useRouter();
  const { state } = useContext(Store);
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] 
  = useReducer(reducer, {
    loading: true, error: ''
  });
  const { handleSubmit, control, setValue, formState: { errors } } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { userInfo } = state;
  const classes = useStyles();
  const [sizesArray, setSizesArray] = useState(null);
  const [sizesReturn, setSizesReturn] = useState(null);
  const [isFeaturedLocal, setIsFeaturedLocal] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }
    if (!userInfo.isAdmin) {
      return router.push('/');
    } else {
      const fetchData = async () => {
        try {
          dispatch({ type: 'FETCH_REQUEST' });
          const { data } = await axios.get(`/api/admin/products/${productId}`, {
            headers: { authorization: `Bearer ${userInfo.token}` }
          });
          // console.log("pages/admin/product/[id].js fetchData() data: \n", data);          
          dispatch({ type: 'FETCH_SUCCESS' });
          setValue('name', data.name);
          setValue('slug', data.slug);
          setValue('price', data.price);
          setValue('image', data.image);
          setValue('featuredImage', data.featuredImage);
          setIsFeaturedLocal(data.isFeatured);
          setValue('category', data.category);
          setValue('brand', data.brand);
          setValue('description', data.description);
          // console.log("admin/product/[].js fetchData() data.sizes: \n", data.sizes);
          
          setSizesArray([...data.sizes]);
          
        } catch (error) {
          dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
        }
      };
      fetchData();
    }
  }, []);

  const onSubmitHandler = async ({ 
    name,
    slug,
    price,
    category,
    image,
    // isFeatured=false,
    featuredImage,
    brand,
    description,
   }) => {
    closeSnackbar();
    // capturing sizes object to send to the server
    let sizes;
    if (Array.isArray(sizesReturn) && sizesReturn.length > 0) {
      sizes = [...sizesReturn];
    } else {
      sizes = [...sizesArray];
    }
    const isFeatured = isFeaturedLocal;

    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/admin/products/${productId}`,
        {
          name,
          slug,
          price,
          category,
          image,
          isFeatured,
          featuredImage,
          brand,
          description,
          sizes,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      enqueueSnackbar('Product updated successfully', { variant: 'success' });
      router.push('/admin/products');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  const uploadHandler = async (e, imageField = 'image') => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/admin/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });
      setValue(imageField, data.secure_url);
      enqueueSnackbar('File uploaded successfully', { variant: 'success' });
    } catch (err) {
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  const getSizesArray = ({returnSizesData, data}) => {
    // console.log("getSizesArray Object.keys(data.sizes[2].nestedArray[0]): \n", 
    //             Object.keys(data.sizes[2].nestedArray[0]));
    // console.log("getSizesArray Object.values(data.sizes[2].nestedArray[0]): \n", 
    //             Object.values(data.sizes[2].nestedArray[0]));
    
    const rt = returnSizesData.map((sIte, i) => {
      const prices = Object.values(data.sizes[1].nestedArray[0]);
      const countInStock = Object.values(data.sizes[2].nestedArray[0]);
      return {
        _id: sIte._id,
        name: sIte.name,
        price: Number.parseFloat(prices[i]),
        countInStock: Number.parseInt(countInStock[i]),
      }
    });
    setSizesReturn([...rt]);
  };

  return (
    <Layout title={`Edit Product ${productId}`}>
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
                <ListItem button>
                  <ListItemText primary="Orders"></ListItemText>
                </ListItem>
              </MuiNextLink>
              <MuiNextLink href="/admin/products" underline="none">
                <ListItem selected button>
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
                  Edit Product {productId}
                </Typography>
              </ListItem>
              <ListItem>
                {loading && <CircularProgress></CircularProgress>}
                {error && (
                  <Typography className={classes.error}>{error}</Typography>
                )}
              </ListItem>
              <ListItem>
                <form onSubmit={handleSubmit(onSubmitHandler)} className={classes.form} noValidate>
                  <List>
                    <ListItem>
                      <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="name"
                            label="Name"
                            error={Boolean(errors.name)}
                            helperText={errors.name ? 'Name is required' : ''}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="slug"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="slug"
                            label="Slug"
                            error={Boolean(errors.slug)}
                            helperText={errors.slug ? 'Slug is required' : ''}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="price"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="price"
                            label="Price"
                            error={Boolean(errors.price)}
                            helperText={errors.price ? 'Price is required' : ''}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="image"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="image"
                            label="Image"
                            error={Boolean(errors.image)}
                            helperText={errors.image ? 'Image is required' : ''}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Button variant="contained" size="small" component="label">
                        Upload File
                        <input type="file" onChange={uploadHandler} hidden />
                      </Button>
                      {loadingUpload && <CircularProgress />}
                    </ListItem>
                    <ListItem>
                      <FormControlLabel
                        label="Is Featured"
                        control={
                          <Checkbox
                            id="isFeatured"
                            onClick={(e) => setIsFeaturedLocal(e.target.checked)}
                            checked={isFeaturedLocal}
                            name="isFeatured"
                          />
                        }
                      ></FormControlLabel>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="featuredImage"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: isFeaturedLocal ? true : false,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="featuredImage"
                            label="Featured Image"
                            error={Boolean(errors.featuredImage)}
                            helperText={errors.featuredImage ? 'Featured Image is required' : ''}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Button variant="contained" size="small" component="label">
                        Upload File
                        <input
                          type="file" 
                          onChange={(e) => uploadHandler(e, 'featuredImage')} 
                          hidden 
                        />
                      </Button>
                      {loadingUpload && <CircularProgress />}
                    </ListItem>

                    <ListItem>
                      <Controller
                        name="category"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="category"
                            label="Category"
                            error={Boolean(errors.category)}
                            helperText={errors.category ? 'Category is required' : ''}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="brand"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="brand"
                            label="Brand"
                            error={Boolean(errors.brand)}
                            helperText={errors.brand ? 'Brand is required' : ''}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="description"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            multiline
                            id="description"
                            label="Description"
                            error={Boolean(errors.description)}
                            helperText={errors.description ? 'Description is required' : ''}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Button
                        variant="contained" 
                        color="primary"
                        type="submit"
                        fullWidth
                      >
                        Update
                      </Button>
                      {loadingUpdate && <CircularProgress />}
                    </ListItem>
                  </List>
                </form>                
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
      {!sizesArray ? (<CircularProgress />) :
      <ProductSizesForm sizesArray={sizesArray} getSizesArray={getSizesArray} /> }
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(ProductEdit), { ssr: false });
