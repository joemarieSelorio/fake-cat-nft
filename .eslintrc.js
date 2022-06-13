module.exports = {
  'env': {
    'es6': true,
    'node': true,
    'mocha': true,
  },
  'extends': [
    'eslint:recommended',
    'google',
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parserOptions': {
    'ecmaVersion': 2018,
  },
  'rules': {},
};
