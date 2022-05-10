import React, { useEffect, useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import {useHistory} from "react-router-dom";
import {useParams} from "react-router";
import ReservationsForm from "./ReservationsForm";
import axios from "axios";
import { formatAsDate } from "../utils/date-time";

function EditReservations() {
    const url = process.env.REACT_APP_API_BASE_URL;
    const {reservation_id} = useParams();
    const [reservation, setReservation] = useState(null);
    const [reservationError, setReservationError] = useState(null);

    useEffect(() => {
        const abortController = new AbortController();
        axios.get(`${url}/reservations/${reservation_id}`, {signal: abortController.signal})
        .then(resp => setReservation({...resp.data.data, reservation_date: formatAsDate(resp.data.data.reservation_date)}))
        .catch(setReservationError)
        return () => abortController.abort();
    }, [url, reservation_id]);

    return (
        <>
        <h1>Edit Reservation</h1>
        {reservation &&(
            <ReservationsForm reservation={reservation} edit={true}/>
        )}
        </>
    )
}

export default EditReservations;