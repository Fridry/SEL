const knex = require("../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv/config");

module.exports = {
  async index(req, res, next) {
    const { nome, genero, page = 1 } = req.query;

    const limit = 10;
    try {
      const query = knex("usuarios")
        .limit(limit)
        .offset((page - 1) * limit);

      const countObj = knex("usuarios").count();

      if (nome) {
        query
          .where("nome", "ilike", `%${nome}%`)
          .limit(limit)
          .offset((page - 1) * limit);

        countObj.where("nome", "ilike", `%${nome}%`);
      }

      if (genero) {
        query
          .where({ genero })
          .limit(limit)
          .offset((page - 1) * limit);

        countObj.where({ genero });
      }

      const [count] = await countObj;

      res.header("X-Total-Count", count["count"]);

      const results = await query;

      return res.json(results);
    } catch (error) {
      next(error);
    }
  },

  async show(req, res, next) {
    const { id } = req.params;

    try {
      const results = await knex("usuarios").where({ id });

      return res.json(results);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    const {
      nome,
      genero,
      data_nascimento,
      cpf,
      rg,
      email,
      telefone,
      senha,
      rua,
      numero,
      bairro,
      cep,
      cidade,
    } = req.body;

    const trx = await knex.transaction();

    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(senha, salt);

      await trx("usuarios").insert({
        nome,
        genero,
        data_nascimento,
        cpf,
        rg,
        email,
        telefone,
        senha: hash,
        rua,
        numero,
        bairro,
        cep,
        cidade,
      });

      await trx.commit();

      return res.status(201).send();
    } catch (error) {
      await trx.rollback();

      next(error);
    }
  },

  async update(req, res, next) {
    const { id } = req.params;

    const token_id = req.usuario.id;

    if (id !== token_id)
      return res.status(401).send({ error: "Usuário não autorizado" });

    const {
      nome,
      genero,
      data_nascimento,
      cpf,
      rg,
      email,
      telefone,
      senha,
      rua,
      numero,
      bairro,
      cep,
      cidade,
    } = req.body;

    const trx = await knex.transaction();

    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(senha, salt);

      await trx("usuarios")
        .update({
          nome,
          genero,
          data_nascimento,
          cpf,
          rg,
          email,
          telefone,
          senha: hash,
          rua,
          numero,
          bairro,
          cep,
          cidade,
          updated_at: knex.fn.now(),
        })
        .where({ id });

      await trx.commit();

      return res.send();
    } catch (error) {
      await trx.rollback();

      next(error);
    }
  },

  async delete(req, res, next) {
    const { id } = req.params;

    const token_id = req.usuario.id;

    if (id !== token_id)
      return res.status(401).send({ error: "Usuário não autorizado" });

    const trx = await knex.transaction();

    try {
      await trx("usuarios").where({ id }).delete();

      await trx.commit();

      return res.send();
    } catch (error) {
      await trx.rollback();

      next(error);
    }
  },

  async login(req, res, next) {
    const { email, senha } = req.body;

    try {
      const usuario = await knex("usuarios").where({ email }).first();

      if (!usuario)
        return res
          .status(401)
          .json({ error: "O e-mail informado não está cadastrado no sistema" });

      const autorizado = await bcrypt.compare(senha, usuario.senha);

      if (!autorizado)
        res.status(401).send({
          error: "A senha informada está incorreta",
        });

      const payload = { id: usuario.id };

      const token = jwt.sign(payload, process.env.SECRET, {
        expiresIn: "1d",
      });

      return res.json(token);
    } catch (error) {
      next(error);
    }
  },
};
