const express = require("express");

const Login = require("./middleware/login");

const routes = express.Router();

const UsuarioController = require("./controllers/UsuarioController");
const LivroController = require("./controllers/LivroController");
const AtendenteController = require("./controllers/AtendenteController");
const EmprestimoController = require("./controllers/EmprestimoController");
const ReservaController = require("./controllers/ReservaController");

routes
  .get("/usuarios/login", UsuarioController.login)
  .get("/usuarios", UsuarioController.index)
  .get("/usuarios/:id", UsuarioController.show)
  .post("/usuarios", UsuarioController.create)
  .put("/usuarios/:id", Login.usuario, UsuarioController.update)
  .delete("/usuarios/:id", Login.usuario, UsuarioController.delete);

routes
  .get("/livros", LivroController.index)
  .get("/livros/:id", LivroController.show)
  .post("/livros", Login.atendente, LivroController.create)
  .put("/livros/:id", Login.atendente, LivroController.update)
  .delete("/livros/:id", Login.atendente, LivroController.delete);

routes
  .get("/atendentes/login", AtendenteController.login)
  .get("/atendentes", AtendenteController.index)
  .get("/atendentes/:id", AtendenteController.show)
  .post("/atendentes", Login.atendente, AtendenteController.create)
  .put("/atendentes/:id", Login.atendente, AtendenteController.update)
  .delete("/atendentes/:id", Login.atendente, AtendenteController.delete);

routes
  .get("/emprestimos", EmprestimoController.index)
  .get("/emprestimos/:id", EmprestimoController.show)
  .post("/emprestimos", Login.atendente, EmprestimoController.create)
  .put("/emprestimos/:id", Login.atendente, EmprestimoController.update)
  .delete("/emprestimos/:id", Login.atendente, EmprestimoController.delete);

routes
  .get("/reservas", ReservaController.index)
  .get("/reservas/:id", ReservaController.show)
  .post("/reservas", Login.atendente, ReservaController.create)
  .put("/reservas/:id", Login.atendente, ReservaController.update)
  .delete("/reservas/:id", Login.atendente, ReservaController.delete);

module.exports = routes;
