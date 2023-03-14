const fs = require("fs");
const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(cors({ origin: CORS_ORIGIN }));

// Read video data from JSON file
function readVideos() {
  const videosFile = fs.readFileSync("./data/video-details.json");
  const videosData = JSON.parse(videosFile);
  return videosData;
}

// Write video upload to JSON file
function writeVideos(data) {
  const stringifiedData = JSON.stringify(data);
  fs.writeFileSync("./data/video-details.json", stringifiedData);
}

// GET /videos
app.get("/videos", (req, res) => {
  const videos = readVideos();
  res.status(200).send(videos);
});

// GET specific video
app.get("/videos/:id", (req, res) => {
  const videos = readVideos();
  const id = req.params.id;
  console.log(id);
  const video = videos.find((video) => video.id === id);
  if (!video) {
    res.status(404).send("We couldn't find the video in question");
  } else {
    res.status(200).send(video);
  }
});

// POST video
app.post("/videos", (req, res) => {
  const videos = readVideos();

  const title = req.body.title;
  const description = req.body.description;

  if (!title || !description) {
    res.status(400).send("Must have both a title and description");
    return;
  }

  const newVideo = {
    id: uuid(),
    title,
    channel: "Guest",
    image: "image",
    description,
    views: 0,
    likes: 0,
    duration: "3:33",
    video: "https://project-2-api.herokuapp.com/stream",
    timestamp: Date.now(),
    comments: [],
  };
  videos.push(newVideo);
  writeVideos(videos);
  console.log(videos);
  res.status(201).send(newVideo);
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
