import { execSync, spawnSync } from 'child_process';

import { ERROR, SUCCESS } from '../utils/console';

function dockerIsInstalled() {
    const res = spawnSync('docker', ['-v']);
    if (res.status !== 0) {
        return false;
    }
    return true;
}

export const initSRS = () => {
    const flag = dockerIsInstalled();
    if (flag) {
        SUCCESS('docker已安装，开始运行docker-srs')
    } else {
        ERROR('未安装docker！')
        return;
    }
    try {
        try {
            // 停掉旧的容器
            execSync(`docker stop srs-docker`);
        } catch (error) {
            // console.log(error);
        }
        try {
            // 删掉旧的容器
            execSync(`docker rm srs-docker`);
        } catch (error) {
            // console.log(error);
        }
        // 启动新的容器
        execSync(`docker run -d --name srs-docker --rm --env CANDIDATE=127.0.0.1 \
    -p 1935:1935 -p 5001:8080 -p 1985:1985 -p 8000:8000/udp \
    registry.cn-hangzhou.aliyuncs.com/ossrs/srs:4 \
    objs/srs -c conf/rtc2rtmp.conf`);
        SUCCESS('初始化SRS成功！')
    } catch (error) {
        // console.log(error);
        ERROR('初始化SRS失败！')
    }
};
