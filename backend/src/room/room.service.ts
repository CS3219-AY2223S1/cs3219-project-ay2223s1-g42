import { v4 } from "uuid";
<<<<<<< HEAD
<<<<<<< HEAD
import { Injectable, Scope } from "@nestjs/common";
=======
import { Inject, Injectable, Scope } from "@nestjs/common";
>>>>>>> feat: tmoved all websockets to redis, tdebugging undefined dep injection
=======
import { Injectable, Scope } from "@nestjs/common";
>>>>>>> feat: fix dep injection bug with circular dep fix

import { NAMESPACES } from "src/cache/constants";
import { RedisCacheService } from "src/cache/redisCache.service";
import { PoolUser } from "src/match/match.gateway";
import { Room } from "./room.gateway";

@Injectable()
export class RoomService {
<<<<<<< HEAD
<<<<<<< HEAD
  constructor(private cache: RedisCacheService) {}
=======
  constructor(private cache: RedisCacheService) {
    console.log("room service cache: ", cache);
  }
>>>>>>> feat: tmoved all websockets to redis, tdebugging undefined dep injection
=======
  constructor(private cache: RedisCacheService) {}
>>>>>>> feat: fix dep injection bug with circular dep fix

  async getRoomFromUserId(userId: string) {
    console.log("checking room from user id...");
    const room = await this.cache.getKeyInNamespace<Room>(
      [NAMESPACES.ROOM, NAMESPACES.USERS],
      userId
    );
    return room;
  }

  async createRoom(users: PoolUser[]) {
<<<<<<< HEAD
    // create room
=======
>>>>>>> feat: tmoved all websockets to redis, tdebugging undefined dep injection
    const roomId = v4();
    const room: Room = {
      users,
      id: roomId,
    };
    await this.cache.setKeyInNamespace([NAMESPACES.ROOM], roomId, room);
<<<<<<< HEAD

    // add user to room users
    const addRoomedUsers = room.users.map(async (user) => {
      await this.cache.setKeyInNamespace(
        [NAMESPACES.ROOM, NAMESPACES.USERS],
        user.id.toString(),
        room
      );
    });
    await Promise.all(addRoomedUsers);
=======
>>>>>>> feat: tmoved all websockets to redis, tdebugging undefined dep injection
    return room;
  }

  async addUserToRoom(room: Room, user: PoolUser) {
    const newUsers = room.users.concat(user);
    const newRoom: Room = {
      ...room,
      users: newUsers,
    };
    await this.cache.setKeyInNamespace([NAMESPACES.ROOM], room.id, newRoom);
    return newRoom;
  }

  async removeUserFromRoom(room: Room, userId: number) {
    const newUsers = room.users.filter((user) => user.id !== userId);
    const newRoom: Room = {
      ...room,
      users: newUsers,
    };
    await this.cache.setKeyInNamespace([NAMESPACES.ROOM], room.id, newRoom);
    return newRoom;
  }

  async deleteRoom(roomId: string) {
    await this.cache.deleteKeyInNamespace([NAMESPACES.ROOM], roomId);
  }
}
