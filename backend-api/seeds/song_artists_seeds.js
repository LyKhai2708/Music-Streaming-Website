const { faker } = require('@faker-js/faker');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  const songIds = await knex('songs').pluck('song_id');
  const artistIds = await knex('Artists').pluck('artist_id');

  if (songIds.length === 0 || artistIds.length === 0) {
    console.log('No songs or artists found. Skipping song_artists seed.');
    return;
  }

  await knex('song_artists').del();

  const uniquePairs = new Set(); 
  const linkCount = 100; 

  while (uniquePairs.size < linkCount) {
    const song_id = faker.helpers.arrayElement(songIds); 
    const artist_id = faker.helpers.arrayElement(artistIds); 
    const pairKey = `${song_id}-${artist_id}`;
    
    uniquePairs.add(pairKey);
  }


  const insertData = Array.from(uniquePairs).map(pair => {
    const [song_id, artist_id] = pair.split('-'); 
    return {
      song_id: parseInt(song_id, 10), 
      artist_id: parseInt(artist_id, 10), 
    };
  });


  await knex('song_artists').insert(insertData);
};
