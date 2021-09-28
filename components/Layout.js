import React, { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import NextLink from "components/MuiNextLink";
// import makeTheme from 'styles/theme';
// import useStyles, { setTheme } from 'utils/styles';
import { Store } from 'utils/Store';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { experimentalStyled as styled } from "@material-ui/core/styles";
import { 
  AppBar, Toolbar, Typography, ThemeProvider, CssBaseline, Switch, Badge, Button, Container,
  Menu, MenuItem, Box, IconButton, List, ListItem, Divider, ListItemText, Drawer, InputBase,
 } from '@material-ui/core';
import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";
import MenuIcon from '@material-ui/icons/Menu';
import CancelIcon from '@material-ui/icons/Cancel';
import SearchIcon from '@material-ui/icons/Search';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { getError } from 'utils/error';

const SearchSection = styled("div")(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    backgroundColor: theme.palette.secondary.main,
  },
}));
const SearchSectionSidebar = styled("div")(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    // width: '30px',
    marginLeft: '15px',
    // backgroundColor: theme.palette.secondary.main,
    backgroundColor: (theme) => theme.palette.common.white,
  },
}));
const SearchForm = styled("form")(() => ({
  border: '1px solid #ffffff',
  backgroundColor: '#ffffff',
  borderRadius: 5,
  height: 38,
  // margin: 0,
  // lineHeight: 8,
}));
const SearchFormSidebar = styled("form")(() => ({
  border: '1px solid #f8c040',
  backgroundColor: '#ffffff',
  borderRadius: 5,
}));
// const SearchInput = styled("input")(() => ({
//   paddingLeft: 5,
//   color: '#000000',
//   '& ::placeholder': {
//     color: '#606060',
//   },
// }));

