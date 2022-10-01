import { Injectable, Inject, forwardRef } from "@nestjs/common";

import { RedisCacheService } from "src/cache/redisCache.service";
import { RoomService } from "src/room/room.service";
import { MATCH_ERRORS, NAMESPACES, PoolUser } from "shared/api";

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
    const roomId = await this.roomService.getRoomIdFromUserId(
      user.id.toString()
    );
    return roomId;
  }

  async handleFindMatchingUserIds(user: PoolUser): Promise<string[]> {
    try {
      // search for all other users in all difficulty namespaces user has selected
      const fetchAllMatchedUserIds = user.difficulties.map(
        async (difficulty) => {
          const userIds = await this.cache.getAllKeysInNamespace([
            NAMESPACES.MATCH,
            difficulty,
          ]);
          return userIds;
        }
      );
      const fetchAllMatchedUserIdsRes = await Promise.all(
        fetchAllMatchedUserIds
      );
      const matchedUserIds = Array.from(
        new Set(fetchAllMatchedUserIdsRes.flat())
      );
      return matchedUserIds;
    } catch (err) {
      console.error(err);
      throw new Error(MATCH_ERRORS.HANDLE_FIND_MATCHING_USER_IDS);
    }
  }

  async handleFoundMatches(user: PoolUser, matchingUserIds: string[]) {
    // no matching user ids found, break
    if (matchingUserIds.length === 0) {
      return;
    }

    // if any other users are found, return and match user
    // w the first user returned
    try {
      const matchedUserId = matchingUserIds[0];
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
    } catch (err) {
      console.error(err);
      throw new Error(MATCH_ERRORS.HANDLE_FOUND_MATCH);
    }
  }

  /**
   * Attempts to matche user with other user(s) in the difficulty
   * queues selected by the user, if no other users found, will add
   * the user to the difficulty queues selected + queue users channel.
   * @param user new user attempting to join the queue
   * @returns (optional) room data if user was matched, otherwise undefined
   */
  async handleJoinMatchQueue(user: PoolUser) {
    try {
      // otherwise, add user to queued users namespace
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
    } catch (err) {
      console.error(err);
      throw new Error(MATCH_ERRORS.HANDLE_JOIN_MATCH_QUEUE);
    }
  }

  /**
   * Disconnects user from all selected difficulty namespaces
   * and from the queued users namespaces
   * @param user User to be disconnected
   */
  async disconnectFromMatchQueue(user: PoolUser) {
    try {
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
    } catch (err) {
      console.error(err);
      throw new Error(MATCH_ERRORS.HANDLE_LEAVE_MATCH_QUEUE);
    }
  }

  async getQueueUserFromId(userId: string) {
    const poolUser = await this.cache.getKeyInNamespace<PoolUser>(
      [NAMESPACES.MATCH, NAMESPACES.USERS],
      userId
    );
    return poolUser;
  }
}
