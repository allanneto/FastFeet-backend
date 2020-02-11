module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'prettier'
  ],
  plugins: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "class-methods-use-this": "off", // Desabilita a regra que exige que todos os metodos em classe usem o this
    "no-param-reassign": "off", // Desabilita a regra que nao permite que os parametros de requisicoes sejam alterados, isso da conflito com o sequelize futuramente
    "camelcase": "off", // Permite que variaveis sejam criadas em formatos diferentes de "myVar". Ex: "my_var"
    "no-unused-vars": ["error", {"agrIgnorePattern": "next"}], // desabilita a regra que nao permite a declaracao de variaveis que nao seram utilizadas, porm em alguns momentos teremos de declarar next mesmo que nao formos utiliza-la.
    "prettier/prettier": "error"
  },
};
