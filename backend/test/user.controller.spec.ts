import { UserController } from "../src/user/user.controller";
import { UserService } from "../src/user/user.service";
import { Test } from "@nestjs/testing";
import { ModuleRef } from "@nestjs/core";
import { Delete } from "@nestjs/common";

const mockUserService = {
  find: jest.fn().mockReturnValue([
    new Error("test"),
    {
      id: 10,
      email: "test@example.com",
      username: "test",
      password: "tteeeessttt",
    },
  ]),
  update: jest.fn().mockReturnValue({
    email: "testy@example.com",
    username: "testy",
  }),
  delete: jest.fn().mockReturnValue([
    new Error("test"),
    {
      id: 10,
      email: "test@example.com",
      username: "test",
      password: "tteeeessttt",
    },
  ]),
  create: jest.fn().mockImplementation((userInfo) => ({
    ...userInfo,
  })),
};

describe("Testing the User Controller", () => {
  let userController: UserController;
  let userService: UserService;

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
  });

  describe("Test: Controller is defined", () => {
    it("Should be defined", () => {
      expect(userController).toBeDefined();
    });
  });

  describe(`Test: @get("me")`, () => {
    it("Should return user", () => {
      const user = mockUserService.create({
        email: "test@example.com",
        username: "test",
        password: "tteeeessttt",
      });
      expect(userController.getMe(user)).toBe(user);
      expect(mockUserService.create).toHaveBeenCalledWith(user);
    });
  });

  describe(`Test: @get(":id")`, () => {
    it("Should return user with the specified id", async () => {
      const user = mockUserService.create({
        id: 10,
        email: "test@example.com",
        username: "test",
        password: "tteeeessttt",
      });

      expect(await userController.getUser("10")).toStrictEqual(user);
    });
  });

  describe(`Test: @PATCH(":id")`, () => {
    it("Should update user", async () => {
      const user = mockUserService.create({
        id: 10,
        email: "test@example.com",
        username: "test",
        password: "tteeeessttt",
      });
      const updatedUser = mockUserService.create({
        email: "testy@example.com",
        username: "testy",
      });
      expect(
        await userController.editUser(user, "10", {
          email: "testy@example.com",
          username: "testy",
        })
      ).toStrictEqual(updatedUser);
      //expect(await mockUserService.update).toHaveBeenCalledWith(user);
    });
  });

  describe(`Test: @DELETE(":id")`, () => {
    it("Should delete user", async () => {
      const user = mockUserService.create({
        id: 10,
        email: "test@example.com",
        username: "test",
        password: "tteeeessttt",
      });
      expect(await userController.deleteUser(user, "10")).toStrictEqual(user);
      //expect(await mockUserService.update).toHaveBeenCalledWith(user);
    });
  });
});
