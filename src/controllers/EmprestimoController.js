const knex = require("../database");

module.exports = {
  async index(req, res, next) {
    try {
      const results = await knex("emprestimos");

      return res.json(results);
    } catch (error) {
      next(error);
    }
  },

  async show(req, res, next) {
    const { id } = req.params;

    try {
      const results = await knex("emprestimos").where({ id });

      return res.json(results);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    const {
      usuario_id,
      livro_id,
      atendente_id,
      data_de_retirada,
      data_para_devolucao,
      renovacao,
      data_da_renovacao,
      renovacao_quantidade,
      devolvido,
      data_da_devolucao,
    } = req.body;

    const trx = await knex.transaction();

    try {
      const livroDisponivel = await trx("livros").where({
        id: livro_id,
        disponivel: true,
      });

      if (livroDisponivel.length === 0)
        return res.json({ error: "Livro indisponível" });

      await trx("emprestimos").insert({
        usuario_id,
        livro_id,
        atendente_id,
        data_de_retirada,
        data_para_devolucao,
        renovacao,
        data_da_renovacao,
        renovacao_quantidade,
        devolvido,
        data_da_devolucao,
      });

      await trx("livros")
        .update({
          disponivel: false,
          motivo_indisponibilidade: "Emprestado",
        })
        .where({
          id: livro_id,
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
      usuario_id,
      livro_id,
      atendente_id,
      data_de_retirada,
      data_para_devolucao,
      renovacao,
      data_da_renovacao,
      renovacao_quantidade,
      devolvido,
      data_da_devolucao,
    } = req.body;

    const trx = await knex.transaction();

    try {
      await trx("emprestimos")
        .update({
          usuario_id,
          livro_id,
          atendente_id,
          data_de_retirada,
          data_para_devolucao,
          renovacao,
          data_da_renovacao,
          renovacao_quantidade,
          devolvido,
          data_da_devolucao,
          updated_at: knex.fn.now(),
        })
        .where({ id });

      if (devolvido) {
        await trx("livros")
          .update({
            disponivel: true,
            motivo_indisponibilidade: null,
          })
          .where({
            id: livro_id,
          });
      }

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
      await trx("emprestimos").where({ id }).delete();

      await trx.commit();

      return res.send();
    } catch (error) {
      await trx.rollback();

      next(error);
    }
  },
};
