import { v4 } from "uuid";
import { Injectable } from "@nestjs/common";

import { NAMESPACES } from "src/cache/constants";
import { RedisCacheService } from "src/cache/redisCache.service";
import { PoolUser } from "src/match/match.gateway";
import { Room } from "./room.gateway";

@Injectable()
export class RoomService {
  constructor(private cache: RedisCacheService) {}

  async getRoomIdFromUserId(userId: string): Promise<string> {
    const roomId = await this.cache.getKeyInNamespace<string>(
      [NAMESPACES.ROOM, NAMESPACES.USERS],
      userId
    );
    return roomId;
  }

  async createRoom(users: PoolUser[]) {
    // create room
    const roomId = v4();
    const room: Room = {
      users,
      id: roomId,
    };
    await this.cache.setKeyInNamespace([NAMESPACES.ROOM], roomId, room);

    // add user to room users (store room id of each user in a room)
    const addRoomedUsers = room.users.map(async (user) => {
      await this.cache.setKeyInNamespace(
        [NAMESPACES.ROOM, NAMESPACES.USERS],
        user.id.toString(),
        room.id
      );
    });

    // throw if error occurred while adding room users
    await Promise.all(addRoomedUsers);
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

  /**
   * Get room data from room id
   * @param roomId Id of room
   * @returns room data
   */
  async getRoomFromId(roomId: string): Promise<Room> {
    const room = this.cache.getKeyInNamespace<Room>([NAMESPACES.ROOM], roomId);
    return room;
  }

  /**
   * Delete room given room id
   * @param roomId Id of room
   */
  async deleteRoom(roomId: string) {
    this.cache.deleteKeyInNamespace([NAMESPACES.ROOM], roomId);
  }
}
