import path from 'path';
import Koa from 'koa';
import cors from 'koa-cors'
import staticService from 'koa-static';
import { registerRoutes } from '@/router/index';

import { SUCCESS } from './utils/console';
import { initWebSocket } from './config/websocket';

export function setup() {
    const app = new Koa();
    app.use(cors())
    app.use(staticService(path.join(__dirname, 'public')));
    registerRoutes(app)
    const httpServer = app.listen(3000, () => {
        SUCCESS('Server Listen')
    })
    initWebSocket(httpServer)
}
