const express = require("express");
const { errors } = require("celebrate");

const routes = require("./routes");

const app = express();

app.use(express.json());
app.use(routes);
app.use(errors());

//404 - Not Found
app.use((req, res, next) => {
  const error = new Error("404 - Not Found");

  error.status = 404;

  next(error);
});

//Catch errors
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ error: error.message });
});

module.exports = app;
