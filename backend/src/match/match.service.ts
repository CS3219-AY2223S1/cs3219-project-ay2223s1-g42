import { tryit } from "radash";

import { NAMESPACES } from "src/cache/constants";
import { RedisCacheService } from "src/cache/redisCache.service";
import { PoolUser } from "./match.gateway";
import { RoomService } from "src/room/room.service";
import { Injectable, Inject, forwardRef } from "@nestjs/common";

@Injectable()
export class MatchService {
  constructor(
    @Inject(forwardRef(() => RoomService))
    private roomService: RoomService,
    private cache: RedisCacheService
  ) {}

  /**
   * Verifies if user has already been matched by checking
   * if user is in a room
   * @param user User
   * @returns [`Error`, Room ID]
   */
  async handleUserAlreadyMatched(user: PoolUser) {
    const res = await tryit(this.roomService.getRoomIdFromUserId)(
      user.id.toString()
    );
    return res;
  }

  /**
   * Attempts to matche user with other user(s) in the difficulty
   * queues selected by the user, if no other users found, will add
   * the user to the difficulty queues selected + queue users channel.
   * @param user new user attempting to join the queue
   * @returns (optional) room data if user was matched, otherwise undefined
   */
  async handleJoinMatchQueue(user: PoolUser) {
    // search for all other users in all difficulty namespaces user has selected
    const fetchAllMatchedUsers = user.difficulties.map(
      async (difficulty) =>
        await this.cache.getAllKeysInNamespace([NAMESPACES.MATCH, difficulty])
    );
    const allMatchedUsers = await Promise.all(fetchAllMatchedUsers);
    const matchedUsers = Array.from(new Set(allMatchedUsers.flat()));

    // if any other users are found, return and match user w the first user returned
    if (matchedUsers.length > 0) {
      // get user to be matched with
      const matchedUserId = matchedUsers[0];
      const matchedUser = await this.cache.getKeyInNamespace<PoolUser>(
        [NAMESPACES.MATCH, NAMESPACES.USERS],
        matchedUserId
      );

      // create room and store all users as room users
      const newRoom = await this.roomService.createRoom([user, matchedUser]);

      // remove all users from match queues
      const disconnectAllUsers = newRoom.users.map(
        async (user) => await this.disconnectFromMatchQueue(user)
      );
      await Promise.all(disconnectAllUsers);

      // return new room
      return newRoom;
    }

    // otherwise, add user to queued users namespace
    this.cache.setKeyInNamespace(
      [NAMESPACES.MATCH, NAMESPACES.USERS],
      user.id.toString(),
      user
    );

    // add user to all difficulty namespaces selected
    const addToAllQueues = user.difficulties.map(
      async (difficulty) =>
        await this.cache.setKeyInNamespace(
          [NAMESPACES.MATCH, difficulty],
          user.id.toString(),
          user
        )
    );
    await Promise.all(addToAllQueues);
  }

  /**
   * Disconnects user from all selected difficulty namespaces
   * and from the queued users namespaces
   * @param user User to be disconnected
   */
  async disconnectFromMatchQueue(user: PoolUser) {
    // remove user from queued users namespace
    await this.cache.deleteKeyInNamespace(
      [NAMESPACES.MATCH, NAMESPACES.USERS],
      user.id.toString()
    );

    // remove user from all difficulty namespaces selected
    const deleteFromAllQueues = user.difficulties.map(
      async (difficulty) =>
        await this.cache.deleteKeyInNamespace(
          [NAMESPACES.MATCH, difficulty],
          user.id.toString()
        )
    );
    await Promise.all(deleteFromAllQueues);
  }

  async getQueueUserFromId(userId: string) {
    const res = await tryit(this.cache.getKeyInNamespace<PoolUser>)(
      [NAMESPACES.MATCH, NAMESPACES.USERS],
      userId
    );
    return res;
  }
}
