import mysql from 'mysql2/promise';
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '383838',
  database: 'reactblog',
  connectionLimit: 10,
});

export default db;
