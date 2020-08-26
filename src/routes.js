const express = require("express");

const routes = express.Router();

const UsuarioController = require("./controllers/UsuarioController");

routes
  .get("/usuarios", UsuarioController.index)
  .get("/usuarios/:id", UsuarioController.show)
  .post("/usuarios", UsuarioController.create)
  .put("/usuarios/:id", UsuarioController.update)
  .delete("/usuarios/:id", UsuarioController.delete);

module.exports = routes;
