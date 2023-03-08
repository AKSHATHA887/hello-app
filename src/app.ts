import { Application, NextFunction, Request, Response } from 'express';
import express from 'express';

import routes from './routes';
import morgan from 'morgan';
import cors from 'cors';
import { errorCatchAllHandler } from './middleware/errorCatchAllHandler';
import { BearerStrategy } from 'passport-azure-ad';
import passport from 'passport';
import { securityConfig } from './azureADConfig';

const app: Application = express();
app.use(express.json());

// this has to be last
app.use(morgan('tiny'));

app.use((_req: Request, res: Response, next: NextFunction) => {
  res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.header('Server', '');
  res.header('server', '');
  next();
});

app.use(cors({ origin: [/https?:\/\/localhost/, /.accenture.com$/] }));
app.use(passport.initialize());
passport.use(
  new BearerStrategy(
    securityConfig,
    (
      token: string,
      done: (err: Error, user: Record<string, unknown>, token: string) => void
    ): BearerStrategy => {
      return done(null, {}, token);
    }
  )
);
//app.use(passport.authenticate('oauth-bearer', { session: false }));
app.use(routes);
app.use(errorCatchAllHandler);
app.disable('x-powered-by');

exports.autoAPI = app;
export default app;
