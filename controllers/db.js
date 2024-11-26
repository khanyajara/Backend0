const { collection, addDoc, deleteDoc, updateDoc, getDocs, doc, getDoc } = require("firebase/firestore");
const { db } = require("../config/firebase");

const addSubscriptionPlan = async (req, res) => {
  const { name, price, features, duration } = req.body;
  try {
    const docRef = await addDoc(collection(db, "Subscriptions"), {
      name,
      price,
      features,
      duration,
    });
    res.json({ message: "Subscription plan added successfully" });
  } catch (error) {
    console.log("Error adding subscription plan", error);
    res.status(500).json({ error: "Failed to add subscription plan" });
  }
};

const getSubscriptionPlans = async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, "Subscriptions"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json({ data });
  } catch (error) {
    console.log("Error getting subscription plans", error);
    res.status(500).json({ error: "Failed to retrieve subscription plans" });
  }
};

const createUserSubscription = async (req, res) => {
  const { uid, planId } = req.body;
  try {
    const userRef = doc(db, "users", uid);
    const planRef = doc(db, "Subscriptions", planId);
    const planDoc = await getDoc(planRef);
    if (!planDoc.exists()) {
      return res.status(404).json({ message: "Plan not found" });
    }
    const userSubscriptionRef = await addDoc(collection(userRef, "UserSubscriptions"), {
      planId,
      status: "Active",
      createdAt: new Date(),
    });
    res.json({ message: "Subscription created successfully", subscriptionId: userSubscriptionRef.id });
  } catch (error) {
    console.log("Error creating user subscription", error);
    res.status(500).json({ error: "Failed to create user subscription" });
  }
};

const checkUserSubscription = async (req, res) => {
  const { uid } = req.params;
  try {
    const userRef = doc(db, "users", uid);
    const subscriptionsSnapshot = await getDocs(collection(userRef, "UserSubscriptions"));
    if (subscriptionsSnapshot.empty) {
      return res.status(404).json({ message: "No active subscription found" });
    }
    const activeSubscription = subscriptionsSnapshot.docs.find(doc => doc.data().status === "Active");
    if (!activeSubscription) {
      return res.status(403).json({ message: "Subscription expired or inactive" });
    }
    res.json({
      message: "Subscription active",
      subscriptionId: activeSubscription.id,
    });
  } catch (error) {
    console.log("Error checking user subscription", error);
    res.status(500).json({ error: "Failed to check subscription" });
  }
};

const addJob = async (req, res) => {
  const { title, description, salary, location, type, status, freelancerId } = req.body;
  try {
    const docRef = await addDoc(collection(db, "Jobs"), {
      title,
      description,
      salary,
      location,
      type,
      status,
      freelancerId,
      createdAt: new Date(),
    });
    res.json({ message: "Job posted successfully" });
  } catch (error) {
    console.log("Adding job error", error);
    res.status(500).json({ error: "Failed to post job" });
  }
};

const getJobs = async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, "Jobs"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json({ data });
  } catch (error) {
    console.log("Error getting jobs", error);
    res.status(500).json({ error: "Failed to retrieve jobs" });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const jobDocRef = doc(db, "Jobs", id);
    await deleteDoc(jobDocRef);
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.log("Error deleting job", error);
    res.status(500).json({ error: "Failed to delete job" });
  }
};

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    const jobDocRef = doc(db, "Jobs", id);
    const jobDoc = await getDoc(jobDocRef);
    if (!jobDoc.exists()) {
      return res.status(404).json({ message: "Job not found" });
    }
    await updateDoc(jobDocRef, { status });
    res.json({ message: "Job updated successfully" });
  } catch (error) {
    console.log("Error updating job", error);
    res.status(500).json({ error: "Failed to update job" });
  }
};

const createBooking = async (req, res) => {
  const { freelancerId, jobId, bidAmount, message } = req.body;
  try {
    const jobRef = doc(db, "Jobs", jobId);
    const freelancerRef = doc(db, "Freelancers", freelancerId);
    const jobDoc = await getDoc(jobRef);
    if (!jobDoc.exists()) {
      return res.status(404).json({ message: "Job not found" });
    }
    const bookingRef = await addDoc(collection(jobRef, "Bookings"), {
      freelancerId,
      bidAmount,
      message,
      status: "Pending",
      createdAt: new Date(),
    });
    res.json({ message: "Booking created successfully", bookingId: bookingRef.id });
  } catch (error) {
    console.log("Error creating booking", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

const trackBooking = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const bookingDocRef = doc(db, "Bookings", bookingId);
    const bookingDoc = await getDoc(bookingDocRef);
    if (!bookingDoc.exists()) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json({
      bookingId: bookingDoc.id,
      ...bookingDoc.data(),
    });
  } catch (error) {
    console.log("Error tracking booking", error);
    res.status(500).json({ error: "Failed to track booking" });
  }
};

module.exports = {
  addSubscriptionPlan,
  getSubscriptionPlans,
  createUserSubscription,
  checkUserSubscription,
  addJob,
  getJobs,
  deleteJob,
  updateJob,
  createBooking,
  trackBooking
};
