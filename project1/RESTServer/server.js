import express from 'express';

const app = express();

const port = process.env.PORT

if(port == undefined) throw new Error("Pls make sure a PORT env var is set up correctly for API server")

// Middleware to parse JSON requests
app.use(express.json());

app.listen(port, () => {
  console.log(`API's Server listening on port ${port}`);
});

app.get('/', (req, res) => {
    res.send('Hello, Express!');
});