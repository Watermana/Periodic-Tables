import React, {useState} from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import {createTable} from "../utils/api";

function Tables() {
    const DEFAULT_FORM_STATE = {
        table_name: "",
        capacity: 0,
    };
    const [formdata, setFormData] = useState(DEFAULT_FORM_STATE)
    const [errors, setErrors] = useState(null);
    const history = useHistory();
    const errorsArry = [];
    
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

      function createHandler(event) {
          event.preventDefault();
          const abortController = new AbortController();
          try{
              setErrors(null);
              const{table_name, capacity} = formdata;
              if(table_name.length < 2){
                  errorsArry.push("Table name must be at least 2 characters")
              }
              if(capacity < 1 || isNaN(capacity || !capacity)) {
                  errorsArry.push("\nTable capacity must be a number that is at least 1")
              }
              if(errorsArry.length > 0) {
                  setErrors({message: errorsArry})
              } else {
                createTable(formdata)
                    .then(setFormData(DEFAULT_FORM_STATE))
                    .then(history.push("/"))
              }
          } catch(e) {
              setErrors(e);
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
                  <input required id="table_name" name='table_name' onChange={changeHandler} value={formdata.table_name} placeholder="Table Name"/>
                </td>
                <td>
                  <input required id="capacity" name='capacity' onChange={changeHandler} value={formdata.capacity} placeholder="Capacity"/>
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

export default Tables;