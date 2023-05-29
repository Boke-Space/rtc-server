import { Live } from "@/model/live";
import { ParameterizedContext } from "koa";
import { getRepository } from "typeorm";

const liveRepository = getRepository(Live);

class LiveService {
    async getList() {
        const list = await liveRepository.find()
        return list
    }
    async getListById(roomId: string) {
        const list = await liveRepository.findOne({ where : { roomId } })
        return list
    }
}

export default new LiveService();
