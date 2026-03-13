const sql = require('mssql');
const config = {
  user: "sa",
  password: "Automatic",
  database: "",
  server: '172.23.10.51',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false,
    trustServerCertificate: true,
  }
};

let pool = null;

async function getPool() {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
}

exports.qureyR = async (input) => {
  try {
    const p = await getPool();
    const result = await p.query(input);
    return result;
  } catch (err) {
    return err;
  }
};
