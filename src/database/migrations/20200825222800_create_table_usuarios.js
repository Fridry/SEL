exports.up = (knex) => {
  return knex.schema.createTable("usuarios", (table) => {
    table.increments();
    table.string("nome").notNullable();
    table.enum("genero", ["Masculino", "Feminino", "Outro"]).notNullable();
    table.date("data_nascimento").notNullable();
    table.string("cpf").notNullable().unique();
    table.string("rg").notNullable().unique();

    table.string("email").notNullable().unique();
    table.string("telefone");

    table.string("senha").notNullable();

    table.string("rua").notNullable();
    table.integer("numero").notNullable();
    table.string("bairro").notNullable();
    table.string("cep").notNullable();
    table.string("cidade").notNullable();

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = (knex) => knex.schema.dropTable("usuarios");
