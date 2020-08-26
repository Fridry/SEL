const knex = require("../database");

module.exports = {
  async index(req, res, next) {
    try {
      const results = await knex("usuarios");

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
      await trx("usuarios").insert({
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
      await trx("usuarios")
        .update({
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
      await trx("usuarios").where({ id }).delete();

      await trx.commit();

      return res.send();
    } catch (error) {
      await trx.rollback();

      next(error);
    }
  },
};
