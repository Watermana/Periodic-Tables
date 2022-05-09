const knex = require("../db/connection");

async function list() {
    return knex("tables").orderBy("table_name");
}

async function read(table_id) {
    return knex("tables").where({table_id}).first();
}

async function readRes(reservation_id) {
    return knex("reservations").where({reservation_id}).first();
}

async function create(table) {
    return knex("tables")
        .insert(table);
}

async function seat(table_id, reservation_id) {
    return knex("tables")
        .where({table_id})
        .update({
            status: "Occupied",
            reservation_id
        });
}

module.exports = {
    list,
    read,
    readRes,
    create,
    seat,
}