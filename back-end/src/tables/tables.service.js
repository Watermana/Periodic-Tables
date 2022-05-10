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

async function create(table){
    return knex("tables as t")
    .insert(table)
    .returning("*").then((createdRecord) => createdRecord[0]);
}

async function seatTable(table, reservation_id){
    return knex("reservations as r")
        .where({"reservation_id": reservation_id})
        .update({"status": "seated"})
        .then(() => {
            return knex("tables as t")
            .where({"table_id": table})
            .update({"status": "occupied", "reservation_id": reservation_id});
        })
}

async function unseatTable(table_id, reservation_id){
    return knex("tables as t")
        .select("*")
        .where({"table_id": table_id})
        .update({reservation_id: knex.raw("DEFAULT"), "status": "Free"})
        .then(() => {
            return knex("reservations as r")
            .where({"reservation_id": reservation_id})
            .update({"status": "finished"})
        });
}

module.exports = {
    list,
    read,
    readRes,
    create,
    seatTable,
    unseatTable,
}