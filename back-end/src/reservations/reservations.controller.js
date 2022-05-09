/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asnycErrorBoundary = require("../errors/asyncErrorBoundary");
const { off } = require("../db/connection");
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
  return next();
}

//controllers

async function list(req, res) {
  const {date} = req.query;
  console.log(typeof date);
  if(date) {
    return res.json({
      data: await service.listReservationsOnDate(date)
    })
  }
  return res.json({
    data: await service.list(),
  });
}

async function create(req, res, next) {
  // console.log("I am being pinged", req.body.data)
  await service.create(req.body.data);
  res.status(201).json({
    data: req.body.data,
  });
}

module.exports = {
  list: asnycErrorBoundary(list),
  create: [
    asnycErrorBoundary(bodyDataHas("first_name")),
    asnycErrorBoundary(bodyDataHas("last_name")),
    asnycErrorBoundary(bodyDataHas("mobile_number")),
    asnycErrorBoundary(bodyDataHas("reservation_date")),
    asnycErrorBoundary(bodyDataHas("reservation_time")),
    asnycErrorBoundary(bodyDataHas("people")),
    asnycErrorBoundary(peopleIsNum),
    asyncErrorBoundary(dateIsNotDate),
    asnycErrorBoundary(timeIsTime),
    asnycErrorBoundary(dateisNotTuesday),
    asnycErrorBoundary(restarauntIsOpen),
    asnycErrorBoundary(dateIsFuture),
    asnycErrorBoundary(create)
  ]
};
