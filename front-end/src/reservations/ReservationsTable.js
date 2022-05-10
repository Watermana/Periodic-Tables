import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import axios from "axios";

export default function ReservationsTable({reservations}) {
    const url = process.env.REACT_APP_API_BASE_URL;
    const history = useHistory();

    async function handleClick({target}) {
        try{
            const res = window.confirm("Do you want to cancel this reservation? This cannot be undone.")
            if(res) {
                await axios.put(`${url}/reservations/${target.value}/status`, {data: {status: "cancelled"}})
                history.go(0)
            }
        } catch(e) {
            return e;
        }
    }

    return (
    <>
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
        <th scope="col">Status</th>
        <th scope="col">Manage</th>
      </tr>
    </thead>
  
    <tbody>
      {reservations.map((res, index) => {
        const {reservation_id, first_name, last_name, mobile_number, reservation_date, reservation_time, people, status}= res;
        return (
          <tr key={index}>
            <td>{reservation_id}</td>
            <td>{first_name}</td>
            <td>{last_name}</td>
            <td>{mobile_number}</td>
            <td>{reservation_date}</td>
            <td>{reservation_time}</td>
            <td>{people}</td>
            <td data-reservation-id-status={reservation_id} >{status}</td>
            {status === "booked" &&(<td nowrap={"true"}>
              <Link to={`/reservations/${reservation_id}/seat`}>
                <button className="btn btn-primary">Seat</button>
              </Link>
              <Link to={`/reservations/${reservation_id}/edit`}>
                <button type="button" className="btn btn-secondary">Edit</button>
              </Link>
              <button data-reservation-id-cancel={reservation_id} value={reservation_id} className="btn btn-danger" onClick={handleClick}>Cancel</button>
            </td>)}
          </tr>
        )
      })}
    </tbody>
  </table>
    {reservations.length < 1 &&(<h2>No reservations found</h2>)}
  </>
    )
}