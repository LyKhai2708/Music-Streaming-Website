/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('songs', function(table) {
    table.increments('song_id').primary();
    table.string('song_name',100).notNullable();
    table.integer('duration').notNullable();
    table.integer('genre_id').unsigned().references('genre_id').inTable('Genres').onDelete('SET NULL');
    table.date('release_date');
    table.integer('streaming_count').defaultTo(0);
    table.string('sound',255).notNullable();
    table.string('avatar', 255).nullable();
  });
};

/**
 
@param { import("knex").Knex } knex
@returns { Promise<void> }*/
exports.down = function(knex) {
  return knex.schema.dropTable('songs');
};
