import express from 'express';
import chalk from 'chalk';

const HOSTNAME = '127.0.0.1';
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV ;
const app = express();





app.get("/", (req, res) => res.send("Home"));

























app.listen(PORT, (error) => {

  if (error) {
    throw error;
  }
  console.log(chalk.green.italic(`\nServer Node V22.18 - ONLINE - ${HOSTNAME} ${PORT}\nMode: ${NODE_ENV}`));
});



