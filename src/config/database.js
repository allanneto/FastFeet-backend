module.exports = {
  // exportando da maneira antiga pois ese arquivo ira interagir com o sequelize e o arquivod e configuracao do sequelize que nao entendem o import/export
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'fastfeet',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
