import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Socket } from "socket.io";

import { NAMESPACES } from "src/cache/constants";
import { RedisCacheService } from "src/cache/redisCache.service";
import { PoolUser } from "./match.gateway";
import { RoomService } from "src/room/room.service";

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
   * @returns existing room data
   */
  async handleUserAlreadyMatched(user: PoolUser) {
    const existingRoom = await this.roomService.getRoomFromUserId(
      user.id.toString()
    );
    return existingRoom;
  }

  async handleJoinMatchQueue(user: PoolUser) {
    // search for all other users in the difficulty namespace(s)
    const allMatchedUsers = await Promise.all(
      user.difficulties.map(
        async (difficulty) =>
          await this.cache.getAllKeysInNamespace([NAMESPACES.MATCH, difficulty])
      )
    );
    const matchedUsers = allMatchedUsers.flat();

    console.log("all matched users: ", { matchedUsers });

    // if any other users are found, return and match user w the first user returned
    if (matchedUsers.length > 0) {
      const matchedUserId = matchedUsers[0];
      const matchedUser = await this.cache.getKeyInNamespace<PoolUser>(
        [NAMESPACES.MATCH, NAMESPACES.USERS],
        matchedUserId
      );
      console.log("users of new room: ", [user, matchedUser]);
      const newRoom = this.roomService.createRoom([user, matchedUser]);
      return newRoom;
    }

    // otherwise, add user to queued users namespace
    this.cache.setKeyInNamespace(
      [NAMESPACES.MATCH, NAMESPACES.USERS],
      user.id.toString(),
      user
    );

    // add user to all difficulty queues
    await Promise.all(
      user.difficulties.map(
        async (difficulty) =>
          await this.cache.setKeyInNamespace(
            [NAMESPACES.MATCH, difficulty],
            user.id.toString(),
            user
          )
      )
    );
  }

  // disconnect user from all difficulty queues
  async disconnectFromMatchQueue(user: PoolUser) {
    console.log(
      `disconnecting user ${user.id} from ${user.difficulties} queues...`
    );
    // remove user from queued users namespace
    this.cache.deleteKeyInNamespace(
      [NAMESPACES.MATCH, NAMESPACES.USERS],
      user.id.toString()
    );
    // remove user from all difficulty queues
    await Promise.all(
      user.difficulties.map(
        async (difficulty) =>
          await this.cache.deleteKeyInNamespace(
            [NAMESPACES.MATCH, difficulty],
            user.id.toString()
          )
      )
    );
  }
}
