import { Test } from "@nestjs/testing";
import PrismaKnownErrorHandling from "src/utils/prisma-error-handling";

import { UserController } from "../src/user/user.controller";
import { UserService } from "../src/user/user.service";
import { AuthController } from "../src/auth/auth.controller";
import { AuthService } from "../src/auth/auth.service";

const mockUserService = {
  getMe: jest.fn().mockImplementation((user) => user),
  getUser: jest.fn().mockImplementation((id) => id),
  editUser: jest.fn().mockImplementation((id, userInfo) => ({
    id,
    ...userInfo,
  })),
  deleteUser: jest.fn().mockImplementation((id) => id),
};

const mockAuthService = {
  signin: jest.fn().mockImplementation((userInfo) => ({
    ...userInfo,
  })),
};

describe("Testing the User Controller", async () => {
  let userController: UserController;
  let userService: UserService;
  let authController: AuthController;
  let authService: AuthService;

  //Create mock user
  const [err, user] = await userService.create(
    "test@example.com",
    "Test",
    "SecurePassword"
  );

  if (err) {
    PrismaKnownErrorHandling(err);
  }

  const testUserId = user.id;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    userController = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get<UserService>(UserService);
    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe("Test: Controller is defined", () => {
    it("Should be defined", () => {
      expect(userController).toBeDefined();
    });
  });

  describe(`Test: @Get(":id")`, () => {
    it("Should get the user that is created", () => {
      expect(mockUserService.getUser(testUserId)).toEqual({
        email: user.email,
        username: user.username,
        hash: user.hash,
      });
      expect(mockUserService.getUser).toHaveBeenCalled();
    });
  });

  describe(`Test: @Patch(":id")`, () => {
    it("Should get the user that is updated", () => {
      expect(
        mockUserService.editUser(testUserId, {
          username: "testtest",
        })
      ).toEqual({
        email: user.email,
        username: user.username,
        hash: user.hash,
      });
    });
    expect(mockUserService.editUser).toHaveBeenCalled();
  });

  describe(`Test: @Delete(":id")`, () => {
    it("Should get deleted user's info", () => {
      expect(mockUserService.deleteUser(testUserId)).toEqual({
        email: user.email,
        username: user.username,
        hash: user.hash,
      });
      expect(mockUserService.deleteUser).toHaveBeenCalled();
    });
  });

  describe(`Test: @Get("me")`, () => {
    it("Should get the current user", () => {
      //Sign in
      mockAuthService.signin({
        email: user.email,
        hash: user.hash,
      });

      expect(user).toEqual({
        email: user.email,
        username: user.username,
        hash: user.hash,
      });

      expect(mockUserService.getMe).toHaveBeenCalled();
    });
  });
});
