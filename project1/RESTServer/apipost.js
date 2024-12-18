
import axios from 'axios';


//   id INT AUTO_INCREMENT PRIMARY KEY,
// 	time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// 	percentage_used FLOAT NOT NULL,
//   	ip VARCHAR(20),
// 	FOREIGN KEY (ip) REFERENCES vm(ip)
// );

// CREATE TABLE IF NOT EXISTS process (
// 	id INT AUTO_INCREMENT PRIMARY KEY,
// 	pid FLOAT NOT NULL,
// 	name VARCHAR(50) NOT NULL,
// 	state VARCHAR(50) NOT NULL,
// 	puser VARCHAR(50) NOT NULL,
// 	ram FLOAT,
// 	father FLOAT,
//   	ip VARCHAR(20),
// 	time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// 	FOREIGN KEY (ip) REFERENCES vm(ip)

const data = {
    percentage_used: 105,
    tasks: [
      {
        pid: 123,
        name: 'RemotePlayback(393)',
        state: 'S',
        puser: 'systemd+',
        ram: 0.1,
        father: 0.3,
      },
      {
        pid: 2548,
        name: 'ps -aux',
        state: 'R+',
        puser: 'juan',
        ram: 0.0,
        father: 0.0,
      },
      {
        pid: 382,
        name: '/init',
        state: 'Ss',
        puser: 'root',
        ram: 0.0,
        father: 0.1,
      }
    ]
}

const dataRam = {
  total_ram: 105,
  free_ram: 35,
  used_ram: 70,
  percentage_used: 66,
}

const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

axios
  .post('http://127.0.0.1:8080/ram', dataRam, config)
  .then(res => {
    console.log(`Status: ${res.status}`)
    console.log('Body: ', res.data)
  })
  .catch(err => {
    console.error(err)
  })

//   services:
//   backend:
//     build:
//       context: ./RESTServer
//       dockerfile: Dockerfile
//     ports:
//       - "8080:8080"
//     environment:
//       DB_HOST: ldb
//       DB_NAME: monitor
//       DB_USER: monitor
//       DB_PASSWORD: monitor
//       DB_PORT: 33060
//     container_name: 'lnode'
//     restart: always

//     data:
//       build:
//         context: ./db
//         dockerfile: Dockerfile
//       ports:
//         - "33060:33060"
//         - "3306:3306"
//       environment:
//         MYSQL_ROOT_PASSWORD: monitor
//         MYSQL_DATABASE: monitor
//         MYSQL_USER: monitor
//         MYSQL_PASSWORD: monitor
//       volumes:
//         - mysql:/var/lib/mysql      
//       container_name: 'ldb'
//       restart: always
    
//     monitor:
//       build:
//         context: ./monitorAgent
//       ports:
//         - "3000:3000"
//       privileged: true
//       volumes:
//         - /proc:/proc
//       restart: always

//       # image: 'allenrovas/proyecto1_monitoreo'
//       # container_name: 'Backend_Go_Pr1'
//       # restart: always
//       # volumes:
//       #   - type: bind
//       #     source: /proc
//       #     target: /proc
//       #   - /proc:/proc
//       #   - /etc/passwd:/etc/passwd
//       # pid: host
//       # user: root
//       # privileged: true
//       # ports:
//       #   - '5200:5200'

// volumes:
//   mysql: 