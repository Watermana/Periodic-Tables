import React, { useEffect, useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import {useHistory} from "react-router-dom";
import {today} from "../utils/date-time";
import axios from "axios";

function ReservationsForm({reservation, edit = false}) {
  const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL + "/reservations";
    const history = useHistory();
    const DEFAULT_FORM_STATE = {
        first_name: '',
        last_name: '',
        mobile_number: '',
        reservation_date: '',
        reservation_time: '',
        people: ''
      };
      const [formdata, setFormData] = useState(reservation || DEFAULT_FORM_STATE);
      const [errors, setErrors] = useState(null);

      const handleSubmit = async (event) => {
        event.preventDefault();
        const abortController = new AbortController();
        try{
          setErrors(null)
          if(edit){
            await axios.put(`${API_BASE_URL}/${reservation.reservation_id}`, {data: formdata});
          }else{
            await axios.post(API_BASE_URL, {data: formdata});
          }
          history.push(`/dashboard?date=${formdata.reservation_date}`)
          return () => abortController.abort();
        }catch(e){
          setErrors(e.response.data.error)
        }
        
      };
    



      function changeHandler({ target }) {
        const data = target.value;
        if(target.name === "people" && target.value) {
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
              <ErrorAlert error={errors} />
        <form onSubmit={handleSubmit} name="create">
          <table>
            <tbody>
              <tr>
                <td>
                  <input required className="form-control" id="first_name" name='first_name' onChange={changeHandler} value={formdata.first_name} placeholder="First Name"/>
                </td>
                <td>
                  <input required className="form-control" id="last_name" name='last_name' onChange={changeHandler} value={formdata.last_name} placeholder="Last Name"/>
                </td>
                <td>
                  <input required className="form-control" id="mobile_number" name='mobile_number' onChange={changeHandler} value={formdata.mobile_number} placeholder="Moble Number"/>
                </td>
                <td>
                  <input required className="form-control" type="date" id="reservation_date" name='reservation_date' onChange={changeHandler} value={formdata.reservation_date} placeholder="Reservation Date"/>
                </td>
                <td>
                  <input required className="form-control" type="time" id="reservation_times" name='reservation_time' onChange={changeHandler} value={formdata.reservation_time} placeholder="Reservation Time"/>
                </td>
                <td>
                  <input required className="form-control" type="number" id="people" name='people' onChange={changeHandler} value={formdata.people} placeholder="Guests"/>
                </td>
                <td>
                  {!edit ? (<button className="btn btn-primary" type="submit">Create</button>) : (<button type="submit" className="btn btn-primary">Submit</button>)}
                </td>
                <td>
                  <button type="button" className="btn btn-danger" onClick={() => history.goBack()}>Cancel</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
        </main>
      )
}

export default ReservationsForm;