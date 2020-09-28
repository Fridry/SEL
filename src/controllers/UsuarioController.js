const knex = require("../database");
const bcrypt = require("bcrypt");

module.exports = {
  async index(req, res, next) {
    const {
      nome,
      genero,
      page = 1,
      limit = 10,
      orderCol = "id",
      order = "asc",
    } = req.query;

    try {
      const query = knex("usuarios")
        .limit(limit)
        .offset((page - 1) * limit)
        .orderBy(orderCol, order);

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
    const trx = await knex.transaction();

    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(senha, salt);

      await trx("usuarios").insert(req.body);

      await trx.commit();

      return res.status(201).send();
    } catch (error) {
      await trx.rollback();

      next(error);
    }
  },

  async update(req, res, next) {
    const { id } = req.params;

    const { id: token_id, role } = req.usuario;

    if (id !== token_id && role !== "atendente")
      return res.status(401).send({ error: "Usuário não autorizado" });

    const trx = await knex.transaction();

    try {
      if (req.body.senha)
        req.body.senha = await bcrypt.hash(req.body.senha, 10);

      req.body.updated_at = knex.fn.now();

      await trx("usuarios").update(req.body).where({ id });

      await trx.commit();

      return res.send();
    } catch (error) {
      await trx.rollback();

      next(error);
    }
  },

  async delete(req, res, next) {
    const { id } = req.params;

    const { id: token_id, role } = req.usuario;

    if (id !== token_id && role === "usuario")
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
};
