import { ParameterizedContext } from "koa";
import liveService from '@/service/liveService';

class LiveController {
    async getList(ctx: ParameterizedContext, next) {
        const data = await liveService.getList()
        ctx.body = {
            code: 200,
            message: '获取数据成功',
            data
        }
        await next()
    }
}

export default new LiveController();
