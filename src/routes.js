const express = require("express");

const routes = express.Router();

const UsuarioController = require("./controllers/UsuarioController");
const LivroController = require("./controllers/LivroController");
const AtendenteController = require("./controllers/AtendenteController");
const EmprestimoController = require("./controllers/EmprestimoController");

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

routes
  .get("/atendentes", AtendenteController.index)
  .get("/atendentes/:id", AtendenteController.show)
  .post("/atendentes", AtendenteController.create)
  .put("/atendentes/:id", AtendenteController.update)
  .delete("/atendentes/:id", AtendenteController.delete);

routes
  .get("/emprestimos", EmprestimoController.index)
  .get("/emprestimos/:id", EmprestimoController.show)
  .post("/emprestimos", EmprestimoController.create)
  .put("/emprestimos/:id", EmprestimoController.update)
  .delete("/emprestimos/:id", EmprestimoController.delete);

module.exports = routes;
