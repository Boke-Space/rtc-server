import Router from 'koa-router';

import liveController from '@/controller/liveController';

const liveRouter = new Router({ prefix: '/live' });

liveRouter.get('/list', liveController.getList);
liveRouter.get('/:id', liveController.getOneById);
liveRouter.delete('/', liveController.endLive);

export default liveRouter.routes();
