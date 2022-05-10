/**
 * List handler for reservation resources
 */
const service = require("./tables.service");
const asnycErrorBoundary = require("../errors/asyncErrorBoundary");
const { table } = require("../db/connection");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//middlewares

function bodyDataHas(propertyName) {
    return function (req, res, next) {
      const { data = {} } = req.body;
      if (data[propertyName]) {
        return next();
      }
      next({
        status: 400,
        message: `New Table must include ${propertyName}.`,
      });
    };
  }

async function tableExists(req, res, next) {
    const {table_id} = req.params;
    const table = await service.read(table_id)
    if(table) {
        res.locals.table = table;
        return next();
    }

    return next({status: 404, message: `Table: ${table_id} not found`})
}

async function reservationExists(req, res, next) {
    const {reservation_id = null} = req.body.data;
    const reservation = await service.readRes(reservation_id)
    if(reservation) {
        res.locals.reservation = reservation;
        return next();
    }

    return next({status: 404, message: `reservation_id: ${reservation_id} does not exist`})
}

async function tableHasCapacity(req, res, next) {
    const {table, reservation} = res.locals;
    if(table.status === "Occupied") {
        return next({status: 400, message: "Table is already occupied."})
    }
    if(table.capacity < reservation.people){
        return next({status:400, message: "capacity at this seat is too low for reservation"})
    }
    return next();
}

function capacityIsNumber(req, res, next) {
    const {data: {capacity} = {} } = req.body;
    if(typeof capacity !== "number") {
        return next({
            status:400,
            message: "capacity must be a number."
        })
    }
    return next();
}

function tableNameisValid(req, res, next) {
    const {data: {table_name} = {} } = req.body;
    if(table_name.length < 2) {
        return next({
            status:400,
            message: "table_name must be at least two characters."
        })
    }
    return next();
}

function tableNotOccupied(req, res, next) {
    const {table} = res.locals;
    if(table.status === "Free") {
        return next()
    }
    return next({
        status:400,
        message: "Table is already occupied."
    })
}

function reservationNotSeated(req, res, next) {
    const {reservation} = res.locals;
    if(reservation.status === "seated") {
        return next({
            status:400,
            message: "Reservation is already seated"
        });
    }
    return next();
}

function tableIsOccupied(req, res, next) {
    const {table} = res.locals;
    if(table.status === "Occupied") {
        return next()
    }
    return next({
        status:400,
        message: "Table is not occupied."
    })
}

//controllers

async function read(req, res) {
    const table = res.locals.table;
    return res.json({
        data: table
    })
}

async function list(req, res) {
    return res.json({
        data: await service.list()
    });
}

async function seat(req, res) {
    const {table, reservation} = res.locals;
    // console.log(table, reservation);
    await service.seat(table.table_id, reservation.reservation_id);
    await service.seatReservation(reservation.reservation_id);
    return res.json({data: table});
}

async function create(req, res) {
    await service.create(req.body.data);
    return res.status(201).json({data: req.body.data});
}

async function unSeat(req, res, next) {
    const {table_id} = req.params;
    const table = res.locals.table;
    if(table.status === "Free") {
        return next({
            status:400,
            message:"This table is not occupied."
        })
    }
    await service.unSeat(table_id)
    await service.unSeatReservation(table.reservation_id);
    return res.sendStatus(200);
}

module.exports = {
    list: asnycErrorBoundary(list),
    read: [asnycErrorBoundary(tableExists), asnycErrorBoundary(read)],
    seat: [
        asnycErrorBoundary(bodyDataHas("reservation_id")),
        asnycErrorBoundary(tableExists),
        asnycErrorBoundary(reservationExists),
        asnycErrorBoundary(tableHasCapacity),
        asnycErrorBoundary(tableNotOccupied),
        asnycErrorBoundary(reservationNotSeated),
        asnycErrorBoundary(seat)],
    create: [
        asnycErrorBoundary(bodyDataHas("table_name")),
        asnycErrorBoundary(bodyDataHas("capacity")),
        asnycErrorBoundary(capacityIsNumber),
        asnycErrorBoundary(tableNameisValid),
        asnycErrorBoundary(create)],
    unSeat: [
        asyncErrorBoundary(tableExists),
        asyncErrorBoundary(tableIsOccupied),
        asyncErrorBoundary(unSeat)]
}