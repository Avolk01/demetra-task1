import { UserController } from '../controllers';
import { UserService } from '../providers';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async (): Promise<void> => {
    userService = {
      register: jest.fn(),
      login: jest.fn(),
      getProfile: jest.fn(),
      getUsers: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    } as unknown as UserService;

    userController = new UserController(userService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('register', (): void => {
    it('Регистрация пользователя', async (): Promise<void> => {
      const data = {
        login: 'test',
        email: 'test@test.com',
        password: 'test',
        age: 20,
      };

      const token = { access_token: 'token' };

      jest.spyOn(userController, 'register').mockResolvedValue(token);

      const res = await userController.register(data);

      expect(userController.register).toHaveBeenCalledWith(data);
      expect(res.access_token).toEqual(token.access_token);
    });
  });
});
