const knex = require("../db/connection");

async function list() {
    return knex("reservations");
}

module.exports = {
    list,
}