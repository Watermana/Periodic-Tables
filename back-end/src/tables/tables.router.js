/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./tables.controller");
 
router.route("/")
    .get(controller.list)
    .post(controller.create);

router.route("/:table_id")
    .get(controller.read);

router.route("/:table_id/seat")
    .put(controller.seat);
 
module.exports = router;
 