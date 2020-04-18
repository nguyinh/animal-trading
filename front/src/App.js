import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AppProvider } from "./contexts";
import Navigation from "./Navigation";

import { Profile, Market, PostCreator, Home } from "./pages";

function App() {
  return (
    <AppProvider>
      <Router>
        <div>
          <Navigation />

          <Switch>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/turnip-trend">
              <div className="wip">
                <span className="wip-title">Work in progress 👨‍💻🔥</span>
                <span className="wip-explanations">
                  icitupourraspartagertoncoursdunavetavectesmeilleurspotosmatin&après-midimaischutc'estunsecret
                </span>
              </div>
            </Route>
            <Route path="/market">
              <Market />
            </Route>

            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
