import { AuthController } from '.';
import { AuthService } from '../providers';

describe('UserController', () => {
  let userController: AuthController;
  let authService: AuthService;

  beforeEach(async (): Promise<void> => {
    authService = {
      register: jest.fn(),
      login: jest.fn(),
    } as unknown as AuthService;

    userController = new AuthController(authService);
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
