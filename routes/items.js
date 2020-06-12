const express = require('express');
const router = express.Router();
const { items, sheet } = require('../controllers');
const { verifyJWT, findUser } = require('../middlewares');

router
  .route('/items/:itemId/bookings')
  .post(verifyJWT, findUser, items.createBooking)
  .delete(verifyJWT, findUser, items.deleteBooking);

router
  .route('/items/autocomplete/:startName')
  .get(verifyJWT, findUser, sheet.getAutocomplete);

router
.route('/items/generateDB')
.get(verifyJWT, findUser, sheet.generateDB);

module.exports = router;