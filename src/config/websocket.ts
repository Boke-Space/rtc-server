import { Server } from "socket.io";
import { SUCCESS, INFO, WARN, ERROR } from "../utils/console";
import { SocketConnect, SocketMessage } from "../types/websocket";

import { getRepository } from "typeorm";
import { Live } from "@/model/live";


async function getCurrentRoom(roomId: string) {
    const liveRepository = getRepository(Live);
    return await liveRepository.findOne({ where: { roomId } })
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

    io.on(SocketConnect.connection, async (socket) => {
        SUCCESS('WebSocket已连接')
        // 收到用户进入房间
        socket.on(SocketMessage.join, async (data: any) => {
            INFO(`用户${socket.id}进入房间${data.roomId}`)
            socket.join(data.roomId);
            if (data.isAdmin) {
                // 开播
                console.log('开播', data)
                const params = {
                    roomId: data.roomId,
                    socketId: socket.id,
                    roomName: data.data.roomName,
                    streamUrl: data.data.srs?.streamurl,
                    flvUrl: data.data.srs?.flvurl,
                }
                const res = createLive(params)
                socket.emit(SocketMessage.joined, data);
            } else {
                // 进入直播间
                const info = { username: socket.id, room: data.roomId }
                // 获取进入房间的数据
                const currentRoom = await getCurrentRoom(data.roomId)
                socket.emit(SocketMessage.joined, { data: currentRoom });
                socket.emit(SocketMessage.roomLiveing, data);
                socket.to(data.roomId).emit(SocketMessage.otherJoin, { data: info });
                const liveUser = await getAllLiveUser(io, data.roomId);
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
            socket.emit(SocketMessage.leaved, { socketId: socket.id });
            const liveUser = await getAllLiveUser(io, data.roomId);
            socket.to(data.roomId).emit(SocketMessage.liveUser, liveUser);
        });

        // 收到用户发送消息
        socket.on(SocketMessage.message, (data) => {
            INFO(`收到用户${socket.id}在房间${data.roomId}发送信息`)
            socket.to(data.roomId).emit(SocketMessage.message, data);
        });

        // 收到更新加入信息
        socket.on(SocketMessage.updateJoinInfo, async (data: any) => {
            INFO(`用户${socket.id}更新加入房间${data.roomId}`)
        })

        // 断开连接中
        socket.on(SocketConnect.disconnecting, async (reason) => {
            WARN(`WebSocket断开连接中`)
            const roomId = getRoomId(socket.rooms.values(), socket.id)
            const liveUser = await getAllLiveUser(io, roomId);
            socket.to(roomId).emit(SocketMessage.liveUser, liveUser);
            socket.to(roomId).emit(SocketMessage.leave, {
                socketId: socket.id,
                roomId
            });
        });

        // 已断开连接
        socket.on(SocketConnect.disconnect, async (reason) => {
            ERROR(`WebSocket已断开连接`)
        });
    });
}