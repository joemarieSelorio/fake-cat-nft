require('dotenv').config();
const {USERS_TABLE} = process.env;

exports.up = function(knex, Promise) {
  return knex.schema.createTable(USERS_TABLE, function(t) {
    t.string('uuid').primary();
    t.string('first_name', 64).notNullable();
    t.string('last_name', 64).notNullable();
    t.string('password', 255).notNullable();
    t.string('email_address', 64).notNullable();
    t.datetime('created_at', 6).defaultTo(knex.fn.now(6));
    t.datetime('last_updated_at', 6).defaultTo(knex.fn.now(6));
    t.unique(['email_address']);
  });
};
exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists(USERS_TABLE);
};
