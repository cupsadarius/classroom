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

room.on('connection', (socket) => {
    socket.on('authentication', async (event: {[key: string]: string}) => {
        try {
            const isAuthenticated = await authService.validate(event.token);
            if (!isAuthenticated) {
                socket.disconnect(true);
            }

            sessionManager.createSession(event.sessionId);
            await sessionManager.addParticipant(event.sessionId, event.participantId, socket);
        } catch (e) {
            console.log(e);
        }
    });
});

room.listen(params.APP_PORT);
console.log(`Socket listening on ${params.APP_PORT}`);

