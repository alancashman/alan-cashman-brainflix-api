const fs = require("fs");
const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.ORIGIN;

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
  console.log(videos);
  res.status(200).send(videos);
});

// GET specific video
app.get("/videos/:id", (req, res) => {
  const videos = readVideos();
  const id = req.params.id;
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
  const image = req.body.image;

  if (!title || !description) {
    res.status(400).send("Must have both a title and description");
    return;
  }

  const newVideo = {
    id: uuid(),
    title,
    channel: "Guest",
    image,
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

// POST comment
app.post("/videos/:id/comments", (req, res) => {
  const videos = readVideos();
  const { id } = req.params;
  const video = videos.find((video) => video.id === id);

  const comment = {
    id: uuid(),
    name: req.body.name,
    comment: req.body.comment,
    likes: 0,
    timestamp: Date.now(),
  };
  video.comments.push(comment);
  writeVideos(videos);

  res.status(201).send(comment);
});

// DELETE comment
app.delete("/videos/:videoId/comments/:commentId", (req, res) => {
  const videos = readVideos();
  const { videoId, commentId } = req.params;
  const video = videos.find((video) => video.id === videoId);
  video.comments = video.comments.filter((comment) => comment.id !== commentId);
  writeVideos(videos);
  res.status(204).send("Deleted");
});

// LIKE video
app.put("/videos/:videoId/likes", (req, res) => {
  const videos = readVideos();
  const { videoId } = req.params;
  const video = videos.find((video) => video.id === videoId);
  let likes = video.likes.split(",");
  likes[1]++;
  video.likes = likes.join(",");
  console.log(video.likes);
  writeVideos(videos);
  res.status(200).send("Liked!");
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
