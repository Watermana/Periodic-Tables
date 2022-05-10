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
            <h1>Search for reservations by mobile number</h1>
            <form onSubmit={submitHandler}>
                <div className="d-flex">
                <input className="form-control w-50 mt-3 mb-3" name="mobile_number" placeholder="Enter a customer's phone number" onChange={changeHandler}/>
                <button type="submit" className="btn btn-primary m-3">Find</button>
                </div>
            </form>
            <ReservationsTable reservations={reservations} />
        </main>
    )
}