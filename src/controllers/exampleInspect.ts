import { Request, Response } from 'express';
export function exampleInspectScope(req: Request, res: Response): void {
  let scope: string[] = [];
  if ('scp' in req.authInfo) {
    if (req.authInfo && req.authInfo['scp']) {
      const scopeString = req.authInfo['scp'] as string;
      // console.log(req.authInfo);
      scope = scopeString.split(' ');
    }
  }
  if (scope && scope.includes('offline_access')) {
    res.status(200).json({ name: 'Authorized Welcome!' });
  } else {
    console.log('Invalid Scope, 403');
    res.status(403).json({ error: 'Insufficient Scope' });
  }
}
