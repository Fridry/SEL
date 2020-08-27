exports.up = (knex) => {
  return knex.schema.createTable("atendentes", (table) => {
    table.increments();
    table.string("nome").notNullable();
    table.date("data_nascimento").notNullable();
    table.string("cpf").notNullable().unique();
    table.string("senha").notNullable();

    table.string("email").notNullable().unique();
    table.string("telefone");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = (knex) => knex.schema.dropTable("atendentes");
