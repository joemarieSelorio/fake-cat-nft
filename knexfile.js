require('dotenv').config();
const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DB,
  MYSQL_DB_TEST,
  MYSQL_MAX_POOL,
  NODE_ENV,
} = process.env;

let config;
if (NODE_ENV === 'test') {
  config = {
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DB_TEST,
  };
} else {
  config = {
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DB,
  };
}

module.exports = {
  client: 'mysql',
  connection: config,
  pool: {min: 0, max: parseInt(MYSQL_MAX_POOL ) || 5},
};

