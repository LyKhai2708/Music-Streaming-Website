/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('song_artists', function(table) {
        table.integer('song_id').unsigned().references('song_id').inTable('songs').onDelete('CASCADE');
        table.integer('artist_id').unsigned().references('artist_id').inTable('Artists').onDelete('CASCADE');
        table.primary(['song_id', 'artist_id']);
    })
};

/**
 
@param { import("knex").Knex } knex
@returns { Promise<void> }*/
exports.down = function(knex) {
  return knex.schema.dropTable('song_artists');
};
