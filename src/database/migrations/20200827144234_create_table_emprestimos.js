exports.up = (knex) => {
  return knex.schema.createTable("emprestimos", (table) => {
    table.increments();

    table
      .integer("usuario_id")
      .references("usuarios.id")
      .notNullable()
      .onDelete("SET NULL")
      .onUpdate("CASCADE");

    table
      .integer("livro_id")
      .references("livros.id")
      .notNullable()
      .onDelete("SET NULL")
      .onUpdate("CASCADE");

    table
      .integer("atendente_id")
      .references("atendentes.id")
      .notNullable()
      .onDelete("SET NULL")
      .onUpdate("CASCADE");

    table.timestamp("data_de_retirada").defaultTo(knex.fn.now());
    table.timestamp("data_para_devolucao").notNullable();

    table.boolean("renovacao").defaultTo(false);
    table.integer("renovacao_quantidade").defaultTo(0);

    table.boolean("devolvido").defaultTo(false);
    table.timestamp("data_da_devolucao").defaultTo(null);

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = (knex) => knex.schema.dropTable("emprestimos");
