import Koa from 'koa';
import cors from 'koa-cors'

import { SUCCESS } from './utils/console';
import { initWebSocket } from './config/websocket';

export function setup() {
    const app = new Koa();
    app.use(cors())
    const httpServer = app.listen(3000, () => {
        SUCCESS('Server Listen')
    })
    initWebSocket(httpServer)
}
