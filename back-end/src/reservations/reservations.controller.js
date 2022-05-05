/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");


async function list(req, res) {
  res.json({
    data: await service.list(),
  });
}

module.exports = {
  list,
};
