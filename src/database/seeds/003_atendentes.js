exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("atendentes")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("atendentes").insert([
        {
          nome: "Administrador",
          data_nascimento: "2000-01-01",
          cpf: "000.000.000-01",
          email: "admin@biblioteca.com",
          telefone: "(71) 99999-9999",
          senha: "admin",
        },
      ]);
    });
};
