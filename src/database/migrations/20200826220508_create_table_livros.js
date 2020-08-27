exports.up = (knex) => {
  return knex.schema.createTable("livros", (table) => {
    table.increments();
    table.string("titulo").notNullable();
    table.string("autor").notNullable();
    table.text("sinopse").notNullable();
    table.string("capa").notNullable();
    table.string("serie").defaultTo(null);
    table.string("volume").defaultTo(null);
    table.string("isbn").notNullable();
    table.string("editora").notNullable();
    table.integer("numero_paginas").notNullable();
    table.integer("copia").notNullable().defaultTo(1);

    table.boolean("disponivel").defaultTo(true);
    table
      .enum("motivo_indisponibilidade", [
        "Emprestado",
        "Extraviado",
        "Danificado",
        "Outro",
      ])
      .defaultTo(null);

    table.timestamp("baixa").defaultTo(null);

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = (knex) => knex.schema.dropTable("livros");
