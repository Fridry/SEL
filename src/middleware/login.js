const jwt = require("jsonwebtoken");
require("dotenv/config");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, process.env.SECRET);

    if (decode.role !== "atendente") {
      return res.status(401).send({ error: "Usuário não autorizado" });
    }

    req.usuario = decode;

    next();
  } catch (error) {
    return res.status(401).send({ error: "Falha na autenticação" });
  }
};
