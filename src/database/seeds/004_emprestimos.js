exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("emprestimos")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("emprestimos").insert([
        {
          usuario_id: 1,
          livro_id: 1,
          atendente_id: 1,
          data_para_devolucao: knex.fn.now(),
        },
      ]);
    });
};
