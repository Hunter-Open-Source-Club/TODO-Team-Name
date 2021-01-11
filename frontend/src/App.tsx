import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";
import Home from "pages/Home";

const App: React.FunctionComponent = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route component={Home} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};
export default App;
