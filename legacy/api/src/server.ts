import * as express from 'express';
import params from './configs/params';
import loadExpressConfigs from './configs/experss';
import initDb from './configs/rethink';
import router from './configs/router';

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
    app.use('/v1', router);

    // Start the web app
    app.listen(params.APP_PORT, () => console.log(`App listening on port ${params.APP_PORT}`));
}
