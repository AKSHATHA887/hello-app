/**
 * Place we can keep the GET and POST endpoints
 */

import express from 'express';
const router = express.Router();

import { defaultRoute } from './controllers/defaultRoute';
import { heartbeat } from './controllers/heartbeat';
/* Added for AutoAPI */
import config from './controllers/autoapi/config/config.json';
//import localconfig from '';
//'./controllers/autoapi/local/postgres_config.json';
import testconfig from '../test/functions/controllers/Config/UnitTest_config.json';
import { AutoAPI } from './controllers/autoapi/autoapi';
let autoAPI: AutoAPI;
if (process.env.ENVIRONMENT == "local") {
  //autoAPI = new AutoAPI(localconfig);
  autoAPI = new AutoAPI(config);
} else if (process.env.ENVIRONMENT == "test") {
  autoAPI = new AutoAPI(testconfig);
} else {
  autoAPI = new AutoAPI(config);
}
/* Added for AutoAPI */
import controller from './controllers/values';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import swaggerMetadata from './swaggerMetadata.json';
import { exampleInspectScope } from './controllers/exampleInspect';

/**
 * @openapi
 * /api/Heartbeat:
 *    get:
 *      description: This should return string
 *      responses:
 *        200:
 *          description: Returns a string.
 */
router.get('/api/heartbeat', heartbeat);
router.get('/api/values', controller.getValues);
router.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(
    swaggerJsdoc({ definition: swaggerMetadata, apis: [path.resolve('routes.ts')] })
  )
);

/**
 * @openapi
 * /api/:table
 *    get:
 *      description: This should return the ODATA formatted response to an ODATA query
 *      responses:
 *        200:
 *          description: Returns ODATA JSON.
 */
router.get('/api/:table', (req, res) => autoAPI.autoapi(req, res));

router.get('/api/values/:id', controller.getValue);
router.put('/api/values/:id', controller.updateValue);
router.delete('/api/values/:id', controller.deleteValue);
router.post('/api/values', controller.addValue);
router.get('/exampleInspectScope', exampleInspectScope);
router.all('*', defaultRoute);

export default router;
