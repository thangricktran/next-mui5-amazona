import React, { useContext, useEffect } from 'react';
import Layout from 'components/Layout';
import useStyles from 'utils/styles';
import { 
  Button, List, ListItem, TextField, Typography 
} from '@material-ui/core';
import { Store } from 'utils/Store';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { Controller, useForm } from 'react-hook-form';
import CheckoutWizard from 'components/CheckoutWizard';
import dynamic from 'next/dynamic';

function Shipping() {
  const { handleSubmit, control, setValue, getValues, formState: { errors } } = useForm();
  const { state, dispatch } = useContext(Store);
  const { userInfo, cart: { shippingAddress } } = state;
  const { location } = shippingAddress;
  const router = useRouter();  
  const classes = useStyles();

  useEffect(() => {
    if (!userInfo) {
      router.push('/login?redirect=/shipping');
    }
    if (shippingAddress.fullName && shippingAddress.address) {
      setValue('fullName', shippingAddress.fullName);
      setValue('address', shippingAddress.address);
      setValue('city', shippingAddress.city);
      setValue('state', shippingAddress.state);
      setValue('postalCode', shippingAddress.postalCode);
      setValue('country', shippingAddress.country);
    }
  }, []);

  const onSubmitHandler = ({ 
      fullName, address, city, state, postalCode, country 
    }) => {
    dispatch({ type: 'SAVE_SHIPPING_ADDRESS', 
      payload: { fullName, address, city, state, postalCode, country, location } 
    });
    Cookies.set('shippingAddress', JSON.stringify(
      { fullName, address, city, state, postalCode, country, location } ));
    router.push('/payment');
  };
  const chooseLocationHandler = () => {
    const fullName = getValues('fullName');
    const address = getValues('address');
    const city = getValues('city');
    const state = getValues('state');
    const postalCode = getValues('postalCode');
    const country = getValues('country');
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, address, city, state, postalCode, country },
    });
    Cookies.set('shippingAddress', JSON.stringify({
      fullName,
      address,
      city,
      state,
      postalCode,
      country,
      location,
    }));
    router.push('/map');
  };

  return (
    <Layout title="Shipping Address">
      <CheckoutWizard activeStep={1} />
      <form onSubmit={handleSubmit(onSubmitHandler)} className={classes.form} noValidate>
        <Typography component="h1" variant="h1">
          Shipping Address
        </Typography>
        <List>
          <ListItem>
            <Controller
              name="fullName"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="fullName"
                  label="Full Name"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.fullName)}
                  helperText={
                    errors.fullName
                      ? errors.fullName.type === 'minLength'
                        ? 'Full Name length is more than 1'
                        : 'Full Name is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="address"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 5,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="address"
                  label="Address"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.address)}
                  helperText={
                    errors.address
                      ? errors.address.type === 'minLength'
                        ? 'Address length is more than 4'
                        : 'Address is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="city"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="city"
                  label="City"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.city)}
                  helperText={
                    errors.city
                      ? errors.city.type === 'minLength'
                        ? 'City Name length is more than 1'
                        : 'City Name is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="state"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="state"
                  label="State"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.state)}
                  helperText={
                    errors.state
                      ? errors.state.type === 'minLength'
                        ? 'State length is more than 1'
                        : 'State is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="postalCode"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 5,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="postalCode"
                  label="Zip Code"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.postalCode)}
                  helperText={
                    errors.postalCode
                      ? errors.postalCode.type === 'minLength'
                        ? 'Zip Code length is more than 4'
                        : 'Zip Code is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="country"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="country"
                  label="Country"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.country)}
                  helperText={
                    errors.country
                      ? errors.country.type === 'minLength'
                        ? 'Country Name length is more than 1'
                        : 'Country Name is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Button
              variant="contained"
              size="small"
              type="button"
              onClick={chooseLocationHandler}
            >
              Choose on map
            </Button>&nbsp;&nbsp;
            <Typography>
              {location.lat && `Lat: ${location.lat}, Lng: ${location.lng}`}
            </Typography>
          </ListItem>
          <ListItem>
            <Button
              variant="contained" 
              color="primary"
              type="submit"
              fullWidth
            >
              Continue
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Shipping), { ssr: false });
