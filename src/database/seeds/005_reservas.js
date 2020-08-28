exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("reservas")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("reservas").insert([
        {
          usuario_id: 1,
          livro_id: 1,
        },
      ]);
    });
};
