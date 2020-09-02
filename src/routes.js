const { Router } = require("express");
const multer = require("multer");
const { celebrate, Segments, Joi } = require("celebrate");

const uploadConfig = require("./config/upload");
const Login = require("./middleware/login");

const routes = Router();
const upload = multer(uploadConfig);

const UsuarioController = require("./controllers/UsuarioController");
const LivroController = require("./controllers/LivroController");
const AtendenteController = require("./controllers/AtendenteController");
const EmprestimoController = require("./controllers/EmprestimoController");
const ReservaController = require("./controllers/ReservaController");
const { join } = require("./database");

routes
  .post(
    "/usuarios/login",
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        email: Joi.string().required().email(),
        senha: Joi.string().required(),
      }),
    }),
    UsuarioController.login
  )
  .get("/usuarios", UsuarioController.index)
  .get("/usuarios/:id", UsuarioController.show)
  .post(
    "/usuarios",
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        nome: Joi.string().required(),
        genero: Joi.string().required(),
        data_nascimento: Joi.date().required(),
        cpf: Joi.string().required().length(11),
        rg: Joi.string().required().min(9).max(12),
        email: Joi.string().required().email(),
        senha: Joi.string().required().min(6),
        telefone: Joi.string().required(),
        rua: Joi.string().required(),
        numero: Joi.number().required(),
        bairro: Joi.string().required(),
        cep: Joi.string().required(),
        cidade: Joi.string().required(),
      }),
    }),
    UsuarioController.create
  )
  .put(
    "/usuarios/:id",
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        nome: Joi.string(),
        genero: Joi.string(),
        data_nascimento: Joi.date(),
        cpf: Joi.string().length(11),
        rg: Joi.string().min(7).max(12),
        email: Joi.string().email(),
        senha: Joi.string().min(6),
        telefone: Joi.string(),
        rua: Joi.string(),
        numero: Joi.number(),
        bairro: Joi.string(),
        cep: Joi.string(),
        cidade: Joi.string(),
      }),
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
      }),
    }),
    Login.usuario,
    UsuarioController.update
  )
  .delete(
    "/usuarios/:id",
    celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
      }),
    }),
    Login.usuario,
    UsuarioController.delete
  );

routes
  .get("/livros", LivroController.index)
  .get("/livros/:id", LivroController.show)
  .post(
    "/livros",
    upload.single("capa"),
    Login.atendente,
    LivroController.create
  )
  .put(
    "/livros/:id",
    upload.single("capa"),
    Login.atendente,
    LivroController.update
  )
  .delete("/livros/:id", Login.atendente, LivroController.delete);

routes
  .post(
    "/atendentes/login",
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        cpf: Joi.string().required(),
        senha: Joi.string().required(),
      }),
    }),
    AtendenteController.login
  )
  .get("/atendentes", AtendenteController.index)
  .get("/atendentes/:id", AtendenteController.show)
  .post(
    "/atendentes",
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        nome: Joi.string().required(),
        data_nascimento: Joi.date().required(),
        cpf: Joi.string().required().length(11),
        email: Joi.string().required().email(),
        senha: Joi.string().required().min(6),
        telefone: Joi.string().required(),
      }),
    }),
    Login.atendente,
    AtendenteController.create
  )
  .put(
    "/atendentes/:id",
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        nome: Joi.string(),
        data_nascimento: Joi.date(),
        cpf: Joi.string().length(11),
        email: Joi.string().email(),
        senha: Joi.string().min(6),
        telefone: Joi.string(),
      }),
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
      }),
    }),
    Login.atendente,
    AtendenteController.update
  )
  .delete(
    "/atendentes/:id",
    celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
      }),
    }),
    Login.atendente,
    AtendenteController.delete
  );

routes
  .get("/emprestimos", EmprestimoController.index)
  .get("/emprestimos/:id", EmprestimoController.show)
  .post(
    "/emprestimos",
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        usuario_id: Joi.number().required(),
        livro_id: Joi.number().required(),
        atendente_id: Joi.number().required(),
        data_para_devolucao: Joi.date().required(),
      }),
    }),
    Login.atendente,
    EmprestimoController.create
  )
  .put(
    "/emprestimos/:id",
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        usuario_id: Joi.number(),
        livro_id: Joi.number(),
        atendente_id: Joi.number(),
        renovacao: Joi.boolean(),
        devolvido: Joi.boolean(),
        data_da_renovacao: Joi.date(),
        data_da_devolucao: Joi.date(),
      }),
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
      }),
    }),
    Login.atendente,
    EmprestimoController.update
  )
  .delete(
    "/emprestimos/:id",
    celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
      }),
    }),
    Login.atendente,
    EmprestimoController.delete
  );

routes
  .get("/reservas", ReservaController.index)
  .get("/reservas/:id", ReservaController.show)
  .post(
    "/reservas",
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        usuario_id: Joi.number().required(),
        livro_id: Joi.number().required(),
      }),
    }),
    Login.atendente,
    ReservaController.create
  )
  .put(
    "/reservas/:id",
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        usuario_id: Joi.number(),
        livro_id: Joi.number(),
      }),
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
      }),
    }),
    Login.atendente,
    ReservaController.update
  )
  .delete(
    "/reservas/:id",
    celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
      }),
    }),
    Login.atendente,
    ReservaController.delete
  );

module.exports = routes;
