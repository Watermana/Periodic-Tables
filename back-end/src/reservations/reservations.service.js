const { where } = require("../db/connection");
const knex = require("../db/connection");

async function list() {
    return knex("reservations")
    
    .orderBy("reservation_date");
}

async function read(reservation_id) {
    return knex("reservations")
        .where({reservation_id})
        .first();
}

async function listReservationsOnDate(date) {
    return knex("reservations")
        .where({reservation_date: date})
        .whereNot({status: "finished"})
        .orderBy("reservation_time")
        .select();
}

async function create(reservation) {
    return knex("reservations")
        .insert(reservation);
}

async function setStatus(status, reservation_id) {
    return knex("reservations")
        .where({reservation_id})
        .update({
            status,
        })
        .returning("*").then((createdRecord => createdRecord[0]));
}

module.exports = {
    list,
    read,
    listReservationsOnDate,
    create,
    setStatus,
}