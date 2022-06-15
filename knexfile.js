require('dotenv').config();
const {MYSQL_HOST, MYSQL_PORT,
  MYSQL_ROOT_USER, MYSQL_PASSWORD, MYSQL_DB, MYSQL_MAX_POOL} = process.env;
module.exports = {
  client: 'mysql',
  connection: {
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    user: MYSQL_ROOT_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DB,
  },
  pool: {min: 0, max: parseInt(MYSQL_MAX_POOL ) || 5},
};

