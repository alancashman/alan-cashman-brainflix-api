const express = require("express");
const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());
app.use(express.static("public"));
const data = require("./data/video-details.json");
const port = 5000;

console.log(data);

app.get("/videos", (req, res) => {
  res.send(data);
});

app.get("/videos/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  const video = data.find((video) => video.id === id);
  res.send(video);
});

app.post("/videos", (req, res) => {
  console.log(req.body);
  const body = req.body;
  const title = body.title;
  const description = body.description;

  if (!title || !description) {
    res.status(400).send("Must have both a title and description");
    return;
  }

  const newVideo = {
    title,
    description,
    posted: Date.now(),
    id: uuid(),
  };
  res.send(newVideo);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
