const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(morgan("combined"));
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
