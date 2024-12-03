const router = require('express').Router()
const {createEvent, getFreeEvents, getUpcomingEvents } = require('../controllers/eventControllers')
const auth = require('../middleware/auth')

router.post('/', auth, createEvent)
router.get('/upcoming', getUpcomingEvents)
router.get("/free", getFreeEvents);

module.exports = router
