const knex = require("../db/connection");

async function list() {
    return knex("reservations").orderBy("reservation_date");
}

async function listReservationsOnDate(date) {
    return knex("reservations")
        .where({reservation_date: date})
        .orderBy("reservation_time")
        .select();
}

async function create(reservation) {
    return knex("reservations")
        .insert(reservation);
}

module.exports = {
    list,
    listReservationsOnDate,
    create,
}