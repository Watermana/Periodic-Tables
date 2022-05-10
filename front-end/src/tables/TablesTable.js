import React from "react";
import { listReservations, listTables, unSeatTable, updateResStatus } from "../utils/api";
import axios from "axios";

export default function TablesTable({tables}) {
    const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";


    async function clickHandler({target}) {
        const resp = window.confirm("Is this table ready to seat new guests? This cannot be undone.");
        if(resp) {
          console.log(target.name);
          const url = new URL(`${API_BASE_URL}/tables/${target.name}/seat`);
          await axios.delete(url, {data: {}})
          window.location.reload();
        }
      }


    return(
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
                <td>
                  <button className="btn btn-primary" name={table_id} data-table-id-finish={table.table_id} onClick={clickHandler}>Finish</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
}