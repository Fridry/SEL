const knex = require("../database");

module.exports = {
  async index(req, res, next) {
    const { titulo, autor, page = 1, limit = 10 } = req.query;

    try {
      const query = knex("livros")
        .limit(limit)
        .offset((page - 1) * limit);

      const countObj = knex("livros").count();

      if (titulo) {
        query
          .where("titulo", "ilike", `%${titulo}%`)
          .limit(limit)
          .offset((page - 1) * limit);

        countObj.where("titulo", "ilike", `%${titulo}%`);
      }

      if (autor) {
        query
          .where("autor", "ilike", `%${autor}%`)
          .limit(limit)
          .offset((page - 1) * limit);

        countObj.where("autor", "ilike", `%${autor}%`);
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
      serie,
      volume,
      isbn,
      editora,
      numero_paginas,
      copia,
      disponivel,
      motivo_indisponibilidade,
      baixa,
    } = req.body;

    const { filename } = req.file;

    const trx = await knex.transaction();

    try {
      await trx("livros").insert({
        titulo,
        autor,
        sinopse,
        capa: filename,
        serie,
        volume,
        isbn,
        editora,
        numero_paginas,
        copia,
        disponivel,
        motivo_indisponibilidade,
        baixa,
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
      copia,
      disponivel,
      motivo_indisponibilidade,
      baixa,
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
          copia,
          disponivel,
          motivo_indisponibilidade,
          baixa,
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
      await trx("livros").where({ id }).delete();

      await trx.commit();

      return res.send();
    } catch (error) {
      await trx.rollback();

      next(error);
    }
  },
};
