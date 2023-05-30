import { ERROR, SUCCESS } from '@/utils/console';
import { createClient } from 'redis';


export const redisClient = createClient({
    socket: {
        port: 6379,
        host: '127.0.0.1',
    },
});

export const redisConnect = async () => {
    const msg = (flag: boolean) => `连接redis数据库${flag ? '成功' : '失败'}!`;

    redisClient.on('error', (err) => {
        console.log(ERROR(msg(false)));
        console.log(err);
    });

    try {
        await redisClient.connect();
        SUCCESS(msg(true))
        return redisClient;
    } catch (error) {
        ERROR(msg(false))
        console.log(error);
        throw new Error(msg(false));
    }
};
