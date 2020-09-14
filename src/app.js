const express = require("express");
const { errors } = require("celebrate");
const cors = require("cors");

const routes = require("./routes");

const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Credentials", "*");
  res.header("Access-Control-Expose-Headers", "x-total-count"); //essta linha habilita o token no header
  next();
});

app.use(cors());
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
