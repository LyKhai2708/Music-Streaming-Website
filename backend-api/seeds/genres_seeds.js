const { faker } = require('@faker-js/faker');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  await knex('Genres').del();

  const fakeGenres = [];
  const genreCount = 20; 


  for (let i = 0; i < genreCount; i++) {
    fakeGenres.push({
      genre_name: faker.music.genre(), 
    });
  }

  await knex('Genres').insert(fakeGenres);
};
