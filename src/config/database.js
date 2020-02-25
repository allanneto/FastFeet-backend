require('dotenv/config');

module.exports = {
  // exportando da maneira antiga pois ese arquivo ira interagir com o sequelize e o arquivod e configuracao do sequelize que nao entendem o import/export
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
