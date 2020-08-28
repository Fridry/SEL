exports.up = (knex) => {
  return knex.schema.createTable("reservas", (table) => {
    table.increments();

    table
      .integer("usuario_id")
      .references("usuarios.id")
      .notNullable()
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    table
      .integer("livro_id")
      .references("livros.id")
      .notNullable()
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = (knex) => knex.schema.dropTable("reservas");
