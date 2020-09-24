const knex = require("../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv/config");

module.exports = {
  async store(req, res, next) {
    const { email, senha } = req.body;

    try {
      const usuario = await knex("usuarios").where({ email }).first();

      if (!usuario)
        return res
          .status(401)
          .json({ error: "O e-mail informado não está cadastrado no sistema" });

      const autorizado = await bcrypt.compare(senha, usuario.senha);

      if (!autorizado)
        res.status(401).send({
          error: "A senha informada está incorreta",
        });

      const payload = { id: usuario.id };

      const token = jwt.sign(payload, process.env.SECRET, {
        expiresIn: "1d",
      });

      return res.json(token);
    } catch (error) {
      next(error);
    }
  },
};
