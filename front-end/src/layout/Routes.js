import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import Reservations from "../reservations/Reservations";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import Tables from "../tables/Tables";
import SeatReservations from "../reservations/SeatReservations";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
      <Route path="/reservations/new">
        <Reservations />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <SeatReservations/>
      </Route>
      <Route path="/tables/new">
        <Tables/>
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
