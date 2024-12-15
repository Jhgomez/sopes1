import express from 'express';
import mysql from 'mysql';

const app = express();

app.use(express.json())

var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'monitor',
  password        : 'monitor',
  database        : 'monitor',
  port            : 3306
});

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

  console.log(`inserting ram ${body}`);
  
  pool.query(
    'INSERT INTO vm (ip) VALUES (?, ?, ?, ?, ?, ?, ?)', 
    [body.total_ram, body.free_ram, body.used_ram, body.percentage_used, ipAddress],
    function (error, results, fields) {
      if (error) throw error;
      
  });

  res.send('ram inserted')
  // pool.query('INSERT INTO ram1 + 1 AS solution', function (error, results, fields) {
  //   if (error) throw error;
  //   console.log('The solution is: ', results[0].solution);
  // });
})


pool.end(function (err) {
  // all connections in the pool have ended
});

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