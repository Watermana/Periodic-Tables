import React from "react";
import { useState, useEffect } from "react";
import ReservationsTable from "../reservations/ReservationsTable";
import axios from "axios";
export default function Search() {

    const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

    const [reservations, setReservations] = useState([{}]);
    const [mobile, setMobile] = useState(null);
    async function submitHandler(event) {
        event.preventDefault();
        const url = new URL(`${API_BASE_URL}/reservations?mobile_number=${mobile}`);
        try{
            const search = await axios.get(url);
            setReservations(search.data.data);
        } catch(e) {
            return e;
        }
    }

    function changeHandler({target}) {
        console.log(target.value)
        setMobile(target.value);
    }

    return(
        <main>
            <form onSubmit={submitHandler}>
                <label htmlFor="mobile_number">Mobile Number</label>
                <input name="mobile_number" placeholder="Enter a customer's phone number" onChange={changeHandler}/>
                <button type="submit" className="btn btn-primary">Find</button>
            </form>
            <ReservationsTable reservations={reservations} />
        </main>
    )
}