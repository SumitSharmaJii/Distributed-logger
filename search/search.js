const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 4000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.get('/search', async (req, res) => {
  try {
    const { column, query, startTime, endTime } = req.query;

    const connection = mysql.createConnection({
      host: 'mysql',
      port: '3306',
      user: 'user',
      password: 'password',
      database: 'logs',
    });

    let sql = `SELECT * FROM log_entries WHERE ${mysql.escapeId(column)} LIKE ?`;
    const params = [`%${query}%`];

    // Add timestamp filtering if startTime and endTime are provided
    if (startTime) {
      sql += ` AND timestamp >= ?`;
      params.push(new Date(startTime).toISOString().slice(0, 19).replace('T', ' '));
    }

    if (endTime) {
      sql += ` AND timestamp <= ?`;
      params.push(new Date(endTime).toISOString().slice(0, 19).replace('T', ' '));
    }

    const [results] = await connection.promise().execute(sql, params);
    res.json(results);

  } catch (error) {
    console.error('Error in /search endpoint:', error);
    console.error('SQL Query:', sql);
    console.error('Parameters:', params);
    res.status(500).json({ error: 'Internal Server Error' });

  } finally {
    // Close the MySQL connection after the query is executed
    // if (connection) {
    //   connection.end();
    // }
  }
});

// app.get('/search', async (req, res) => {
//   try {
//     const { column, query, startTime, endTime } = req.query;

//     const connection = mysql.createConnection({
//       host: 'mysql',
//       port: '3306',
//       user: 'user',
//       password: 'password',
//       database: 'logs',
//     });

//     let sql = `SELECT * FROM log_entries WHERE ${column} LIKE ?`;

//     // Add timestamp filtering if startTime and endTime are provided
//     if (startTime && endTime) {
//       sql += ` AND timestamp BETWEEN ? AND ?`;
//     }

//     const params = [`%${query}%`];

//     // If startTime and endTime are provided, convert them to MySQL DATETIME format
//     if (startTime && endTime) {
//       params.push(new Date(startTime).toISOString(), new Date(endTime).toISOString());
//     }

//     const [results] = await connection.promise().execute(sql, params);
//     res.json(results);

//   } catch (error) {
//     console.error('Error in /search endpoint:', error);
//     res.status(500).json({ error: 'Internal Server Error' });

//   } finally {
//     // Close the MySQL connection after the query is executed
//     if (connection) {
//       connection.end();
//     }
//   }
// });

const run = async () => {
  app.listen(port, () => {
    console.log(`Log Search listening at http://localhost:${port}`);
  });
};

run().catch(console.error);
