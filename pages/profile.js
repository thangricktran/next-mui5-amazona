import dynamic from 'next/dynamic';
import React, { useEffect, useContext } from 'react';
import NextLink from "components/MuiNextLink";
import { useRouter } from 'next/router';
import { Store } from "utils/Store";
import axios from 'axios';
import { getError } from 'utils/error';
import Layout from 'components/Layout';
import useStyles from 'utils/styles';
import Cookies from 'js-cookie';
import { Button, TextField, Card, Grid, List, ListItem, ListItemText, 
  Typography 
} from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

function Profile() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { handleSubmit, control, setValue, formState: { errors } } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { userInfo } = state;
  const classes = useStyles();

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }
    setValue('name', userInfo.name);
    setValue('email', userInfo.email);

  }, []);

  const onSubmitHandler = async ({ name, email,currentPassword, password, confirmPassword }) => {
    closeSnackbar();

    if ( password !== confirmPassword) {
      enqueueSnackbar("Passwords don't match", { variant: 'error' });
      return;
    }
    try {
      const { data } = await axios.put(
        '/api/users/profile',
        {
          name,
          email,
          currentPassword,
          password,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', JSON.stringify(data));
      // console.log("pages/profile.js onSubmitHandler() new data: \n", data);
      enqueueSnackbar('Profile updated successfully', { variant: 'success' });
      return;
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
      return;
    }
  };

  return (
    <Layout title="Profile">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/profile" underline="none">
                <ListItem selected>
                  <ListItemText primary="User Profile"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/order-history" underline="none">
                <ListItem>
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
                  Profile
                </Typography>
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
                          minLength: 2,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="name"
                            label="Name"
                            inputProps={{ type: 'text' }}
                            error={Boolean(errors.name)}
                            helperText={
                              errors.name
                                ? errors.name.type === 'minLength'
                                  ? 'Name length is more than 1'
                                  : 'Name is required'
                                : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
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
                        name="currentPassword"
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
                            id="currentPassword" 
                            label="Current Password"
                            inputProps={{ type: 'password' }}
                            error={Boolean(errors.currentPassword)}
                            helperText={
                              errors.currentPassword
                                ? errors.currentPassword.type === 'minLength'
                                  ? 'Password length is more than 7'
                                  : 'Password is required'
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
                          validate: (value) => {
                            if (value === '' || value.length < 8 ) { 
                              return 'Password length should be more than 7' 
                            }
                          },
                        }}
                        render={({ field }) => (
                          <TextField 
                            variant="outlined" 
                            fullWidth 
                            id="password" 
                            label="New Password"
                            inputProps={{ type: 'password' }}
                            error={Boolean(errors.password)}
                            helperText={
                              errors.password
                                ? 'Password length should be more than 7.'
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
                        name="confirmPassword"
                        control={control}
                        defaultValue=""
                        rules={{
                          validate: (value) => {
                            if (value === '' || value.length < 8 ) { 
                              return 'Password length should be more than 7' 
                            }
                          },
                        /*
                          validate: (value) => 
                            value === '' || 
                            value.length > 7 || 
                            'Confirm Password length should be more than 7',
                        */
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="confirmPassword"
                            label="New Confirm Password"
                            inputProps={{ type: 'password' }}
                            error={Boolean(errors.confirmPassword)}
                            helperText={
                              errors.confirmPassword
                                ? 'Confirm Password length should be more than 7.'
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
                        color="primary"
                        type="submit"
                        fullWidth
                      >
                        Update
                      </Button>
                    </ListItem>
                  </List>
                </form>                
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>

    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Profile), { ssr: false });
