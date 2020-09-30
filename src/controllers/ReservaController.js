const knex = require("../database");

module.exports = {
  async index(req, res, next) {
    const {
      usuario,
      titulo,
      page = 1,
      limit = 10,
      orderCol = "id",
      order = "asc",
    } = req.query;

    try {
      const query = knex("reservas")
        .join("usuarios", "usuarios.id", "=", "reservas.usuario_id")
        .join("livros", "livros.id", "=", "reservas.livro_id")
        .select("reservas.*", "usuarios.nome", "livros.titulo", "livros.autor")
        .limit(limit)
        .offset((page - 1) * limit)
        .orderBy(orderCol, order);

      const countObj = knex("reservas")
        .count()
        .join("usuarios", "usuarios.id", "=", "reservas.usuario_id")
        .join("livros", "livros.id", "=", "reservas.livro_id")
        .select("reservas.*", "usuarios.nome", "livros.titulo")
        .groupBy("reservas.id", "usuarios.nome", "livros.titulo");

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
      const results = await knex("reservas")
        .where("reservas.id", id)
        .join("usuarios", "usuarios.id", "=", "reservas.usuario_id")
        .join("livros", "livros.id", "=", "reservas.livro_id")
        .select("reservas.*", "usuarios.nome", "livros.titulo");

      return res.json(results);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    const { usuario_id, livro_id } = req.body;

    const trx = await knex.transaction();

    try {
      const usuario = await trx("usuarios").where({ id: usuario_id });

      if (usuario.length === 0)
        return res.json({ error: "Usuário não cadastrado no sistema" });

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
      const usuario = await trx("usuarios").where({ id: usuario_id });

      if (usuario.length === 0)
        return res.json({ error: "Usuário não cadastrado no sistema" });

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
