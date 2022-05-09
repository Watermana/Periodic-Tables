/**
 * List handler for reservation resources
 */
const service = require("./tables.service");
const asnycErrorBoundary = require("../errors/asyncErrorBoundary");

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

    return next({status: 404, message: "Table not found"})
}

async function reservationExists(req, res, next) {
    const {reservation_id} = req.body.data;
    const reservation = await service.readRes(reservation_id)
    if(reservation) {
        res.locals.reservation = reservation;
        return next();
    }

    return next({status: 404, message: "Reservation does not exist"})
}

async function tableHasCapacity(req, res, next) {
    const {table, reservation} = res.locals;
    if(table.status === "Occupied") {
        return next({status: 400, message: "Table is already seated."})
    }
    if(table.capacity < reservation.people){
        return next({status:400, message: "Capacity at this seat is too low for reservation"})
    }
    return next();
}


//controllers

async function read(req, res) {

}

async function list(req, res) {
    return res.json({
        data: await service.list()
    });
}

async function seat(req, res) {
    const {table, reservation} = res.locals;
    console.log(table, reservation);
    await service.seat(table.table_id, reservation.reservation_id);
    return res.json({data: table});
}

async function create(req, res) {
    await service.create(req.body.data);
    return res.status(201).json({data: req.body.data});
}

module.exports = {
    list: asnycErrorBoundary(list),
    read: [asnycErrorBoundary(tableExists), asnycErrorBoundary(read)],
    seat: [asnycErrorBoundary(tableExists), asnycErrorBoundary(reservationExists), asnycErrorBoundary(tableHasCapacity), asnycErrorBoundary(seat)],
    create: [asnycErrorBoundary(bodyDataHas("table_name")), asnycErrorBoundary(bodyDataHas("capacity")), asnycErrorBoundary(create)]
}