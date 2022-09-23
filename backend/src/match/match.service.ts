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
    const res = await this.roomService.getRoomIdFromUserId(user.id.toString());
    return res;
  }

  async handleFindMatchingUsers(user: PoolUser) {
    // search for all other users in all difficulty namespaces user has selected
    const fetchAllMatchedUsers = user.difficulties.map(async (difficulty) => {
      const res = await tryit(this.cache.getAllKeysInNamespace)([
        NAMESPACES.MATCH,
        difficulty,
      ]);
      return res;
    });
    const fetchAllMatchedUsersRes = await Promise.all(fetchAllMatchedUsers);

    // handle errors from fetching matched users of different difficulties
    const allMatchedUsers = fetchAllMatchedUsersRes.map(
      ([err, matchedDifficultyUsers]) => {
        if (!err && matchedDifficultyUsers.length > 0) {
          return matchedDifficultyUsers;
        }
      }
    );
    const matchedUsers = Array.from(new Set(allMatchedUsers.flat()));
    return matchedUsers;
  }

  async handleFoundMatches(user: PoolUser, matchingUserIds: string[]) {
    if (matchingUserIds.length === 0) {
      // no matching user ids found, break
      return;
    }

    // if any other users are found, return and match user w the first user returned
    // get user to be matched with
    const matchedUserId = matchingUserIds[0];
    const matchedUser = await this.cache.getKeyInNamespace<PoolUser>(
      [NAMESPACES.MATCH, NAMESPACES.USERS],
      matchedUserId
    );

    // create room and store all users as room users
    const [, newRoom] = await this.roomService.createRoom([user, matchedUser]);

    // remove all users from match queues
    const disconnectAllUsers = newRoom.users.map(
      async (user) => await this.disconnectFromMatchQueue(user)
    );
    await Promise.all(disconnectAllUsers);

    // return new room
    return newRoom;
  }

  /**
   * Attempts to matche user with other user(s) in the difficulty
   * queues selected by the user, if no other users found, will add
   * the user to the difficulty queues selected + queue users channel.
   * @param user new user attempting to join the queue
   * @returns (optional) room data if user was matched, otherwise undefined
   */
  async handleJoinMatchQueue(user: PoolUser) {
    // otherwise, add user to queued users namespace
    console.log({ user, id: user.id.toString() });
    await this.cache.setKeyInNamespace(
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
