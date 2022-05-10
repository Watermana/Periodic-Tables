import React, { useEffect, useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import {useHistory} from "react-router-dom";
import {useParams} from "react-router";
import { listTables, seatTable} from "../utils/api";
import axios from "axios";

function SeatReservations() {
    const url = process.env.REACT_APP_API_BASE_URL;
    const {reservation_id} = useParams();
    const [tables, setTables] = useState([]);
    const [tablesError, setTablesError] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const history = useHistory();

    useEffect(loadTables, [url]);

    function loadTables() {
        const abortController = new AbortController();
        listTables(abortController.signal)
        .then(setTables)
        .catch(setTablesError);
        return () => abortController.abort();
    }

    const options = tables.map((table) => (
        <option value={table.table_id} key={table.table_id}>{table.table_name} - {table.capacity}</option>
    ))

    function changeHandler({target}) {
        setSelectedTable(Number(target.value));
    }

    async function submitHandler(event) {
        event.preventDefault();
        try{
            console.log(selectedTable)
            const API_URL = new URL(`${url}/tables/${selectedTable}/seat`);
            await axios.put(API_URL, {data: {reservation_id}});
            setTimeout(() => {
                history.push("/")
            }, 500);
        } catch(e) {
            setTablesError(e);
        }
    }


    console.log(tables);
    return (
        <main>
            <h1>Seat Reservation</h1>
            <ErrorAlert error={tablesError}/>
            <form onSubmit={submitHandler}>
                <label htmlFor="table_id">Select a table:</label>
                <select name="table_id" onChange={changeHandler}>
                <option>Click to expand</option>
                {options}
                </select>
                <button type="submit" className="btn btn-primary">Submit</button>
                <button type="button" className="btn btn-danger" onClick={() => history.goBack()}>Cancel</button>
            </form>
        </main>
    )
}

export default SeatReservations;
