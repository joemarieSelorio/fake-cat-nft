require('dotenv').config();
const {
  USERS_TABLE,
  ASSETS_TABLE,
  GALLERIES_TABLE,
  WALLETS_TABLE,
  VOTES_TABLE,
} = process.env;

exports.up = async function(knex, Promise) {
  await knex.schema.alterTable(ASSETS_TABLE, function(t) {
    t.string('user_id', 64).notNullable()
        .references('uuid').inTable(USERS_TABLE).alter();
    t.string('gallery_id', 64)
        .references('uuid').inTable(GALLERIES_TABLE).alter();
  });

  await knex.schema.alterTable(GALLERIES_TABLE, function(t) {
    t.string('user_id', 64).notNullable()
        .references('uuid').inTable(USERS_TABLE).alter();
  });

  await knex.schema.alterTable(WALLETS_TABLE, function(t) {
    t.string('user_id', 64).notNullable()
        .references('uuid').inTable(USERS_TABLE).alter();
  });

  await knex.schema.alterTable(VOTES_TABLE, function(t) {
    t.string('user_id', 64).notNullable()
        .references('uuid').inTable(USERS_TABLE).alter();
    t.string('asset_id', 64).notNullable()
        .references('uuid').inTable(ASSETS_TABLE).alter();
  });

  return;
};


exports.down = async function(knex, Promise) {
  await knex.schema.table(ASSETS_TABLE, function(t) {
    t.dropForeign('user_id');
    t.dropForeign('gallery_id');
  });

  await knex.schema.table(GALLERIES_TABLE, function(t) {
    t.dropForeign('user_id');
  });

  await knex.schema.table(WALLETS_TABLE, function(t) {
    t.dropForeign('user_id');
  });

  await knex.schema.table(VOTES_TABLE, function(t) {
    t.dropForeign('user_id');
    t.dropForeign('asset_id');
  });

  return;
};
