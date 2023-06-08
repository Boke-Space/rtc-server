import { Live } from "@/model/live";
import { ParameterizedContext } from "koa";
import { getConnection, getRepository } from "typeorm";

const liveRepository = getRepository(Live);

class LiveService {
    async getList() {
        const list = await liveRepository.find()
        return list
    }
    async getOneById(roomId: string) {
        const list = await liveRepository.findOne({ where: { roomId } })
        return list
    }
    async deleteById(roomId: string) {
        const res = await getConnection()
            .createQueryBuilder()
            .delete()
            .from(Live)
            .where("roomId = :roomId", { roomId })
            .execute();
        return res
    }
}

export default new LiveService();
