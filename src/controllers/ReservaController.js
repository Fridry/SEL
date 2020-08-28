const knex = require("../database");

module.exports = {
  async index(req, res, next) {
    try {
      const results = await knex("reservas");

      return res.json(results);
    } catch (error) {
      next(error);
    }
  },

  async show(req, res, next) {
    const { id } = req.params;

    try {
      const results = await knex("reservas").where({ id });

      return res.json(results);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    const { usuario_id, livro_id } = req.body;

    const trx = await knex.transaction();

    try {
      const livroDisponivel = await trx("livros").where({
        id: livro_id,
        disponivel: true,
      });

      if (livroDisponivel.length > 0)
        return res.json({
          error: "Não foi possivel realizar a reserva. Livro Disponível",
        });

      await trx("reservas").insert({
        usuario_id,
        livro_id,
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

    const { usuario_id, livro_id } = req.body;

    const trx = await knex.transaction();

    try {
      await trx("reservas")
        .update({
          usuario_id,
          livro_id,
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
      await trx("reservas").where({ id }).delete();

      await trx.commit();

      return res.send();
    } catch (error) {
      await trx.rollback();

      next(error);
    }
  },
};
