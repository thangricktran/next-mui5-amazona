import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";
import { deepPurple, amber } from "@material-ui/core/colors";

// Create a theme instance.
// let theme = createTheme({
//   palette: {
//     mode: 'dark',
//     primary: deepPurple,
//     secondary: amber,
//   },
// });

// theme = responsiveFontSizes(theme);

let theme = (darkMode) => (
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

theme = responsiveFontSizes(theme);

export default theme;