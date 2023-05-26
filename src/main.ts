import './utils/alias';
import { databaseConnect } from "./config/mysql";
import { initSRS } from "./config/srs";
import { initFFmpeg } from "./config/ffmpeg";
import { setup } from "./setup";

function main() {
    databaseConnect()
    initSRS()
    initFFmpeg()
    setup()
}

main()
