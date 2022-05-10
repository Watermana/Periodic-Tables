const { where } = require("../db/connection");
const knex = require("../db/connection");

async function list(date, mobile_number) {
    if(date) {
        return knex("reservations")
            .where({reservation_date: date})
            .whereNot({status: "finished"})
            .orderBy("reservation_time")
            .select();
    } else if(mobile_number) {
        return knex("reservations")
            .whereRaw(
              "translate(mobile_number, '() -', '') like ?",
              `%${mobile_number.replace(/\D/g, "")}%`
            )
            .orderBy("reservation_date");
    } else {
        return knex("reservations")
            .whereNot({status: "finished"})
            .orderBy("reservation_date");
    }
}

async function read(reservation_id) {
    return knex("reservations")
        .where({reservation_id})
        .first();
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
        .returning("*")
        .then((createdRecord => createdRecord[0]));
}

async function update(reservation, reservation_id) {
    return knex("reservations")
        .where({reservation_id})
        .update(reservation, "*")
        .then(updatedRecord => updatedRecord[0])
}

module.exports = {
    list,
    read,
    create,
    setStatus,
    update
}