import express from 'express';
import chalk from 'chalk';

const app = express();

// Settings de aplicación
app.set('host', '127.0.0.1');
app.set('port', process.env.PORT || 3000);
app.set('app name', 'API Rest');
app.set('version', '1.0.0');

// Settings de desarrollo
app.set('env', process.env.NODE_ENV || 'development');

// middleware
app.use(express.json({ limit: '5mb' })); // 5mb previene ataques DoS 
app.use(express.urlencoded({ extended: true, limit: '5mb' })) // para mas adelante utilizar datos desdde un form


app.get("/", (req, res) => {
  const appName = app.get('app name');
  const version = app.get('version');
  
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>${appName}</title></head>
      <body>
        <h1>${appName}</h1>
        <h2>Versión: ${version}</h2>
      </body>
    </html>
  `)});
// Matches both /message and /messages
//"/message{s}"









  app.get("/:username/messages/:messageId", (req, res) => {
    console.log(req.params);
    res.end(); //  * { username: "odin", messageId: "79687378" }
  });














  app.listen(app.get('port'), (error) => {

    if (error) {
      throw error;
    }
    console.log(chalk.green.italic(`\nServer Express: V5.1.0 - ONLINE \nIP:${app.get('host')}:${app.get('port')} - Mode: ${process.env.NODE_ENV}\n`));
  });



