require('dotenv').config();
const {
  USERS_TABLE,
  ASSETS_TABLE,
  OFFERS_TABLE,
} = process.env;

exports.up = async function(knex, Promise) {
  await knex.schema.alterTable(OFFERS_TABLE, function(t) {
    t.string('offer_owner', 64).notNullable()
        .references('uuid').inTable(USERS_TABLE).alter();
    t.string('asset_id', 64).notNullable()
        .references('uuid').inTable(ASSETS_TABLE).alter();
  });

  return;
};


exports.down = async function(knex, Promise) {
  await knex.schema.table(OFFERS_TABLE, function(t) {
    t.dropForeign('offer_owner');
    t.dropForeign('asset_id');
  });

  return;
};
