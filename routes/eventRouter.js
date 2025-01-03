const router = require("express").Router();
const {
  createEvent,
  getFreeEvents,
  getUpcomingEvents,
  getSingleEvent,
  getAllEvents,
  payForAnEvent,
  getHostedEvents,
  getpreviousEvents,
  getEventsToAttend,
} = require("../controllers/eventControllers");
const auth = require("../middleware/auth");

router.post("/", auth, createEvent);
router.get("/upcoming", getUpcomingEvents);
router.get("/free", getFreeEvents);
router.get("/", getAllEvents);
router.get("/hosted", auth, getHostedEvents);
router.post("/pay/:eventId", auth, payForAnEvent);
router.get("/previous", auth, getpreviousEvents);
router.get("/attending", auth, getEventsToAttend);
router.get("/:eventId", getSingleEvent);

module.exports = router;
