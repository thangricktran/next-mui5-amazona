import dynamic from 'next/dynamic';
import React, { useContext, useEffect } from 'react';
import Layout from 'components/Layout';
import useStyles from 'utils/styles';
// import NextLink from 'next/link';
import NextLink from "components/MuiNextLink";
import { 
  Button, List, ListItem, TextField, Typography 
} from '@material-ui/core';
import axios from 'axios';
import { Store } from 'utils/Store';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { getError } from 'utils/error';

function Login() {
  const { handleSubmit, control, formState: { errors } } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const { redirect } = router.query; //Ex. login?redirect=/shipping
  const { userInfo } = state;
  const classes = useStyles();

  useEffect(() => {
    if (userInfo) {
      router.push('/');
    }
  }, []);

  const onSubmitHandler = async ({ email, password }) => {
    closeSnackbar();
    try {
      const { data } = await axios.post('/api/users/login', {email, password});
      // console.log("pages login.js onSubmitHandler() data: \n", data);
      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', JSON.stringify(data));
      router.push(redirect || '/');
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
      // original: alert(err.response.data ? err.response.data.message : err.message);
      console.clear();
      return;
    }
  };

  return (
    <Layout title="Login">
      <form onSubmit={handleSubmit(onSubmitHandler)} className={classes.form} noValidate autoComplete="off">
        <Typography component="h1" variant="h1">
          Login
        </Typography>
        <List>
          <ListItem>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              }}
              render={({ field }) => (
                <TextField 
                  variant="outlined" 
                  fullWidth 
                  id="email" 
                  label="Email"
                  inputProps={{ type: 'email' }}
                  error={Boolean(errors.email)}
                  helperText={
                    errors.email
                      ? errors.email.type === 'pattern'
                        ? 'Email is not valid.'
                        : 'Email is required.'
                      : ''
                  }
                  {...field}
                >
                </TextField>
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 8,
              }}
              render={({ field }) => (
                <TextField 
                  variant="outlined" 
                  fullWidth 
                  id="password"                  
                  label="Password"
                  inputProps={{ type: 'password' }}
                  error={Boolean(errors.password)}
                  helperText={
                    errors.password
                      ? errors.password.type === 'minLength'
                        ? 'Password length should be more than 7.'
                        : 'Password is required.'
                      : ''
                  }
                  {...field}
                >
                </TextField>
              )}
            />
          </ListItem>
          <ListItem>
            <Button
              variant="contained" 
              color="primary"
              type="submit"
              fullWidth
            >
              Login
            </Button>
          </ListItem>
          <ListItem>
            Don&apos;t have an account? &nbsp; 
            <NextLink href={`/register?redirect=${redirect || '/'}`} underline="none">
              Register
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Login), { ssr: false });
