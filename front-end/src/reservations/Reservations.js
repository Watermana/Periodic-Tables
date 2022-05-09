import React, { useEffect, useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";
import {useHistory} from "react-router-dom";
import {today} from "../utils/date-time";

function Reservations() {
    const history = useHistory();
    const DEFAULT_FORM_STATE = {
        first_name: '',
        last_name: '',
        mobile_number: '',
        reservation_date: '',
        reservation_time: '',
        people: ''
      };
      const [formdata, setFormData] = useState(DEFAULT_FORM_STATE);
      const [reservationsError, setReservationsError] = useState(null);
      const errors = [];

      function createHandler(event) {
        event.preventDefault();
        const abortController = new AbortController();
        const date = new Date(formdata.reservation_date);
        setReservationsError(null);
        const day = date.getDay();
        if(day === 1) {
          // console.log(formdata.reservation_date, today());
          errors.push("The restaraunt is closed on Tuesday. Please select another day.");
        }
        if(formdata.reservation_date < today()) {
          errors.push("\n cannot make a reservation in the past.")
        }
        if(formdata.reservation_time > "21:30:00" || formdata.reservation_time < "10:30:00") {
          errors.push("Reservations are between 10:30AM and 9:30PM. Please make one between these times.")
        }
        if(errors.length > 0){
          setReservationsError({message: errors});
        }else {
        createReservation(formdata, abortController.signal)
        .then(() => history.push('/dashboard?date=' + formdata.reservation_date))  
        .then(setFormData(DEFAULT_FORM_STATE));
          return () => abortController.abort();
        }
        
      }
    



      function changeHandler({ target }) {
        const data = target.value;
        if(target.name === "people") {
          setFormData({
            ...formdata,
            [target.name]: parseInt(data)
          })
        } else {
        setFormData({
          ...formdata,
          [target.name]: data
        })
        }
      }
    
      return (
          <main>
              <h1>Create a Reservation</h1>
              <ErrorAlert error={reservationsError} />
        <form onSubmit={createHandler} name="create">
          <table>
            <tbody>
              <tr>
                <td>
                  <input required id="first_name" name='first_name' onChange={changeHandler} value={formdata.first_name} placeholder="First Name"/>
                </td>
                <td>
                  <input required id="last_name" name='last_name' onChange={changeHandler} value={formdata.last_name} placeholder="Last Name"/>
                </td>
                <td>
                  <input required id="mobile_number" name='mobile_number' onChange={changeHandler} value={formdata.mobile_number} placeholder="Moble Number"/>
                </td>
                <td>
                  <input required type="date" id="reservation_date" name='reservation_date' onChange={changeHandler} value={formdata.reservation_date} placeholder="Reservation Date"/>
                </td>
                <td>
                  <input required type="time" id="reservation_times" name='reservation_time' onChange={changeHandler} value={formdata.reservation_time} placeholder="Reservation Time"/>
                </td>
                <td>
                  <input required id="people" name='people' onChange={changeHandler} value={formdata.people} placeholder="Guests"/>
                </td>
                <td>
                  <button type="submit">Create</button>
                </td>
                <td>
                  <button type="button" onClick={() => history.goBack()}>Cancel</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
        </main>
      )
}

export default Reservations;