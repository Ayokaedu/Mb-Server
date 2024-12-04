const EVENT = require("../models/event");
const USER = require("../models/user");
const cloudinary = require("cloudinary").v2;
const fs = require("fs"); // file system

const createEvent = async (req, res) => {
  const { userId } = req.user;
  const {
    date,
    title,
    startTime,
    endTime,
    location,
    description,
    tags,
    free,
    online,
    category,
  } = req.body;
  try {
    if (
      !date ||
      !startTime ||
      !endTime ||
      !description ||
      !tags ||
      !title ||
      !category ||
      (!location && !online)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    //   image upload request.files
    const imageFile = req.files.image.tempFilePath;
    //    upload the image to cloudinary
    const uploadededImage = await cloudinary.uploader.upload(imageFile, {
      use_filename: true,
      folder: "mbevents",
    });
    // delete file from server
    fs.unlinkSync(req.files.image.tempFilePath);

    // create a new event
    const newEvent = new EVENT({
      image: uploadededImage.secure_url,
      title,
      date,
      startTime,
      endTime,
      description,
      category,
      location: online === "true" ? "online" : location,
      tags: Array.isArray(tags) ? tags : tags.split(','),
      price: {
        free: free === "true",
        regular: free === "true" ? 0 : req.body?.regularPrice,
        vip: free === "true" ? 0 : req.body?.vipPrice,
      },
      hostedBy: userId,
    });
    const event = await newEvent.save();
    res.status(201).json({ success: true, event });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

  // 
const getUpcomingEvents = async (req, res) => {
  try {
    const currentDate = new Date();
    const upcomingEvents = await EVENT.find({ date: { $gte: currentDate } })
      .sort("date") // sort by date in ascending order
      .limit(4).populate('hostedBy', 'ful'); // limit events to 4
    res.status(200).json({ success: true, events: upcomingEvents });
  } catch (error) {
    res.status(400).json({message: error.message})
  }
};

const getFreeEvents = async (req, res) => {
  // free events in the future
 try {
  const currentDate = new Date()
  const freeEvents = await EVENT.find({date:{$gte: currentDate}, "price.free": true,
  })
  .sort('date').limit(6)
  res.status(200).json({success: true, events: freeEvents})
 } catch (error) {
  res.status(400).json({message: error.message})
 }
};

const getSingleEvent = async (req, res) =>{
  res.send('get single event')
}

module.exports = { createEvent, getUpcomingEvents, getFreeEvents, getSingleEvent };
