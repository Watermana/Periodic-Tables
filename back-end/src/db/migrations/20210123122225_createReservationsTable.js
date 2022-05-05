exports.up = function (knex) {
  return knex.schema.createTable("reservations", (table) => {
    table.increments("reservation_id").primary();
    table.string("first_name");
    table.string("last_name");
    table.string("mobile_number");
    table.string("reservation_date");
    table.string("reservation_time");
    table.integer("people");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("reservations");
};


// {
//   "first_name": "Frank",
//   "last_name": "Palicky",
//   "mobile_number": "202-555-0153",
//   "reservation_date": "2020-12-30",
//   "reservation_time": "20:00",
//   "people": 1,
//   "created_at": "2020-12-10T08:31:32.326Z",
//   "updated_at": "2020-12-10T08:31:32.326Z"
// },