import { execSync, spawn, spawnSync } from 'child_process';

import { resolveApp } from '../utils/path';
import { ERROR, SUCCESS } from '../utils/console';

const localFile = resolveApp('./public/fddm.mp4');
const remoteFlv = 'rtmp://192.168.192.131/live/fddm';
const flvurl = 'http://192.168.192.131:5001/live/fddm.flv';
const streamurl = '';

function ffmpegIsInstalled() {
    const res = spawnSync('ffmpeg', ['-version']);
    if (res.status !== 0) {
        return false;
    }
    return true;
}

export const initFFmpeg = () => {
    const flag = ffmpegIsInstalled();
    if (flag) {
        SUCCESS('ffmpeg已安装，开始运行ffmpeg推流')
    } else {
        ERROR('未安装ffmpeg！')
        return;
    }
    try {
        // ffmpeg推流
        const ffmpeg = spawn(
            `ffmpeg -hide_banner -stream_loop -1 -re -i ${localFile} -c copy -f flv ${remoteFlv}`,
            { shell: true }
        );
        // ffmpeg.stdout.on('data', (data) => {
        //     console.log(`stdout: ${data}`);
        // });
        // ffmpeg.stderr.on('data', (data) => {
        //     console.error(`stderr: ${data}`);
        // });
        // ffmpeg.on('close', (code) => {
        //     console.log(`child process exited with code ${code}`);
        // });
        SUCCESS('初始化FFmpeg成功！')
    } catch (error) {
        ERROR('初始化FFmpeg错误！')
        // console.log(error);
    }
};
