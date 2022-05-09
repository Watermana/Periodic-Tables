import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today } from "../utils/date-time";
import {Link, useLocation} from "react-router-dom";
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
        <h4 className="mb-0">Reservations for date {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />

      <table className="table">
  <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">Table Name</th>
      <th scope="col">Capacity</th>
      <th scope="col">Status</th>
      <th scope="col">Reservation Seated</th>
      <th scope="col">Manage</th>
    </tr>
  </thead>

  <tbody>
    {tables.map((table, index) => {
      const {table_id, table_name, capacity, status, reservation_id}= table;
      return (
        <tr key={index}>
          <td>{table_id}</td>
          <td>{table_name}</td>
          <td>{capacity}</td>
          <td data-table-id-status={table.table_id}>{status}</td>
          <td>{reservation_id}</td>
        </tr>
      )
    })}
  </tbody>
</table>

      <table className="table">
  <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Moble Number</th>
      <th scope="col">Reservation Date</th>
      <th scope="col">Reservation Time</th>
      <th scope="col">Guests</th>
      <th scope="col">Manage</th>
    </tr>
  </thead>

  <tbody>
    {reservations.map((res, index) => {
      const {reservation_id, first_name, last_name, mobile_number, reservation_date, reservation_time, people}= res;
      return (
        <tr key={index}>
          <td>{reservation_id}</td>
          <td>{first_name}</td>
          <td>{last_name}</td>
          <td>{mobile_number}</td>
          <td>{reservation_date}</td>
          <td>{reservation_time}</td>
          <td>{people}</td>
          <td>
            <a href={`/reservations/${reservation_id}/seat`}>
              <button type="button" className="btn btn-primary">Seat</button>
            </a>
          </td>
          <td>
            <Link to={`/reservations/${reservation_id}/edit`}>
              <button type="button" className="btn btn-secondary">Edit</button>
            </Link>
          </td>
        </tr>
      )
    })}
  </tbody>
</table>
    </main>
  );
}

export default Dashboard;
