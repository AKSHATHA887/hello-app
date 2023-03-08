import configOpentelemetry from './opentelemetry';
/**
 * This is used only for local debugging
 */

import app from './app';

configOpentelemetry();

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running locally on http://localhost:${port}`);
});
