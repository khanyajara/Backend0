const express = require("express");
const router = express.Router();
const { 
  addJob, 
  updateJob, 
  deleteJob, 
  getJobs, 
  createBooking, 
  trackBooking,
  addSubscriptionPlan,
  updateSubscriptionPlan,
  getSubscriptionPlans
} = require('../controllers/db');

router.post('/addJob', addJob);
router.put('/updateJob/:id', updateJob);
router.delete('/deleteJob/:id', deleteJob);
router.get('/getJobs', getJobs);
router.post('/createBooking', createBooking);
router.get('/trackBooking/:bookingId', trackBooking);
router.post('/addSubscriptionPlan', addSubscriptionPlan);
router.put('/updateSubscriptionPlan/:id', updateSubscriptionPlan);
router.get('/getSubscriptionPlans', getSubscriptionPlans);

module.exports = router;
