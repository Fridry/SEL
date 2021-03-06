const knex = require("../database");

module.exports = {
  async index(req, res, next) {
    const {
      page = 1,
      usuario,
      titulo,
      data_de_retirada,
      data_para_devolucao,
      data_da_devolucao,
      limit = 10,
      orderCol = "id",
      order = "asc",
      devolvido,
      devolvidoStatus,
    } = req.query;

    try {
      const query = knex("emprestimos")
        .limit(limit)
        .offset((page - 1) * limit)
        .orderBy(orderCol, order)
        .join("usuarios", "usuarios.id", "=", "emprestimos.usuario_id")
        .join("livros", "livros.id", "=", "emprestimos.livro_id")
        .select(
          "emprestimos.*",
          { usuarioId: "usuarios.id" },
          "usuarios.nome",
          { livroId: "livros.id" },
          "livros.titulo",
          "livros.autor"
        )
        .groupBy(
          "emprestimos.id",
          "usuarios.id",
          "usuarios.nome",
          "livros.id",
          "livros.titulo",
          "livros.autor"
        );

      const countObj = knex("emprestimos").count();

      if (usuario) {
        query
          .where("usuarios.nome", "ilike", `%${usuario}%`)
          .limit(limit)
          .offset((page - 1) * limit);

        countObj.where("usuarios.nome", "ilike", `%${usuario}%`);
      }

      if (titulo) {
        query
          .where("livros.titulo", "ilike", `%${titulo}%`)
          .limit(limit)
          .offset((page - 1) * limit);

        countObj.where("livros.titulo", "ilike", `%${titulo}%`);
      }

      if (devolvido) {
        query
          .where({ devolvido: devolvidoStatus })
          .limit(limit)
          .offset((page - 1) * limit);

        countObj.where({ devolvido: devolvidoStatus });
      }

      if (data_para_devolucao) {
        query
          .whereBetween("data_para_devolucao", [
            `${data_para_devolucao}T00:00:00.000Z`,
            `${data_para_devolucao}T23:59:59.000Z`,
          ])
          .limit(limit)
          .offset((page - 1) * limit);

        countObj.whereBetween("data_para_devolucao", [
          `${data_para_devolucao}T00:00:00.000Z`,
          `${data_para_devolucao}T23:59:59.000Z`,
        ]);
      }

      if (data_de_retirada) {
        query
          .whereBetween("data_de_retirada", [
            `${data_de_retirada}T00:00:00.000Z`,
            `${data_de_retirada}T23:59:59.000Z`,
          ])
          .limit(limit)
          .offset((page - 1) * limit);

        countObj.whereBetween("data_de_retirada", [
          `${data_de_retirada}T00:00:00.000Z`,
          `${data_de_retirada}T23:59:59.000Z`,
        ]);
      }

      if (data_da_devolucao) {
        query
          .whereBetween("data_da_devolucao", [
            `${data_da_devolucao}T00:00:00.000Z`,
            `${data_da_devolucao}T23:59:59.000Z`,
          ])
          .limit(limit)
          .offset((page - 1) * limit);

        countObj.whereBetween("data_da_devolucao", [
          `${data_da_devolucao}T00:00:00.000Z`,
          `${data_da_devolucao}T23:59:59.000Z`,
        ]);
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
      data_de_retirada,
      data_para_devolucao,
    } = req.body;

    const trx = await knex.transaction();

    try {
      const usuario = await trx("usuarios").where({ id: usuario_id });

      if (usuario.length === 0)
        return res.json({ error: "Usuário não cadastrado no sistema" });

      const livroDisponivel = await trx("livros").where({
        id: livro_id,
        disponivel: true,
      });

      if (livroDisponivel.length === 0)
        return res.json({ error: "Livro indisponível" });

      await trx("emprestimos").insert({
        usuario_id,
        livro_id,
        atendente_id: req.usuario.id,
        data_de_retirada: new Date(),
        data_para_devolucao,
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
      renovacao_quantidade,
      devolvido,
      data_da_devolucao,
    } = req.body;

    const trx = await knex.transaction();

    try {
      const usuario = await trx("usuarios").where({ id: usuario_id });

      if (usuario.length === 0)
        return res.json({ error: "Usuário não cadastrado no sistema" });

      await trx("emprestimos")
        .update({
          usuario_id,
          livro_id,
          atendente_id,
          data_de_retirada,
          data_para_devolucao,
          renovacao,
          data_da_renovacao: renovacao ? knex.fn.now() : null,
          renovacao_quantidade,
          devolvido,
          data_da_devolucao: devolvido ? knex.fn.now() : null,
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
