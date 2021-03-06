/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
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
      message: `New reservation must include ${propertyName}.`,
    });
  };
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id);
  if(reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  return next({status: 404, message: `reservation_id: ${reservation_id} does not exist.`})
}

function dateIsFuture(req, res, next){
  const { data: { reservation_date, reservation_time } = {} } = req.body;
  const today = new Date();
  const resDate = new Date(`${reservation_date} ${reservation_time}`);
  if (resDate < today) {
    return next({
      status: 400,
      message: `Reservations must be made in the future.`,
    });
  }
  return next();
}

function dateisNotTuesday(req, res, next){
  const { data: { reservation_date} = {} } = req.body;
  const date = new Date(reservation_date);
    if (date.getDay() == 1) {
      return next({
        status: 400,
        message: `Restaraunt is closed on Tuesdays. Please pick another time.`,
      });
    }
  return next();
}

function dateIsNotDate(req, res, next) {
  const {data: {reservation_date} = {}} =req.body;
  const isDate = (/\d\d\d\d-\d\d-\d\d/).test(reservation_date);
  if(!isDate) {
    return next({status:400, message: "reservation_date must be a valid date."})
  }
  return next();
}

function timeIsTime(req, res, next) {
  const {data: {reservation_time} = {}} = req.body;
  const isTime = (/\d\d:\d\d/).test(reservation_time);
  if(!isTime){
    return next({status: 400, message: "reservation_time must be a valid time."})
  }
  return next();
}

function restarauntIsOpen(req, res, next){
  const { data: { reservation_time} = {} } = req.body;
  if(reservation_time < "10:30" || reservation_time > "21:30") {
  return next({
    status: 400,
    message: `reservation_time must be when restaurant is open.`,
  });
  }
  return next();
}

function peopleIsNum(req, res, next) {
  const {data: {people} = {}} = req.body;
  if(typeof people !== "number"){
    return next({status: 400, message: "people must be a number."})
  }
  if(people < 1) {
    return next({status:400, message: "there must be at least one guest"})
  }
  return next();
}

function statusIsValid(req, res, next) {
  const {data: {status} = {} } = req.body;
  if(status) {
  if(status !== "booked") {
    return next({
      status:400,
      message: `${status} is invalid.`
    })
  }
}
  return next();
}

function statusExists(req, res, next) {
  const validStatus = ["booked", "seated", "finished", "cancelled"];
  const {data: {status} = {}} = req.body;
  if(validStatus.includes(status)) { 
    return next();
  }
  return next({
    status: 400,
    message: `status: ${status} is invalid.`
  })
}

function statusNotFinished(req, res, next) {
  const {status} = res.locals.reservation
  if(status === "finished") {
    return next({
      status: 400,
      message: "Cannot update a finished reservation"
    })
  }
  return next();
}

//controllers

async function read(req, res) {
  const reservation = res.locals.reservation;
  res.json({
    data: await service.read(reservation.reservation_id)
  })
}

async function list(req, res) {
  const { date, mobile_number } = req.query;
  if(date) {
      return res.status(200).json({
        data: await service.list(date)
      })
  } 
  else if(mobile_number) {
      return res.status(200).json({
        data: await service.list(null, mobile_number)
      })
  } 
  else {
      return res.json({
        data: await service.list()
      });
  }
}

async function create(req, res, next) {
  const {
    data: {
      first_name,
      last_name,
      mobile_number,
      people,
      reservation_date,
      reservation_time,
    } = {},
  } = req.body;

  const newReservation = {
    first_name,
    last_name,
    mobile_number,
    people,
    reservation_date,
    reservation_time,
  };

  const resp = await service.create(newReservation);
  res.status(201).json({ data: resp });
}

async function setStatus(req, res) {
  const {data: {status} = {} } = req.body;
  const {reservation_id} = req.params;
  res.status(200).json({
    data: await service.setStatus(status, reservation_id)
  })
}

async function update(req, res) {
  const updatedReservation = {
    ...req.body.data
  };
  const {reservation_id} = res.locals.reservation;
  res.status(200).json({
    data: await service.update(updatedReservation, reservation_id)
  })
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  create: [
    asyncErrorBoundary(bodyDataHas("first_name")),
    asyncErrorBoundary(bodyDataHas("last_name")),
    asyncErrorBoundary(bodyDataHas("mobile_number")),
    asyncErrorBoundary(bodyDataHas("reservation_date")),
    asyncErrorBoundary(bodyDataHas("reservation_time")),
    asyncErrorBoundary(bodyDataHas("people")),
    asyncErrorBoundary(peopleIsNum),
    asyncErrorBoundary(dateIsNotDate),
    asyncErrorBoundary(timeIsTime),
    asyncErrorBoundary(dateisNotTuesday),
    asyncErrorBoundary(restarauntIsOpen),
    asyncErrorBoundary(dateIsFuture),
    asyncErrorBoundary(statusIsValid),
    asyncErrorBoundary(create)
  ],
  setStatus: [
    asyncErrorBoundary(bodyDataHas("status")),
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(statusExists),
    asyncErrorBoundary(statusNotFinished),
    asyncErrorBoundary(setStatus)
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(bodyDataHas("first_name")),
    asyncErrorBoundary(bodyDataHas("last_name")),
    asyncErrorBoundary(bodyDataHas("mobile_number")),
    asyncErrorBoundary(bodyDataHas("reservation_date")),
    asyncErrorBoundary(bodyDataHas("reservation_time")),
    asyncErrorBoundary(bodyDataHas("people")),
    asyncErrorBoundary(peopleIsNum),
    asyncErrorBoundary(dateIsNotDate),
    asyncErrorBoundary(timeIsTime),
    asyncErrorBoundary(dateisNotTuesday),
    asyncErrorBoundary(restarauntIsOpen),
    asyncErrorBoundary(dateIsFuture),
    asyncErrorBoundary(update)
  ]
};
