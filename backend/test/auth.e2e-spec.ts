import { Test, TestingModule } from "@nestjs/testing";
import { CACHE_MANAGER, INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { PrismaClient } from "@prisma/client";
import { v4 } from "uuid";
import * as randomstring from "randomstring";
import { Cache } from "cache-manager";

import { AppModule } from "../src/app.module";
import { AuthController } from "../src/auth/auth.controller";
import { UserService } from "../src/user/user.service";
import { AuthService } from "../src/auth/auth.service";
import { UserController } from "../src/user/user.controller";
import { PrismaService } from "../src/prisma/prisma.service";
import { RedisCacheService } from "../src/cache/redisCache.service";
import { NAMESPACES } from "../src/cache/constants";
import { AuthModule } from "../src/auth/auth.module";
import { UserModule } from "../src/user/user.module";
import { RedisCacheModule } from "../src/cache/redisCache.module";

type CacheableUserFields = {
  email: string;
  username: string;
  hash: string;
};

type CacheableResetEmail = {
  userId: number;
  username: string;
  email: string;
};

describe("AuthController (e2e)", () => {
  let app: INestApplication;
  let authService: AuthService;
  let userService: UserService;
  let redis: RedisCacheService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule, UserModule, RedisCacheModule],
      providers: [UserService, UserService],
    }).compile();

    app = moduleFixture.createNestApplication();
    userService = moduleFixture.get(UserService);
    redis = moduleFixture.get(RedisCacheService);
    authService = moduleFixture.get(AuthService);
    await app.init();
  });

  describe(`Test @POST("/auth/local/signup)`, () => {
    test("Should return status code 201 if sign up is successful", async () => {
      const signUpDTO = {
        email:
          randomstring.generate({
            length: 8,
            charset: "alphabetic",
          }) + "@example.com",
        username: randomstring.generate(8),
        password: randomstring.generate(8),
      };

      const res = await request(app.getHttpServer())
        .post("/auth/local/signup")
        .send(signUpDTO);

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("success");
    });
  });

  describe(`Test @POST("/auth/local/signin)`, () => {
    it("Should return status code 200 if sign in is successful", async () => {
      const newUser = {
        email:
          randomstring.generate({
            length: 8,
            charset: "alphabetic",
          }) + "@example.com",
        username: randomstring.generate(8),
        password: randomstring.generate(8),
      };

      //User is added into the database
      const [err, user] = await userService.create(
        newUser.email,
        newUser.username,
        newUser.password
      );

      const verificationToken = v4();
      await redis.setKeyInNamespace<CacheableUserFields>(
        [NAMESPACES.AUTH],
        verificationToken,
        {
          email: newUser.email,
          username: newUser.username,
          hash: newUser.password,
        }
      );

      await redis.setKeyInNamespace<string>(
        [NAMESPACES.AUTH],
        newUser.email,
        verificationToken
      );

      await redis.deleteKeyInNamespace([NAMESPACES.AUTH], verificationToken);
      await redis.deleteKeyInNamespace([NAMESPACES.AUTH], newUser.email);

      const res = await request(app.getHttpServer())
        .post("/auth/local/signin")
        .send({
          email: newUser.email,
          password: newUser.password,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("success");
      expect(user.email).toBe(newUser.email);
      expect(user.username).toBe(newUser.username);
    });
  });

  /*
  //Todo
  describe(`Test @POST("/auth/signout)`, () => {
    it("Should return status code 200 if signout is successful", async () => {
      //Need to signin first
      const signInDTO = {
        email: "test1@example.com",
        username: "testuser1",
        password: "testpassword",
      };

      const res = await request(app.getHttpServer())
        .post("/auth/local/signin")
        .send(signInDTO);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("success");
    });
  });

  //Todo
  describe(`Test @GET("/auth/refresh)`, () => {
    it("Should return status code 200 if refresh is successful", async () => {
      //Need to signin first
      const signInDTO = {
        email: "test1@example.com",
        username: "testuser1",
        password: "testpassword",
      };

      const res = await request(app.getHttpServer())
        .post("/auth/local/signin")
        .send(signInDTO);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("success");
    });
  });

  //Todo
  describe(`Test @POST("/verify/:token)`, () => {
    it("Should return status code 200 if refresh is successful", async () => {
      //Need to signin first
      const signInDTO = {
        email: "test1@example.com",
        username: "testuser1",
        password: "testpassword",
      };

      const res = await request(app.getHttpServer())
        .post("/auth/local/signin")
        .send(signInDTO);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("success");
    });
  });

  //Todo
  describe(`Test @POST("/auth/forget-paassword)`, () => {
    it("Should return status code 200 if forget-password is successful", async () => {
      const forgetPasswordDTO = {
        email: "test1@example.com",
      };

      const res = await request(app.getHttpServer())
        .post("/auth/forget-password")
        .send(forgetPasswordDTO);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("success");
    });
  });

  //Todo
  describe(`Test @POST("/auth/reset-paassword)`, () => {
    it("Should return status code 200 if reset-password is successful", async () => {
      const resetPasswordDTO = {
        token: "placeholder",
        password: "newPassword",
      };

      const res = await request(app.getHttpServer())
        .post("/auth/reset-password")
        .send(resetPasswordDTO);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("success");
    });
  });
  */
});
