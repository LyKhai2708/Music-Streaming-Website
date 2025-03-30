/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('Artists', function(table) {
    table.increments('artist_id').primary();
    table.string('artist_name',100).notNullable().unique();
    table.text('bio').nullable();
    table.string('country', 100).nullable();
    table.string('avatar', 255).nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('Artists');
};
