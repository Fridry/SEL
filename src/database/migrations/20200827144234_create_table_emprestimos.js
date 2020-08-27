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

    table.timestamp("retirada").defaultTo(knex.fn.now());
    table.timestamp("devolucao").notNullable();

    table.boolean("renovacao").defaultTo(false);
    table.integer("renovacaoCount").defaultTo(0);
    table.boolean("entregue").defaultTo(false);

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = (knex) => knex.schema.dropTable("emprestimos");
