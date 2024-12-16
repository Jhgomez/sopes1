import express from 'express'
import mysqlx from '@mysql/xdevapi'

const app = express()

app.use(express.json())

const dbname = process.env.DB_NAME

var client = mysqlx.getClient(
  {
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASSWORD,
    port            : process.env.DB_PORT       // x protocol port, using 33060
  }, 
  { 
    pooling: { 
      enabled: true,
      maxIdleTime: 30000,
      maxSize: 5, 
      queueTimeout: 10000 
    } 
  }
)

app.listen(8080, () => { console.log('app listening on port 8080') });

app.get('/', (req, res) => {
    res.send('Hello, Express!')
})

app.post('/ram', (req, res, next) => {
  const ipAddress = req.socket.remoteAddress
  const body = req.body

  console.log(`inserting ram ${body}`)

  client
    .getSession()
    .then( session => {
      session.sql(`USE ${dbname}`).execute();

      session.sql('INSERT IGNORE INTO vm (ip) VALUES (?)').bind(ipAddress).execute()

      session
        .sql('INSERT INTO ram (total_ram, free_ram, used_ram, percentage_used, ip) VALUES (?, ?, ?, ?, ?)')
        .bind(body.total_ram, body.free_ram, body.used_ram, body.percentage_used, ipAddress)
        .execute()
        .catch(function (err) {
          next(err)  // expressjs error handling
          session.close()
          res.status(400)
          res.send("ram info not inserted:" + err.message)
          throw new Error(err)
        }).then( _ => {
          res.send('ram info inserted')  
          session.close()
        })

    })
    .catch(function (err) {
      next(err)
      console.log('data base error: ' + err.message);
    })
})

app.post('/cpu', (req, res, next) => {
  const ipAddress = req.socket.remoteAddress
  const body = req.body

  console.log(`inserting cpu`)


    client
    .getSession()
    .then( session => {
      session.sql(`USE ${dbname}`).execute();

      session.sql('INSERT IGNORE INTO vm (ip) VALUES (?)').bind(ipAddress).execute()

      session
        .sql('INSERT IGNORE INTO cpu (percentage_used, ip) VALUES (?, ?)')
        .bind(body.percentage_used, ipAddress)
        .execute()
        .catch(function (err) {
          next(err)  // expressjs error handling
          res.status(400)
          res.send("cpu info not inserted:" + err.message)
        })
        .then( result => {
          console.log('process row inserted')

          try {
            res.send('process inserted')  
          } catch (error) {
            
          }
        }) 

      console.log(`inserting processes`)     

      body.tasks?.forEach(task => {
        console.log(task.pid + task.name + task.state + task.puser + task.ram + task.father + ipAddress)
        session
          .sql('INSERT INTO process (pid, name, state, puser, ram, father, ip) VALUES (?, ?, ?, ?, ?, ?, ?)')
          .bind(task.pid, task.name, task.state, task.puser, task.ram, task.father, ipAddress)
          .execute()
          .catch(function (err) {
            next(err)  // expressjs error handling
            try {
              res.status(400)
              res.send("processes rows not inserted" + err.message)
            } catch (error) {
              
            }
          })
          .then( result => {
            console.log('process row inserted')

            try {
              res.send('process inserted')  
            } catch (error) {
              
            }
            
            session.close()
          }) 
      })

      if (body.tasks == undefined) {
        session.close()
      }
    })
  })

  