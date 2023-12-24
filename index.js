const express = require("express");
const app = express();
const mongoose = require("./config/mongoose");
const port = 8000;
var cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", require("./routes"));
app.listen(port, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is running on PORT ${port}`);
  }
});
