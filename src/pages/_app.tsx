import "../style.css";
import React from "react";
import {
  MuiThemeProvider,
  createMuiTheme,
  CssBaseline,
} from "@material-ui/core";

const theme = createMuiTheme({
  typography: {
    fontFamily: `"Roboto", "Helvetica", sans-serif`,
    fontSize: 14,
  },
  palette: {
    type: "dark",
    primary: {
      main: "#EF6000",
      light: "#FFEEE2",
      dark: "#C85000",
      contrastText: "white",
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </MuiThemeProvider>
  );
}

export default MyApp;
