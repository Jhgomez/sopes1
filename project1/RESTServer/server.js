import express from 'express';
// import mysql from 'mysql';
import mysqlx from '@mysql/xdevapi';
import axios from 'axios';

const app = express();

app.use(express.json())

var client = mysqlx.getClient(
  {
    host            : 'localhost',
    user            : 'monitor',
    password        : 'monitor',
    port            : 33060       // x protocol port
  }, 
  { 
    pooling: { 
      enabled: true,
      maxIdleTime: 30000,
      maxSize: 5, 
      queueTimeout: 10000 
    } 
  }
);

const port = process.env.PORT

// if(port == undefined) throw new Error("Pls make sure a PORT env var is set up correctly for API server")

// Middleware to parse JSON requests
app.use(express.json());

app.listen(8080, () => {
  console.log(`API's Server listening on port ${port}`);
});

app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

app.post('/ram', (req, res) => {
  const ipAddress = req.socket.remoteAddress
  const body = req.body

  console.log(`inserting ram ${body}`);623

  client
    .getSession()
    .then( session => {
      session.sql('USE monitor').execute();
      session.sql('INSERT IGNORE INTO vm (ip) VALUES (?)').bind(ipAddress).execute()
      session
        .sql('INSERT INTO ram (total_ram, free_ram, used_ram, percentage_used, ip) VALUES (?, ?, ?, ?, ?)')
        .bind(body.total_ram, body.free_ram, body.used_ram, body.percentage_used, ipAddress).execute()
      return session.close()
    })
    .catch(function (err) {
      console.log('data base error: ' + err.message);
    })
    
    res.send('ram inserted')
})


// pool.end(function (err) {
//   // all connections in the pool have ended
// });

// var sql = "SELECT * FROM ?? WHERE ?? = ?";
// var inserts = ['users', 'id', userId];
// sql = mysql.format(sql, inserts);

// connection.query('SELECT * FROM posts')
//   .stream({highWaterMark: 5})
//   .pipe(...);


// JOINS with overlapping column names

// var options = {sql: '...', nestTables: true};
// connection.query(options, function (error, results, fields) {
//   if (error) throw error;
//   /* results will be an array like this now:
//   [{
//     table1: {
//       fieldA: '...',
//       fieldB: '...',
//     },
//     table2: {
//       fieldA: '...',
//       fieldB: '...',
//     },
//   }, ...]
//   */
// });