const express = require("express");

const routes = express.Router();

const UsuarioController = require("./controllers/UsuarioController");
const LivroController = require("./controllers/LivroController");

routes
  .get("/usuarios", UsuarioController.index)
  .get("/usuarios/:id", UsuarioController.show)
  .post("/usuarios", UsuarioController.create)
  .put("/usuarios/:id", UsuarioController.update)
  .delete("/usuarios/:id", UsuarioController.delete);

routes
  .get("/livros", LivroController.index)
  .get("/livros/:id", LivroController.show)
  .post("/livros", LivroController.create)
  .put("/livros/:id", LivroController.update)
  .delete("/livros/:id", LivroController.delete);

module.exports = routes;
