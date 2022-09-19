import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { PrismaClient } from "@prisma/client";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import { v4 } from "uuid";

import { AppModule } from "../src/app.module";
import { AuthController } from "../src/auth/auth.controller";
import { UserService } from "../src/user/user.service";
import { AuthService } from "../src/auth/auth.service";
import { UserController } from "../src/user/user.controller";
import { PrismaService } from "../src/prisma/prisma.service";
import { RedisCacheService } from "../src/cache/redisCache.service";

describe("AuthController (e2e)", () => {
  let app: INestApplication;
  let authService: AuthService;
  let userService: UserService;
  let prisma: DeepMockProxy<PrismaClient>;
  let redis: RedisCacheService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [],
    }).compile();

    const userServiceProvider: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        PrismaService,
        {
          provide: RedisCacheService,
          useValue: {
            get: () => jest.fn(),
            set: () => jest.fn(),
            delete: () => jest.fn(),
          },
        },
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    userService = userServiceProvider.get(UserService);
    prisma = userServiceProvider.get(PrismaService);
    redis = userServiceProvider.get(RedisCacheService);

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe(`Test @POST("/auth/local/signup)`, () => {
    it("Should return status code 201 if sign up is successful", async () => {
      const signUpDTO = {
        email: "test1@example.com",
        username: "testuser1",
        password: "testpassword",
      };

      const res = await request(app.getHttpServer())
        .post("/auth/local/signup")
        .send(signUpDTO);

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("success");
    });
  });

  //Todo
  describe(`Test @POST("/auth/local/signin)`, () => {
    it("Should return status code 200 if sign in is successful", async () => {
      const newUser = {
        email: "newuser1@example.com",
        username: "newuser1",
        password: "newUser420",
      };

      //User is added into the database
      const [err, user] = await userService.create(
        newUser.email,
        newUser.username,
        newUser.password
      );

      const spyRedisSet = jest.spyOn(redis, "set");
      const verificationToken = v4();
      redis.set(newUser.email, verificationToken);

      //Need to mock the auth service to be able to read redis
      const res = await request(app.getHttpServer())
        .post("/auth/local/signin")
        .send({
          email: newUser.email,
          password: newUser.password,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("success");
      expect(user).toBe(newUser);
    });
  });

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

  afterAll(async () => {
    await app.close();
  });
});
