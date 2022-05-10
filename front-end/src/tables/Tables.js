import React, {useState} from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import {createTable} from "../utils/api";
import axios from "axios";

function Tables() {
    const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

    const DEFAULT_FORM_STATE = {
        table_name: "",
        capacity: 0,
    };
    const [formdata, setFormData] = useState(DEFAULT_FORM_STATE)
    const [errors, setErrors] = useState(null);
    const history = useHistory();
    
    function changeHandler({ target }) {
        const data = target.value;
        if(target.name === "capacity") {
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

      async function createHandler(event) {
          event.preventDefault();
          const abortController = new AbortController();
          try{
              setErrors(null);
              const{table_name, capacity} = formdata;
              const url = new URL(`${API_BASE_URL}/tables`)
              await axios.post(url, {data: formdata})
              setFormData(DEFAULT_FORM_STATE);
              history.push("/")
              return () => abortController.abort();
          } catch(e) {
              setErrors(e.response.data.error);
          }
      }


    return(
        <main>
        <h1>Tables</h1>
        <ErrorAlert error={errors}/>
        <form onSubmit={createHandler} name="create">
          <table>
            <tbody>
              <tr>
                <td>
                  <input required className="form-control" id="table_name" name='table_name' onChange={changeHandler} value={formdata.table_name} placeholder="Table Name"/>
                </td>
                <td>
                  <input required className="form-control" type="number" id="capacity" name='capacity' onChange={changeHandler} value={formdata.capacity} placeholder="Capacity"/>
                </td>
                <td>
                  <button type="submit" className="btn btn-primary">Create</button>
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

export default Tables;