const Layout = ({ title, description, children }) => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { darkMode, cart, userInfo } = state;
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  let theme = createTheme({
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      body1: {
        fontWeight: 'normal',
      },
    },
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#f0c000',
      },
      secondary: {
        main: '#208080',
      },
    }
  });
  theme = responsiveFontSizes(theme);

  const [darkModeState, setDarkModeState] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const sidebarOpenHandler = () => {
    setSidebarVisible(true);
  };
  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
  };

  const [categories, setCategories] = useState([]);
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`/api/products/categories`);
      setCategories(data);
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  const [query, setQuery] = useState('');
  const queryChangeHandler = (e) => {
    setQuery(e.target.value);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const newDarkMode = !darkMode;
    setDarkModeState(newDarkMode);
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
  };
  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const loginMenuCloseHandler = (e, redirect) => {
    setAnchorEl(null);
    if (redirect) {
      router.push(redirect);
    }
  };
  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: 'USER_LOGOUT' });
    Cookies.remove('userInfo');
    Cookies.remove('cartItems');
    Cookies.remove('shippingAddress');
    Cookies.remove('paymentMethod');
    router.push('/');
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setDarkModeState(darkMode);
  }, []);

  return (
    <div style={{width: '100vw'}}>
      <Head>
        <title>{title ? `${title} - Next Amazona` : 'Next Amazona'}</title>
        {description && <meta name="description" content={description} />}
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />

      <AppBar position="fixed" 
        style={{
          backgroundColor: darkMode ? '#000827' : '#203040',
          '& a': {
            color: '#ffffff',
            marginLeft: 10
          },
        }}
      >
        <Toolbar
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            height: 26,
          }}
        >
            <Box display="flex" alignItems="center">
              <IconButton
                edge="start"
                aria-label="open drawer"
                onClick={sidebarOpenHandler}
                sx={{ padding: 0 }}
              >
                <MenuIcon sx={{color: '#ffffff', textTransform: 'initial'}} />
              </IconButton>
              &nbsp;&nbsp;
              <NextLink href="/" underline="none">
                <Typography 
                  sx={{fontWeight: 'bold', fontSize: '1.5rem',
                    color: (theme) => theme.palette.common.white}}
                >Amazona</Typography>
              </NextLink>
            </Box>

            <Drawer
              anchor="left"
              open={sidebarVisible}
              onClose={sidebarCloseHandler}
            >
              <List>
                <ListItem>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography>Shopping by category</Typography>
                    <IconButton
                      aria-label="close"
                      onClick={sidebarCloseHandler}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider style={{marginBottom: 10}} light />

                <SearchSectionSidebar>
                  <SearchFormSidebar onSubmit={submitHandler}>
                    <InputBase
                      name="query"
                      style={{
                        paddingLeft: 5,
                        color: '#000000',
                        '& ::placeholder': {
                          color: '#606060',
                        },
                      }}
                      placeholder="Search products"
                      onChange={queryChangeHandler}
                    />
                    <IconButton 
                      type="submit"
                      style={{
                        margin: 0,
                        backgroundColor: '#f8c040',
                        padding: 5,
                        borderRadius: '0 5px 5px 0',
                        '& span': {
                          color: '#000000',
                        },
                        '& :hover': {
                          color: '#000000',
                        },
                      }}
                      aria-label="search"
                    >
                      <SearchIcon />
                    </IconButton>
                  </SearchFormSidebar>
                </SearchSectionSidebar>

                <Divider style={{marginTop: 10}} light />
                {categories.map((category) => (
                  <NextLink
                    key={category}
                    href={`/search?category=${category}`}
                    underline="none"
                  >
                    <ListItem
                      button
                      // component="a"
                      onClick={sidebarCloseHandler}
                    >
                      <ListItemText primary={category}></ListItemText>
                    </ListItem>
                  </NextLink>
                ))}
              </List>
            </Drawer>

            <SearchSection>
              <SearchForm onSubmit={submitHandler}>
                <InputBase
                  name="query"
                  style={{
                    paddingLeft: 5,
                    paddingBottom: 18,
                    width: 180,
                    margin: 0,
                    color: '#000000',
                    '& ::placeholder': {
                      color: '#606060',
                    }
                  }}
                  placeholder="Search products"
                  onChange={queryChangeHandler}
                />
                <IconButton 
                  type="submit"
                  style={{
                    margin: 0,
                    backgroundColor: '#f8c040',
                    padding: 5,
                    width: 35,
                    height: 35,
                    borderRadius: '0 5px 5px 0',
                    '& span': {
                      color: '#000000',
                    },
                    '& :hover': {
                      color: 'blue',
                    }
                  }}
                  aria-label="search"
                >
                  <SearchIcon />
                </IconButton>
              </SearchForm>
            </SearchSection>

            <div>
              <Switch checked={darkModeState} onChange={darkModeChangeHandler}></Switch>
              <NextLink href="/cart" underline="none">                
                  {cart.cartItems.length > 0 ? (
                    <Typography component="span">
                    <Badge
                      color="secondary"
                      badgeContent={cart.cartItems.length}
                    >
                      Cart
                    </Badge>
                    </Typography>
                  ) : (
                    <Typography component="span">
                      Cart
                    </Typography>
                  )}                
              </NextLink>
              {userInfo ? (
                <>
                  <Button
                    aria-controls="simple-profile-menu"
                    aria-haspopup="true"
                    onClick={loginClickHandler}
                    sx={{color: '#ffffff', textTransform: 'initial'}}                
                  >
                    {userInfo.name}
                  </Button>
                  <Menu
                    id="simple-profile-menu"                      
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem
                      onClick={(e) => loginMenuCloseHandler(e, '/profile')}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={(e) =>
                        loginMenuCloseHandler(e, '/order-history')
                      }
                    >
                      Order History
                    </MenuItem>
                    {userInfo.isAdmin && (
                      <MenuItem
                        onClick={(e) =>
                          loginMenuCloseHandler(e, '/admin/dashboard')
                        }
                      >
                        Admin Dashboard
                      </MenuItem>
                    )}
                    <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <NextLink href="/login" underline="none">
                  &nbsp;&nbsp;Login
                </NextLink>
              )}
            </div>
          </Toolbar>
      </AppBar>
      {children && (
        <div
          style={{
            marginTop: 70,
          }}
        >
          <Container 
            style={{
              // marginTop: 60,
              minHeight: '80vh',
            }}
          >
            {children}
          </Container>
          <footer 
            style={{
              marginTop: 20,
              textAlign: 'center'
            }}
          >
            <Typography>
              &copy; All rights reserved. Next Amazona.
            </Typography>
          </footer>
        </div>
      )}
      </ThemeProvider>
    </div>
  );
}

export default Layout;
