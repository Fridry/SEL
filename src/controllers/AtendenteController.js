const knex = require("../database");

module.exports = {
  async index(req, res, next) {
    try {
      const results = await knex("atendentes");

      return res.json(results);
    } catch (error) {
      next(error);
    }
  },

  async show(req, res, next) {
    const { id } = req.params;

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
      await trx("atendentes").insert({
        nome,
        data_nascimento,
        cpf,
        email,
        telefone,
        senha,
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

    const { nome, data_nascimento, cpf, email, telefone, senha } = req.body;

    const trx = await knex.transaction();

    try {
      await trx("atendentes")
        .update({
          nome,
          data_nascimento,
          cpf,
          email,
          telefone,
          senha,
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
};
