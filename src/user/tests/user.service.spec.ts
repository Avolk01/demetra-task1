import { UserRepository, UserService } from '../providers';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/providers';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let configService: ConfigService;
  let authService: AuthService;

  beforeEach(async (): Promise<void> => {
    configService = {
      get: jest.fn(),
    } as unknown as ConfigService;

    userRepository = {
      findOneByLoginOrEmail: jest.fn(),
      createUser: jest.fn(),
    } as unknown as UserRepository;

    authService = {
      generateToken: jest.fn(),
    } as unknown as AuthService;

    userService = new UserService(authService, userRepository, configService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
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

      jest.spyOn(userService, 'register').mockResolvedValue(token);

      const res = await userService.register(data);

      expect(userService.register).toHaveBeenCalledWith(data);
      expect(res.access_token).toEqual(token.access_token);
    });
  });
});
