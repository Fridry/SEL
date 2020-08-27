exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("livros")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("livros").insert([
        {
          titulo: "1984",
          autor: " George Orwell",
          sinopse:
            "Winston, herói de 1984, último romance de George Orwell, vive aprisionado na engrenagem totalitária de uma sociedade completamente dominada pelo Estado, onde tudo é feito coletivamente, mas cada qual vive sozinho. Ninguém escapa à vigilância do Grande Irmão, a mais famosa personificação literária de um poder cínico e cruel ao infinito, além de vazio de sentido histórico. De fato, a ideologia do Partido dominante em Oceânia não visa nada de coisa alguma para ninguém, no presente ou no futuro. O'Brien, hierarca do Partido, é quem explica a Winston que 'só nos interessa o poder em si. Nem riqueza, nem luxo, nem vida longa, nem felicidade: só o poder pelo poder, poder puro'.",
          capa:
            "https://images-na.ssl-images-amazon.com/images/I/51feD87yuEL._SX321_BO1,204,203,200_.jpg",
          serie: null,
          volume: null,
          isbn: "978-8535914849",
          editora: "Companhia das Letras",
          numero_paginas: 416,
        },
      ]);
    });
};
