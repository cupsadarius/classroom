import params from './configs/params';
import initDb from './configs/rethink';
import * as io from 'socket.io';
import * as http from 'http';

import sessionManager from './sessionManager';
import {authService} from './services/authService';

const server = http.createServer();
const room = io(server);

// Initialize db connection
initDb().then(() => {
    console.log('DB initialized successfully.');
}).catch((err: Object) => {
    console.log('DB failed to initialize', err);
});

room.on('connection', async (socket) => {
    const sessionId = socket.handshake.query.sessionId;
    const participantId = socket.handshake.query.participantId;
    const token = socket.handshake.query.token;
    const isAuthenticated = await authService.validate(token);
    if (!isAuthenticated) {
        socket.disconnect(true);
    }
    sessionManager.createSession(sessionId);
    await sessionManager.addParticipant(sessionId, participantId, socket);
});

room.listen(params.APP_PORT);
console.log(`Socket listening on ${params.APP_PORT}`);

