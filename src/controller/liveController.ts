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
    async getOneById(ctx: ParameterizedContext, next) {
        const roomId = ctx.params.id
        const data = await liveService.getOneById(roomId)
        ctx.body = {
            code: 200,
            message: '获取数据成功',
            data
        }
        await next()
    }
    async endLive(ctx: ParameterizedContext, next) {
        const roomId = ctx.query.roomId as string
        const data = await liveService.deleteById(roomId)
        let message: string
        if (data.affected === 0) message = '删除失败'
        else message = '删除成功'
        ctx.body = {
            code: 200,
            message,
            data
        }
        await next()
    }
}

export default new LiveController();
