const knex = require("../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  async index(req, res, next) {
    const {
      nome,
      page = 1,
      limit = 10,
      orderCol = "id",
      order = "asc",
    } = req.query;

    try {
      const query = knex("atendentes")
        .limit(limit)
        .offset((page - 1) * limit)
        .orderBy(orderCol, order);

      const countObj = knex("atendentes").count();

      if (nome) {
        query
          .where("nome", "ilike", `%${nome}%`)
          .limit(limit)
          .offset((page - 1) * limit);

        countObj.where("nome", "ilike", `%${nome}%`);
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

    const { nome } = req.query;

    try {
      const results = await knex("atendentes").where({ id });

      return res.json(results);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    const { nome, data_nascimento, cpf, email, telefone, senha } = req.body;

    const trx = await knex.transaction();

    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(senha, salt);

      await trx("atendentes").insert({
        nome,
        data_nascimento,
        cpf,
        email,
        telefone,
        senha: hash,
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

    const { nome, data_nascimento, cpf, email, telefone, senha } = req.body;

    const trx = await knex.transaction();

    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(senha, salt);

      await trx("atendentes")
        .update({
          nome,
          data_nascimento,
          cpf,
          email,
          telefone,
          senha: hash,
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
      await trx("atendentes").where({ id }).delete();

      await trx.commit();

      return res.send();
    } catch (error) {
      await trx.rollback();

      next(error);
    }
  },

  async login(req, res, next) {
    const { cpf, senha } = req.body;

    try {
      const usuario = await knex("atendentes").where({ cpf }).first();

      if (!usuario)
        return res.status(401).json({
          error: "O usuário informado não está cadastrado no sistema",
        });

      const autorizado = await bcrypt.compare(senha, usuario.senha);

      if (!autorizado)
        res.status(401).send({
          error: "A senha informada está incorreta",
        });

      const payload = { id: usuario.id, role: "atendente" };

      const token = jwt.sign(payload, process.env.SECRET, {
        expiresIn: "7d",
      });

      return res.json(token);
    } catch (error) {
      next(error);
    }
  },
};
