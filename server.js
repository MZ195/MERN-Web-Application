const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();
app.use(morgan("combined"));

// DB config
const db = require("./config/keys").mongoURI;

// connect to mongo DB
mongoose
  .connect(db)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => console.log(err));

// Use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

// server config
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
