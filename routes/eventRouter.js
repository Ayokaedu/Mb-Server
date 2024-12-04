const router = require('express').Router()
const {createEvent, getFreeEvents, getUpcomingEvents, getSingleEvent } = require('../controllers/eventControllers')
const auth = require('../middleware/auth')

router.post('/', auth, createEvent)
router.get('/upcoming', getUpcomingEvents)
router.get("/free", getFreeEvents);
router.get("/:eventId", getSingleEvent)
module.exports = router
