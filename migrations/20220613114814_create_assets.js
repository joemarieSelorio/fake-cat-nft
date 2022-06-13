require('dotenv').config();
const {USERS_TABLE} = process.env;

exports.up = function(knex, Promise) {
  return knex.schema.createTable(USERS_TABLE, function(t) {
    t.string('uuid').primary();
    t.string('name', 64).notNullable();
    t.string('img_url', 64).notNullable();
    t.string('user_id', 64).notNullable();
    t.string('gallery_id', 64).notNullable();
    t.number('amount', 64).notNullable();
    t.datetime('created_at', 6).defaultTo(knex.fn.now(6));
    t.datetime('last_updated_at', 6).defaultTo(knex.fn.now(6));
  });
};
exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists(USERS_TABLE);
};

