import express from 'express';
import mysqlx from '@mysql/xdevapi';

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



app.listen(8080, () => {
  console.log(`API's Server listening on port ${port}`);
});

app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

app.post('/ram', (req, res) => {
  const ipAddress = req.socket.remoteAddress
  const body = req.body

  console.log(`inserting ram ${body}`)

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

app.post('/cpu', (req, res, next) => {
  const ipAddress = req.socket.remoteAddress
  const body = req.body

  console.log(`inserting cpu ${body.toString()}`)


    client
    .getSession()
    .then( session => {
      session.sql('USE monitor').execute();
      // session.sql('INSERT IGNORE INTO vm (ip) VALUES (?)').bind(ipAddress).execute()

      // session.sql('INSERT IGNORE INTO cpu (percentage_used, ip) VALUES (?, ?)').bind(body.percentage_used, ipAddress).execute()

      console.log(`tasks son: ${body.percentage_used}`)     

      body.tasks.forEach(task => {
        console.log(task.pid + task.name + task.state + task.puser + task.ram + task.father + ipAddress)
        session
          .sql('INSERT INTO process (pid, name, state, puser, ram, father, ip) VALUES (?, ?, ?, ?, ?, ?, ?)')
          .bind(task.pid, task.name, task.state, task.puser, task.ram, task.father, ipAddress)
          .execute()
          .catch(function (err) {
            next(err)  // expressjs error handling
            res.status(400)
            try {
              res.send("rows not inserted" + err.message)
            } catch (error) {
              
            }
          })
          .then( result => {
            console.log('ram row inserted')

            try {
              res.send('ram inserted')  
            } catch (error) {
              
            }
            
            session.close()
          }) 
      })
    })
  }) 