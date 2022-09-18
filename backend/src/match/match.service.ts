<<<<<<< HEAD
<<<<<<< HEAD
import { forwardRef, Inject, Injectable } from "@nestjs/common";
=======
import { Injectable, Scope } from "@nestjs/common";
=======
import { forwardRef, Inject, Injectable } from "@nestjs/common";
>>>>>>> feat: fix dep injection bug with circular dep fix
import { Socket } from "socket.io";
>>>>>>> feat: tmoved all websockets to redis, tdebugging undefined dep injection

import { NAMESPACES } from "src/cache/constants";
import { RedisCacheService } from "src/cache/redisCache.service";
import { PoolUser } from "./match.gateway";
import { RoomService } from "src/room/room.service";

<<<<<<< HEAD
<<<<<<< HEAD
@Injectable()
export class MatchService {
  constructor(
    @Inject(forwardRef(() => RoomService))
    private roomService: RoomService,
    private cache: RedisCacheService
  ) {}
=======
Injectable({ scope: Scope.DEFAULT });
export class MatchService {
  constructor(
    private cache: RedisCacheService,
    private roomService: RoomService
  ) {
    console.log("room service: ", roomService);
    console.log("cache service: ", cache);
  }
>>>>>>> feat: tmoved all websockets to redis, tdebugging undefined dep injection
=======
@Injectable()
export class MatchService {
  constructor(
    @Inject(forwardRef(() => RoomService))
    private roomService: RoomService,
    private cache: RedisCacheService
  ) {}
>>>>>>> feat: fix dep injection bug with circular dep fix

  /**
   * Verifies if user has already been matched by checking
   * if user is in a room
   * @param user User
   * @returns existing room data
   */
  async handleUserAlreadyMatched(user: PoolUser) {
<<<<<<< HEAD
<<<<<<< HEAD
=======
    console.log(this.roomService);
    console.log(this.cache);
>>>>>>> feat: tmoved all websockets to redis, tdebugging undefined dep injection
=======
>>>>>>> feat: fix dep injection bug with circular dep fix
    const existingRoom = await this.roomService.getRoomFromUserId(
      user.id.toString()
    );
    return existingRoom;
  }

<<<<<<< HEAD
  /**
   * Attempts to matche user with other user(s) in the difficulty
   * queues selected by the user, if no other users found, will add
   * the user to the difficulty queues selected.
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
=======
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
>>>>>>> feat: tmoved all websockets to redis, tdebugging undefined dep injection
      const matchedUserId = matchedUsers[0];
      const matchedUser = await this.cache.getKeyInNamespace<PoolUser>(
        [NAMESPACES.MATCH, NAMESPACES.USERS],
        matchedUserId
      );
<<<<<<< HEAD
<<<<<<< HEAD

      // create room and store all users as room users
      const newRoom = await this.roomService.createRoom([user, matchedUser]);

      // remove all users from match queues
      const disconnectAllUsers = newRoom.users.map(
        async (user) => await this.disconnectFromMatchQueue(user)
      );
      await Promise.all(disconnectAllUsers);

      // return new room
=======
=======
      console.log("users of new room: ", [user, matchedUser]);
>>>>>>> feat: fix dep injection bug with circular dep fix
      const newRoom = this.roomService.createRoom([user, matchedUser]);
>>>>>>> feat: tmoved all websockets to redis, tdebugging undefined dep injection
      return newRoom;
    }

    // otherwise, add user to queued users namespace
    this.cache.setKeyInNamespace(
      [NAMESPACES.MATCH, NAMESPACES.USERS],
      user.id.toString(),
      user
    );

<<<<<<< HEAD
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
=======
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
>>>>>>> feat: tmoved all websockets to redis, tdebugging undefined dep injection
  async disconnectFromMatchQueue(user: PoolUser) {
    console.log(
      `disconnecting user ${user.id} from ${user.difficulties} queues...`
    );
    // remove user from queued users namespace
    this.cache.deleteKeyInNamespace(
      [NAMESPACES.MATCH, NAMESPACES.USERS],
      user.id.toString()
    );
<<<<<<< HEAD

    // remove user from all difficulty namespaces selected
    const deleteFromAllQueues = user.difficulties.map(
      async (difficulty) =>
        await this.cache.deleteKeyInNamespace(
          [NAMESPACES.MATCH, difficulty],
          user.id.toString()
        )
    );
    await Promise.all(deleteFromAllQueues);
=======
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
>>>>>>> feat: tmoved all websockets to redis, tdebugging undefined dep injection
  }
}
