import { ERROR, SUCCESS } from "../utils/console";
import { createConnection } from "typeorm";

export const databaseConfig = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '123456',
    database: 'web-rtc',
    synchronize: true,
}

export async function databaseConnect() {
    createConnection({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '123456',
        database: 'web-rtc',
        synchronize: true,
        entities: ['./src' + "/model/*.ts"]
    }).then(connection => {
        SUCCESS('数据库连接成功')
    }).catch(error => {
        ERROR(`数据库连接失败 ${error}`)
    });
}