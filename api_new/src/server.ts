import * as express from 'express';
import { Request, Response } from 'express';
import params from './configs/params';
import loadExpressConfigs from './configs/experss';
import initDb from './configs/rethink';
import {db} from './db';
import {UserRepository} from './db/repositories/UserRepository';
namespace express_web_api {

    // Initialize db connection
    initDb().then(() => {
        console.log('DB initialized successfully.');
    }).catch((err: Object) => {
        console.log('DB failed to initialize', err);
    });

    // Initialize express and set port number
    let app = express();

    app = loadExpressConfigs(app);

    // Handle GET for the root URL
    app.get('/', (req: Request, resp: Response) => {
        resp.send('Hello Express!');
    });

    app.get('/users', async (req: Request, resp: Response) => {
        try {
            const users = await (db.getRepo('userRepository') as UserRepository).getAllUsers();
            resp.json(users);
        } catch (e) {
            resp.json(e);
        }
    });

    // Start the web app
    app.listen(params.APP_PORT, () => console.log(`App listening on port ${params.APP_PORT}`));
}
