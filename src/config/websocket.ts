import { Server } from "socket.io";
import { SUCCESS, INFO, WARN, ERROR } from "../utils/console";
import { SocketStatus, SocketMessage } from "../types/websocket";

import { getRepository, getConnection } from "typeorm";
import { Live } from "@/model/live";

async function getCurrentLive() {
    const liveRepository = getRepository(Live);
    return await liveRepository.find()
}

async function getCurrentRoom(roomId: string) {
    const liveRepository = getRepository(Live);
    return await liveRepository.findOne({ where: { roomId } })
}

async function stopLive(roomId: string) {
    await getConnection()
        .createQueryBuilder()
        .delete()
        .from(Live)
        .where("roomId = :roomId", { roomId })
        .execute();
}

function createLive(param: any) {
    const liveRepository = getRepository(Live);
    const res = liveRepository.create(param)
    return liveRepository.save(res)
}

async function getAllLiveUser(io: any, roomId: string) {
    const allSocketsMap = await io.in(roomId).fetchSockets();
    return Object.keys(allSocketsMap).map((item) => {
        return {
            id: allSocketsMap[item].id,
            rooms: [...allSocketsMap[item].rooms.values()],
        };
    });
}

function getRoomId(list: IterableIterator<string>, id: string) {
    let roomId = ''
    for (const item of list) {
        if (item !== id) {
            roomId = item
        }
    }
    return roomId
}

export function initWebSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    io.on(SocketStatus.connection, async (socket) => {
        SUCCESS('WebSocket已连接')

        const currentLive = await getCurrentLive()
        socket.emit('live', currentLive)

        setInterval(async () => {
            const currentLive = await getCurrentLive()
            socket.emit('live', currentLive)
        }, 10000)

        // 收到用户进入房间
        socket.on(SocketMessage.join, async (data: any) => {
            INFO(`用户${socket.id}进入房间${data.roomId}`)
            socket.join(data.roomId);
            // 开播
            if (data.type === 'live') {
                INFO(`用户${socket.id}在房间${data.roomId}开播`)
                const params = {
                    roomId: data.roomId,
                    socketId: socket.id,
                    roomName: data.data.roomName,
                    streamUrl: data.data.srs?.streamurl,
                    flvUrl: data.data.srs?.flvurl,
                    isLive: 1,
                }
                await createLive(params)
                // 获取当前在直播的房间
                const currentLive = await getCurrentLive()
                socket.emit('live', currentLive)
                socket.emit(SocketMessage.joined, data);
                const liveUser = await getAllLiveUser(io, data.roomId);
                socket.to(data.roomId).emit(SocketMessage.liveUser, liveUser);
                //  进入直播间
            } else if (data.type === 'watch') {
                const currentRoom = await getCurrentRoom(data.roomId)
                const liveUser = await getAllLiveUser(io, data.roomId);
                const info = { username: socket.id, room: data.roomId }
                socket.emit(SocketMessage.joined, currentRoom);
                socket.emit(SocketMessage.roomLiveing, liveUser);
                socket.to(data.roomId).emit(SocketMessage.otherJoin, info);
                socket.to(data.roomId).emit(SocketMessage.liveUser, liveUser);
                //  发起会议
            } else if (data.type === 'meeting') {
                console.log(data)
                const liveUser = await getAllLiveUser(io, data.roomId);
                socket.emit(SocketMessage.joined, { ...data, liveUser });
                socket.to(data.roomId).emit(SocketMessage.liveUser, liveUser);
                //  参与会议
            } else if (data.type === 'attend') {
                console.log(data)
                const currentRoom = await getCurrentRoom(data.roomId)
                const liveUser = await getAllLiveUser(io, data.roomId);
                const info = { username: socket.id, room: data.roomId }
                socket.emit(SocketMessage.joined, currentRoom);
                socket.emit(SocketMessage.roomLiveing, liveUser);
                socket.to(data.roomId).emit(SocketMessage.otherJoin, info);
                socket.to(data.roomId).emit(SocketMessage.liveUser, liveUser);
            }
        })

        // 收到用户获取当前在线用户
        socket.on(SocketMessage.getLiveUser, async (data) => {
            const liveUser = await getAllLiveUser(io, data.roomId);
            INFO(`房间${data.roomId}在线人数为${liveUser.length}`)
            socket.emit(SocketMessage.getLiveUser, { socketId: socket.id });
            socket.emit(SocketMessage.liveUser, liveUser);
        });

        // 收到用户离开房间
        socket.on(SocketMessage.leave, async (data) => {
            WARN(`用户${socket.id}离开房间${data.roomId}`)
            // socket.leave(data.roomId)
            socket.emit(SocketMessage.leaved, { socketId: socket.id });
            const liveUser = await getAllLiveUser(io, data.roomId);
            // const currentLive = await getCurrentLive()
            // socket.to('home').emit('live', currentLive)
            socket.to(data.roomId).emit(SocketMessage.liveUser, liveUser);
        });

        // 收到用户发送消息
        socket.on(SocketMessage.message, (data) => {
            INFO(`收到用户${socket.id}在房间${data.roomId}发送信息`)
            socket.to(data.roomId).emit(SocketMessage.message, data);
        });

        // 收到管理员不在直播
        socket.on(SocketMessage.roomNoLive, async (data) => {
            const roomId = data.roomId
            socket.to(roomId).emit(SocketMessage.roomNoLive, data);
            // stopLive(data.roomId)
        });

        // 收到更新加入信息
        socket.on(SocketMessage.updateJoinInfo, async (data: any) => {
            INFO(`用户${socket.id}更新加入房间${data.roomId}`)
        })

        // 断开连接中
        socket.on(SocketStatus.disconnecting, async (reason) => {
            WARN(`WebSocket断开连接中`)
            const roomId = getRoomId(socket.rooms.values(), socket.id)
            // socket.leave(roomId)
            const liveUser = await getAllLiveUser(io, roomId);
            // // 关闭直播间
            // await stopLive(roomId)
            socket.to(roomId).emit(SocketMessage.getLiveUser, liveUser);
            socket.to(roomId).emit(SocketMessage.leave, {
                socketId: socket.id,
                roomId,
                liveUser
            });
        });

        // 已断开连接
        socket.on(SocketStatus.disconnect, async (reason) => {
            // ERROR(`WebSocket已断开连接`)
        });
    });
}