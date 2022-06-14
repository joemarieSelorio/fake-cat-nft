require('dotenv').config();
const {OFFERS_TABLE} = process.env;

exports.up = function(knex, Promise) {
  return knex.schema.createTable(OFFERS_TABLE, function(t) {
    t.string('uuid').primary();
    t.string('offer_owner', 64).notNullable();
    t.integer('asset_id', 64).notNullable();
    t.integer('amount_offer', 64).notNullable();
    t.boolean('accepted', 64).defaultTo(false);
    t.datetime('created_at', 6).defaultTo(knex.fn.now(6));
    t.datetime('last_updated_at', 6).defaultTo(knex.fn.now(6));
  });
};
exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists(OFFERS_TABLE);
};

