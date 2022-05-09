/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function listReservations(params, signal) {
  console.log(params);
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Retrieves all existing tables.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of table saved in the database.
 */

 export async function listTables(signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  return await fetchJson(url, { headers, signal }, [])
}


/**
 * Creates a new reservation in the DB.
 * @param {Object} reservation Containing all data for reservation
 * @param {*} signal 
 */
export async function createReservation(reservation, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  // console.log(reservation);
  return await fetchJson(url, {method: 'POST',
  body: JSON.stringify({data: reservation}),
  headers, signal}, [])
}

export async function seatTable(table_id, reservation_id, signal){
  console.log("hello");
  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
  try {
  return await fetchJson(url, {method: 'PUT',
  body: JSON.stringify({data: {reservation_id}}),
  headers, signal}, [])
  } catch(e) {
    return e;
  }
}

export async function createTable(table, signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  try {
  return await fetchJson(url, {method: 'POST',
  body: JSON.stringify({data: table}),
  headers, signal}, [])
  } catch(e) {
    return e;
  }
}