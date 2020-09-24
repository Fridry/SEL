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
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(senha, salt);

      await trx("usuarios").insert({
        nome,
        genero,
        data_nascimento,
        cpf,
        rg,
        email,
        telefone,
        senha: hash,
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

    const token_id = req.usuario.id;

    if (id !== token_id)
      return res.status(401).send({ error: "Usuário não autorizado" });

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
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(senha, salt);

      await trx("usuarios")
        .update({
          nome,
          genero,
          data_nascimento,
          cpf,
          rg,
          email,
          telefone,
          senha: hash,
          rua,
          numero,
          bairro,
          cep,
          cidade,
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
      await trx("usuarios").where({ id }).delete();

      await trx.commit();

      return res.send();
    } catch (error) {
      await trx.rollback();

      next(error);
    }
  },
};
