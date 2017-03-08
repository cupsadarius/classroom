import params from './configs/params';
import initDb from './configs/rethink';
import * as io from 'socket.io';
import * as http from 'http';

const server = http.createServer();
const room = io(server);

// Initialize db connection
initDb().then(() => {
    console.log('DB initialized successfully.');
}).catch((err: Object) => {
    console.log('DB failed to initialize', err);
});

io.listen(params.APP_PORT);
console.log(`Socket listening on ${params.APP_PORT}`);

