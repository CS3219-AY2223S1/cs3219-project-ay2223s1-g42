import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { v4 } from "uuid";
import * as randomstring from "randomstring";

import { AppModule } from "src/app.module";
import { AuthController } from "src/auth/auth.controller";
import { UserService } from "src/user/user.service";
import { AuthService } from "src/auth/auth.service";
import { RedisCacheService } from "src/cache/redisCache.service";
import { NAMESPACES } from "shared/api";
import { AuthModule } from "src/auth/auth.module";
import { UserModule } from "src/user/user.module";
import { RedisCacheModule } from "src/cache/redisCache.module";

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
  let authController: AuthController;

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

  //Valid Sign up
  describe(`Test @POST("/auth/local/signup for valid input)`, () => {
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

  //Invalid Sign up
  describe(`Test @POST("/auth/local/signup for invalid Input)`, () => {
    test("Should return status code 403 if sign up is unsuccessful", async () => {
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

      //Verify that user is created
      const [errFind, findUser] = await userService.findByEmail(user.email);

      //expect user to be created
      expect(findUser.email).toBe(newUser.email);
      expect(findUser.username).toBe(newUser.username);

      const res = await request(app.getHttpServer())
        .post("/auth/local/signup")
        .send(newUser);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe("Email already in use");

      //Clean up
      userService.delete(user.id);
    });
  });

  describe(`Test @POST("/auth/local/signin) for valid input`, () => {
    test("Should return status code 200 if sign in is successful", async () => {
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

      //Clean up
      userService.delete(user.id);
    });
  });

  //Test status code 400 bad request invalid input for signin page
  describe(`Test @POST("/auth/local/signin) for invalid input`, () => {
    test("Should return status code 400 if sign in is unsuccessful", async () => {
      const user = {
        email:
          randomstring.generate({
            length: 8,
            charset: "alphabetic",
          }) + "@example.com",
        username: randomstring.generate(8),
        password: randomstring.generate(8),
      };

      const missingPassword = await request(app.getHttpServer())
        .post("/auth/local/signin")
        .send({
          email: user.email,
        });

      expect(missingPassword.statusCode).toBe(400);
      expect(missingPassword.body.message).toBe("Validation failed");

      const missingEmail = await request(app.getHttpServer())
        .post("/auth/local/signin")
        .send({
          password: user.password,
        });

      expect(missingEmail.statusCode).toBe(400);
      expect(missingEmail.body.message).toBe("Validation failed");
    });
  });

  //Test 403 invalid credentials for existing users for the signin page
  describe(`Test @POST("/auth/local/signin) for invalid input`, () => {
    test("Should return status code 403 if sign in is unsuccessful", async () => {
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

      //Verify that user is created
      const [errFind, findUser] = await userService.findByEmail(user.email);

      //expect user to be created
      expect(findUser.email).toBe(newUser.email);
      expect(findUser.username).toBe(newUser.username);

      const invalidPassword = await request(app.getHttpServer())
        .post("/auth/local/signin")
        .send({
          email: user.email,
          password: randomstring.generate(8),
        });

      expect(invalidPassword.statusCode).toBe(403);
      expect(invalidPassword.body.message).toBe("Invalid credentials");

      const invalidEmail = await request(app.getHttpServer())
        .post("/auth/local/signin")
        .send({
          email: randomstring.generate(8) + "@example.com",
          password: newUser.password,
        });

      expect(invalidEmail.statusCode).toBe(403);
      expect(invalidEmail.body.message).toBe("Forbidden");

      //Clean up
      userService.delete(user.id);
    });
  });

  //valid token
  describe(`Test @POST("/verify/:token)`, () => {
    test("Should return status code 200 if verify is successful", async () => {
      const newUser = {
        email:
          randomstring.generate({
            length: 8,
            charset: "alphabetic",
          }) + "@example.com",
        username: randomstring.generate(8),
        password: randomstring.generate(8),
      };

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

      const res = await request(app.getHttpServer())
        .post(`/auth/verify/${verificationToken}`)
        .send(verificationToken);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("success");
    });
  });

  //Invalid Token
  describe(`Test @POST("/verify/:token)`, () => {
    test("Should return status code 200 if verify is successful", async () => {
      const newUser = {
        email:
          randomstring.generate({
            length: 8,
            charset: "alphabetic",
          }) + "@example.com",
        username: randomstring.generate(8),
        password: randomstring.generate(8),
      };

      const verificationToken = v4();
      const res = await request(app.getHttpServer())
        .post(`/auth/verify/${verificationToken}`)
        .send(verificationToken);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe("Email verification token is invalid");
    });
  });

  //Valid forget-password request, no invalid test case
  describe(`Test @POST("/auth/forget-password)`, () => {
    test("Should return status code 201 if forget-password is successful", async () => {
      const forgetPasswordDTO = {
        email: "test1@example.com",
      };

      const res = await request(app.getHttpServer())
        .post("/auth/forget-password")
        .send(forgetPasswordDTO);

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("success");
    });
  });

  //Valid reset-password
  describe(`Test @POST("/auth/reset-password)`, () => {
    test("Should return status code 200 if reset-password is successful", async () => {
      const newUser = {
        email:
          randomstring.generate({
            length: 8,
            charset: "alphabetic",
          }) + "@example.com",
        username: randomstring.generate(8),
        password: randomstring.generate(8),
      };

      const forgetPasswordDTO = {
        email: newUser.email,
      };

      const [err, user] = await userService.create(
        newUser.email,
        newUser.username,
        newUser.password
      );

      const username = user.username;
      const userId = user.id;
      const email = user.email;

      //Reset password
      const resetPasswordVerificationToken = v4();
      await redis.setKeyInNamespace<CacheableResetEmail>(
        [NAMESPACES.AUTH],
        resetPasswordVerificationToken,
        {
          userId,
          username,
          email,
        }
      );

      const resetPasswordDTO = {
        password: newUser.password,
        token: resetPasswordVerificationToken,
      };

      const res = await request(app.getHttpServer())
        .post("/auth/reset-password")
        .send(resetPasswordDTO);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("success");

      //Clean up
      userService.delete(user.id);
    });
  });

  //Invalid reset-password: Invalid credentials status code 400 or missing credentials
  describe(`Test @POST("/auth/reset-password) for invalid credentials`, () => {
    test("Should return status code 400 if reset-password is unsuccessful", async () => {
      const invalidFields = {
        test: "test",
      };

      const noCredentials = await request(app.getHttpServer()).post(
        "/auth/reset-password"
      );

      expect(noCredentials.statusCode).toBe(400);
      expect(noCredentials.body.message).toBe("Validation failed");

      const invalidCredentials = await request(app.getHttpServer())
        .post("/auth/reset-password")
        .send(invalidFields);

      expect(invalidCredentials.statusCode).toBe(400);
      expect(invalidCredentials.body.message).toBe("Validation failed");
    });
  });

  //Invalid reset-password: Invalid token status code 403
  describe(`Test @POST("/auth/reset-password) for invalid credentials`, () => {
    test("Should return status code 403 if reset-password is unsuccessful", async () => {
      const invalidFields = {
        password: "testgsrewijstse",
        token: "test",
      };

      const invalidCredentials = await request(app.getHttpServer())
        .post("/auth/reset-password")
        .send(invalidFields);

      expect(invalidCredentials.statusCode).toBe(403);
      expect(invalidCredentials.body.message).toBe(
        "Email verification token is invalid"
      );
    });
  });
});
