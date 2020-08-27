const knex = require("../database");

module.exports = {
  async index(req, res, next) {
    try {
      const results = await knex("livros");

      return res.json(results);
    } catch (error) {
      next(error);
    }
  },

  async show(req, res, next) {
    const { id } = req.params;

    try {
      const results = await knex("livros").where({ id });

      return res.json(results);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    const {
      titulo,
      autor,
      sinopse,
      capa,
      serie,
      volume,
      isbn,
      editora,
      numero_paginas,
    } = req.body;

    const trx = await knex.transaction();

    try {
      await trx("livros").insert({
        titulo,
        autor,
        sinopse,
        capa,
        serie,
        volume,
        isbn,
        editora,
        numero_paginas,
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
      titulo,
      autor,
      sinopse,
      capa,
      serie,
      volume,
      isbn,
      editora,
      numero_paginas,
    } = req.body;

    const trx = await knex.transaction();

    try {
      await trx("livros")
        .update({
          titulo,
          autor,
          sinopse,
          capa,
          serie,
          volume,
          isbn,
          editora,
          numero_paginas,
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
      await trx("livros").where({ id }).delete();

      await trx.commit();

      return res.send();
    } catch (error) {
      await trx.rollback();

      next(error);
    }
  },
};
