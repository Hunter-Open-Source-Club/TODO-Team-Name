import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { grey, blue } from "@material-ui/core/colors";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";

const theme = createMuiTheme({
  shape: {
    borderRadius: 8,
  },
  props: {
    MuiButtonBase: {
      disableRipple: true, // No more ripple, on the whole application 💣!
    },
  },
  palette: {
    primary: {
      main: blue[500],
    },
    secondary: {
      main: grey[100],
    },
  },
  transitions: {
    duration: {
      shortest: 450,
      shorter: 500,
      short: 550,
      standard: 600,
      complex: 675,
      enteringScreen: 425,
      leavingScreen: 395,
    },
  },
});

const App: React.FunctionComponent = () => {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Switch>
            <Route component={Home} />
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
};
export default App;
