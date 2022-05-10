import React, { useEffect, useState } from "react";
import { listReservations, listTables, unSeatTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today } from "../utils/date-time";
import {Link, useLocation} from "react-router-dom";
import ReservationsTable from "../reservations/ReservationsTable";
import TablesTable from "../tables/TablesTable";
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const URL = process.env.REACT_APP_API_BASE_URL;
  const search = useLocation().search;
  const currentDate = new URLSearchParams(search).get("date");
  let date = currentDate || today();
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadDashboard, [date, URL]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);

    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date: {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />

      <TablesTable tables={tables} />
      <ReservationsTable reservations={reservations} />

    </main>
  );
}

export default Dashboard;
