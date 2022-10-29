import { v4 } from "uuid";
import { Injectable } from "@nestjs/common";

import { NAMESPACES, PoolUser, Room, RoomUser } from "shared/api";
import { RedisCacheService } from "src/cache/redisCache.service";

@Injectable()
export class RoomService {
  constructor(private cache: RedisCacheService) {}

  async getRoomIdFromUserId(userId: string) {
    try {
      const res = await this.cache.getKeyInNamespace<string>(
        [NAMESPACES.ROOM, NAMESPACES.USERS],
        userId
      );
      return res;
    } catch (err) {
      console.error(err);
      return;
    }
  }

  async createRoom(users: PoolUser[]): Promise<Room> {
    // create room
    console.log("creating room for: ", { users });
    const roomId = v4();
    const roomUsers: RoomUser[] = Array.from(
      new Set(
        users.map((user) => {
          return { ...user, connected: false };
        })
      )
    );
    const allDifficulties = roomUsers.map((user) => user.difficulties);
    const commonDifficulties = allDifficulties.reduce((p, c) =>
      p.filter((d) => c.includes(d))
    );

    const room: Room = {
      id: roomId,
      users: roomUsers,
      difficulties: commonDifficulties,
    };

    try {
      await this.setRoom(room);

      // add user to room users (store room id of each user in a room)
      const addRoomedUsers = room.users.map(async (user) => {
        await this.addUserAsRoomUser(room.id, user.id.toString());
      });

      // throw if error occurred while adding room users
      await Promise.all(addRoomedUsers);

      return room;
    } catch (err) {
      console.error(err);
      return;
    }
  }

  async addUserToRoom(room: Room, user: RoomUser): Promise<Room> {
    // update users in room
    const newUsers = room.users.filter((u) => u.id !== user.id).concat(user);
    const newRoom: Room = {
      ...room,
      users: newUsers,
    };
    await this.setRoom(newRoom);

    // add user to room users (store room id of each user in a room)
    await this.addUserAsRoomUser(room.id, user.id.toString());
    return newRoom;
  }

  async removeUserFromRoom(room: Room, userId: number): Promise<Room> {
    // update users in room
    const remainingUsers = room.users.filter((user) => user.id !== userId);
    const newRoom: Room = {
      ...room,
      users: remainingUsers,
    };
    await this.setRoom(newRoom);

    // remove user from room users
    await this.removeUserAsRoomUser(userId.toString());
    return newRoom;
  }

  async addUserAsRoomUser(roomId: string, userId: string) {
    await this.cache.setKeyInNamespace(
      [NAMESPACES.ROOM, NAMESPACES.USERS],
      userId,
      roomId
    );
  }

  async removeUserAsRoomUser(userId: string) {
    await this.cache.deleteKeyInNamespace(
      [NAMESPACES.ROOM, NAMESPACES.USERS],
      userId
    );
  }

  /**
   * Get room data from room id
   * @param roomId Id of room
   * @returns room data
   */
  async getRoomFromId(roomId: string) {
    const room = await this.cache.getKeyInNamespace<Room>(
      [NAMESPACES.ROOM],
      roomId
    );
    return room;
  }

  /**
   * Set room data
   * @param room Room data
   */
  async setRoom(room: Room) {
    await this.cache.setKeyInNamespace([NAMESPACES.ROOM], room.id, room);
  }

  /**
   * Delete room given room id
   * @param roomId Id of room
   */
  async deleteRoom(roomId: string) {
    await this.cache.deleteKeyInNamespace([NAMESPACES.ROOM], roomId);
  }
}
