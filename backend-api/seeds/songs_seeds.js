const { faker } = require('@faker-js/faker');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
 
  const genreIds = await knex('Genres').pluck('genre_id');

  if (genreIds.length === 0) {
    console.log('No genres found. Skipping song seed.');
    return;
  }



  const fakeSongs = [];
  const songCount = 100; 

  
  for (let i = 0; i < songCount; i++) {
    fakeSongs.push({
      song_name: faker.music.songName(),               
      duration: faker.number.int({ min: 120, max: 300 }),
      genre_id: faker.helpers.arrayElement(genreIds),   
      release_date: faker.date.past(5),             
      streaming_count: faker.number.int({ min: 0, max: 10000 }),
      sound: '/public/sounds/ExitSign.mp3',

      avatar: '/public/images/OIP.jpg',

    });
  }


  await knex('songs').insert(fakeSongs);
};
