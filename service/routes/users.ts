import express from 'express';
var router = express.Router();

export default router.get('/', function(req: express.Request, res: express.Response, next : express.NextFunction) {
  res.send('respond with a resource');
});

