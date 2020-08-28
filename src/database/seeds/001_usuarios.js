exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("usuarios")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("usuarios").insert([
        {
          nome: "Diego Levi Pinto",
          genero: "Masculino",
          data_nascimento: "2000-01-01",
          cpf: "224.301.755-50",
          rg: "16.656.735-8",
          email: "diegolevi@ladder.com.br",
          telefone: "(71) 99765-3076",
          senha: "$2b$10$3NFLwhb04BXHz0CR0/RLDeJ2S3cV8ORgFGQ.5aqyZVGnEr0Z1J6IO",
          rua: "Travessa Frederico Costa",
          numero: 269,
          bairro: "Periperi",
          cep: "40720-406",
          cidade: "Salvador",
        },
      ]);
    });
};
