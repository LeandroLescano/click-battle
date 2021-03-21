import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import App from "./App";
import RoomGame from "./roomGame";

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={App} />
        <Route exact path="/:idGame" component={RoomGame} />
      </Switch>
    </Router>
  );
}
