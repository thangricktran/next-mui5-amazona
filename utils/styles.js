import { makeStyles } from '@material-ui/styles';
import { createTheme } from '@material-ui/core/styles';
import { useContext } from 'react';
import { Store } from 'utils/Store';
// // import { createStyles } from '@material-ui/styles';
// import { createTheme, createStyles } from '@material-ui/core/styles';

export const setTheme = (darkMode) => (
  createTheme({
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
  })
);

const useStyles = makeStyles((darkMode=false) => ({
    navbar: {
      // #010512 #010512 #482880
      // backgroundColor: darkMode ? '#020A29' : '#203040',
      // backgroundColor: darkMode ? '#020A25' : '#203040',
      // backgroundColor: darkMode ? '#02113D' : '#203040',
      // backgroundColor: darkMode ? '#000066' : '#203040',
      backgroundColor: darkMode ? '#000827' : '#203040',
      '& a': {
        color: '#ffffff',
        marginLeft: 10
      },
      //boxShadow: darkMode ? 'inset 5% 0 10px #000827' : 'inset 5% 0 10px #203040',
    },
    brand: {
      fontWeight: 'bold',
      fontSize: '1.5rem'
    },
    grow: {
      flexGrow: 1
    },
    // main: {
    //   minHeight: '80vh',
    // },
    // footer: {
    //   marginTop: 20,
    //   textAlign: 'center'
    // },
    section: {
      marginTop: 10,
      marginBottom: 10,
    },
    form: {
      width: '100%',
      maxWidth: 800,
      margin: '0 auto',
    },
    formStripeCheckoutCmpt: {
      margin: '15px 5px',
      input: {
        color: darkMode ? '#ffffff' : '#000000'
      },
    },
    submitBtn: {
      margin: '15px 20px',
      with: '40px',
      height: '30px',
      fontSize: 18
    },
    muiBtn: {
      margin: '20px auto',
    },
    testCardNumber: {
      margin: '10px 5px',
      fontSize: 12,
    },
    navbarButton: {
      color: '#ffffff',
      textTransform: 'initial',
    },
    transparentBackground: {
      backgroundColor: 'transparent',
      marginTop: 20,
    },
    quantity: {
      '& .MuiTextField-root': {
        marginTop: '6px',
        marginBottom: '6px',
        // width: '44px',
        // height: '40px',
      },
    },
    error: {
      color: '#f04040',
    },
    fullWidth: {
      width: '100%',
    },
    reviewForm: {
      maxWidth: 800,
      width: '100%',
    },
    reviewItem: {
      marginRight: '1rem',
      borderRight: '1px #808080 solid',
      paddingRight: '1rem',
    },
    toolbar: {
      justifyContent: 'space-between',
    },
    menuButton: { padding: 0 },
    mt1: { marginTop: '1rem' },
    carbanner: {
      marginTop: '1rem',
      backgroundColor: 'inherit',
    },
    // search
    searchSection: {
      display: 'none',
      ["@media (min-width:300px)"]: {
        display: 'flex',
      },
    },
    searchForm: {
      border: '1px solid #ffffff',
      backgroundColor: '#ffffff',
      borderRadius: 5,
    },
    searchInput: {
      paddingLeft: 5,
      color: '#000000',
      '& ::placeholder': {
        color: '#606060',
      },
    },
    iconButton: {
      backgroundColor: '#f8c040',
      padding: 5,
      borderRadius: '0 5px 5px 0',
      '& span': {
        color: '#000000',
      },
    },
    sort: {
      marginRight: 5,
    },
    fullWidth: {
      width: '100%',
    },

    fullContainer: { height: '100vh' },
    mapInputBox: {
      position: 'absolute',
      display: 'flex',
      left: 0,
      right: 0,
      margin: '10px auto',
      width: 300,
      height: 40,
      '& input': {
        width: 250,
      },
    },

    // CAROUSEL CSS
    // sectionTitle: {
    //   textAlign: 'center',
    //   margin: '4rem 0 6rem 0',
    // },
    // underline: {
    //   width: '8rem',
    //   height: '0.25rem',
    //   background: 'hsl(205, 78%, 60%)',
    //   margin: '0px auto',
    // },
    // carousel: {
    //   // border: '3px solid green',
    //   width: '90%',
    //   maxWidth: '1170px',
    //   margin: '.5rem auto 0px',
    //   position: 'relative',
    //   display: 'flex',
    //   flexDirection: 'column',
    // },
    // itemsWrapper: {
    //   // border: '3px solid blue',
    //   position: 'relative',
    //   width: '100%',
    //   height: '330px',
    // },

    // container: {
    //   position: 'absolute',
    //   display: 'grid',
    //   gap: '2rem',
    //   width: '100%',
    //   // height: '100%',
    //   marginBottom: '4rem',
    //   opacity: 0,
    //   transition: 'all 0.4s linear',
    //   '&.activeSlide': {
    //     opacity: 1,
    //     transform: 'translateX(0)',
    //   },
    //   '&.lastSlide': {
    //     transform: 'translateX(-100%)',
    //   },
    //   '&.nextSlide': {
    //     transform: 'translateX(100%)',
    //   },
      // ex. ["@media (min-height:800px)"]: { marginTop: 10 }
      // '@media (min-width: 576px)' : {
    //  ["@media (min-width:576px)"]: {
    //     'grid-template-columns': 'repeat(auto-fill, minmax(250px, 1fr))',
    //   },
    // },
    // ex. ["@media (min-height:800px)"]: { marginTop: 10 }
    // @media screen and (min-width: 576px) {
    //   container {
    //     grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    //   },
    // },
    // card: {
    //   background: '#fff',
    //   borderRadius: '0.75rem',
    //   boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    //   padding: '.5rem 1rem',
    //   textAlign: 'center',
    //   '& img': {
    //     width: '280px',
    //     height: '220px',
    //     borderRadius: '5%',
    //     objectFit: 'cover',
    //     marginBottom: '0.5rem',
    //   },
    //   '& h4': {
    //     marginTop: '0rem',
    //     paddingTop: '0rem',
    //     marginBottom: '0.5rem',
    //     fontSize: '0.85rem',
    //     color: 'hsl(210, 22%, 49%)',
    //   },
    //   linkUrl: {
    //     margin: '0px auto',
    //     padding: '0px',
    //   },
    // },

    // btn: {
    //   padding: '0.35rem 0.75rem',
    //   marginBottom: '1.8rem',
    //   letterSspacing: '1.6px',
    //   fontSize: '0.75rem',
    //   color: '#D4AF37',
    //   // background: 'hsl(205, 78%, 60%)',
    //   // borderRadius: '0.75rem',
    //   borderColor: 'transparent',
    //   textTransform: 'uppercase',
    //   transition: 'all 0.4s linear',
    //   cursor: 'pointer',
    // },

    // imgCenter: {
    //   ["@media (min-width:275px)"]: {
    //     margin: '0 auto',
    //   },
    // },

    // btnContainer: {
    //   // position: absolute;
    //   display: 'flex',
    //   justifyContent: 'center',
    //   flexWrap: 'wrap',
    //   // '@media (min-width: 775px)' : {
    //   ["@media (min-width:775px)"]: {
    //     margin: '0 auto',
    //     maxWidth: '700px',
    //   },

    // },

    // pageBtn: {
    //   width: '2rem',
    //   height: '2rem',
    //   background: 'hsl(205, 90%, 76%)',
    //   borderColor: 'transparent',
    //   borderRadius: '5px',
    //   cursor: 'pointer',
    //   margin: '0.5rem',
    //   transition: 'all 0.4s linear',
    //   outline: 'none',
    // },
    // prevBtn: {
    //   background: 'transparent',
    //   borderColor: 'transparent',
    //   color: '#D4AF37',
    //   fontWeight: 'bold',
    //   textTransform: 'capitalize',
    //   letterSpacing: '0.1rem',
    //   margin: '0.5rem',
    //   fontSize: '1rem',
    //   cursor: 'pointer',
    //   outline: 'none',
    // },
    // nextBtn: {
    //   background: 'transparent',
    //   borderColor: 'transparent',
    //   color: '#D4AF37',
    //   fontWeight: 'bold',
    //   textTransform: 'capitalize',
    //   letterSpacing: '0.1rem',
    //   margin: '0.5rem',
    //   fontSize: '1rem',
    //   cursor: 'pointer',
    //   outline: 'none',
    // },

}));

export default useStyles;
