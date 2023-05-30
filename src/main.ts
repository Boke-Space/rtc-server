import './utils/alias';
import { databaseConnect } from "./config/mysql";
import { initSRS } from "./config/srs";
import { initFFmpeg } from "./config/ffmpeg";
import { setup } from "./setup";
import { redisConnect } from './config/redis';

async function main() {
    await Promise.all([
        databaseConnect(),
        redisConnect()
    ])
    initSRS()
    initFFmpeg()
    setup()
}

main()
