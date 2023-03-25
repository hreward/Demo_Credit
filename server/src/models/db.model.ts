import knexCon from "knex";

export const knex = knexCon({
  client: 'mysql',
  // version: '5.7',
  connection: {
    host : '127.0.0.1',
    port : 3306,
    user : 'root',
    password : '',
    database : 'demo_credit'
  }
});

